"""
Pickup Delivery
- Time Matrix
- Time Constraint
- Capacity Constraint
- Doesn't Work if more than 4 vehicles

Assume
- At most 1 hour - 30 mins before appt time pick up patient
- Must Arrive at least 15 mins earlier to destination
- Service starts at 7AM (vehicle depart frm centre)
- Service ends at 5PM (vehicle arrive at centre) *may add some more time to allow traffic jams, emergency etc.

Improve
- Remove patient from vehicle after drop off
"""

import json
from urllib.request import urlopen
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

#####################
# Create Data Model #
#####################
def create_data_model(addresses, timeWindows, deliveryNode, demand):
    """Stores the data for the problem."""
    data = {}
    data['API_key'] = 'AIzaSyDodyAhuZKTVbVwSWt_DcmQvM8e4hyG2rU'
    data["depot"] = 0
    data["num_vehicles"] = ["LDN 1", "LDN 2", "LDN 3", "LDN 4"]
    data["vehicle_capacities"] = [4, 4, 4, 4]
    data['addresses'] = addresses
    data["time_windows"] = timeWindows
    data["pickups_deliveries"] = deliveryNode
    data["demands"] = demand
    return data


######################
# Create Time Matrix #
######################
def create_time_matrix(API_key, addresses):
    # Time Matrix API only accepts 100 elements per request, so get rows in multiple requests.
    max_elements = 100
    num_addresses = len(addresses)  # 16 in this example.

    # Maximum number of rows that can be computed per request (6 in this example).
    max_rows = max_elements // num_addresses

    # num_addresses = q * max_rows + r (q = 2 and r = 4 in this example).
    q, r = divmod(num_addresses, max_rows)
    dest_addresses = addresses
    time_matrix = []

    # Send q requests, returning max_rows rows per request.
    for i in range(q):
        origin_addresses = addresses[i * max_rows: (i + 1) * max_rows]
        response = send_request(origin_addresses, dest_addresses, API_key)
        time_matrix += build_time_matrix(response)

    # Get the remaining remaining r rows, if necessary.
    if r > 0:
        origin_addresses = addresses[q * max_rows: q * max_rows + r]
        response = send_request(origin_addresses, dest_addresses, API_key)
        time_matrix += build_time_matrix(response)
    return time_matrix

def send_request(origin_addresses, dest_addresses, API_key):
    """ Build and send request for the given origin and destination addresses."""
    def build_address_str(addresses):
        # Build a pipe-separated string of addresses
        address_str = ''
        for i in range(len(addresses) - 1):
            address_str += addresses[i] + '|'
        address_str += addresses[-1]
        return address_str
    
    request = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial'
    origin_address_str = build_address_str(origin_addresses)
    dest_address_str = build_address_str(dest_addresses)
    request = request + '&origins=' + origin_address_str + \
        '&destinations=' + dest_address_str + '&key=' + API_key
    jsonResult = urlopen(request).read()
    response = json.loads(jsonResult)
    return response

def build_time_matrix(response):
    """Use seconds for distance matrix"""
    time_matrix = []
    for row in response['rows']:
        row_list = [row['elements'][j]['duration']['value'] for j in range(len(row['elements']))]
        time_matrix.append(row_list)
    return time_matrix


##################
# Store Solution #
##################
def storeSolution(data, manager, routing, solution):
    """Store and return solution"""
    time_dimension = routing.GetDimensionOrDie("Time")

    total_time = 0
    allSchedule = []

    for vehicle_id in range(len(data["num_vehicles"])):
      schedule = {
        'vehicle': '',
        'nodeList': [],
        'timeWindows': [],
        'routeTime': ''
      }

      index = routing.Start(vehicle_id)
      vehicle = data["num_vehicles"][vehicle_id]
      # Store Vehicle
      schedule["vehicle"] = vehicle
    
      route_load = 0
      while not routing.IsEnd(index):
        time_var = time_dimension.CumulVar(index)
        node_index = manager.IndexToNode(index)
        route_load += data["demands"][node_index]

        # Store Node Index
        schedule["nodeList"].append(manager.IndexToNode(index))
        # Store Time Windows
        schedule["timeWindows"].append((solution.Min(time_var),solution.Max(time_var)))
        
        index = solution.Value(routing.NextVar(index))

      time_var = time_dimension.CumulVar(index)

      # Store Route Time
      schedule["routeTime"] = str(round(solution.Min(time_var)/60,2))

      total_time += solution.Min(time_var)
      # Store Node Index
      schedule["nodeList"].append(manager.IndexToNode(index))
      # Store Time Windows
      schedule["timeWindows"].append((solution.Min(time_var),solution.Max(time_var)))
      allSchedule.append(str(schedule))

    # Store Total Time
    total_time = str(round(total_time/60,2))

    return total_time, allSchedule


#############
# Main Code #
#############
def getRoutingSchedule(addresses, timeWindows, deliveryNode, demand):
    """Solve the VRP with time windows."""

    # Instantiate the data model
    data = create_data_model(addresses, timeWindows, deliveryNode, demand)

    # Get time matrix 
    data['time_matrix'] = create_time_matrix(data['API_key'], data['addresses'])

    # Create the routing index manager
    manager = pywrapcp.RoutingIndexManager(len(data["time_matrix"]), len(data["num_vehicles"]), data["depot"])

    # Create Routing Model
    routing = pywrapcp.RoutingModel(manager)

    # Create and register a transit callback
    def time_callback(from_index, to_index):
        """Returns the travel time between the two nodes."""
        # Convert from routing variable Index to time matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data["time_matrix"][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(time_callback)

    # Define cost of each arc
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)


    ###############################
    # Add Time Windows Constraint #
    ###############################
    time = "Time"
    routing.AddDimension(
        transit_callback_index,
        36000,  # allow waiting time (15 mins)
        36000,  # maximum time per vehicle (7AM-5PM service hour)
        False,  # Don't force start cumul to zero.
        time,
    )
    time_dimension = routing.GetDimensionOrDie(time)

    # Add time window constraints for each location except depot
    for location_idx, time_window in enumerate(data["time_windows"]):
        if location_idx == data["depot"]:
            continue
        if time_window[0] is not None:
            index = manager.NodeToIndex(location_idx)
            time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])

    # Add time window constraints for each vehicle start node
    depot_idx = data["depot"]
    for vehicle_id in range(len(data["num_vehicles"])):
        index = routing.Start(vehicle_id)
        time_dimension.CumulVar(index).SetRange(data["time_windows"][depot_idx][0], data["time_windows"][depot_idx][1])

    # Instantiate route start and end times to produce feasible times
    for i in range(len(data["num_vehicles"])):
        routing.AddVariableMinimizedByFinalizer(time_dimension.CumulVar(routing.Start(i)))
        routing.AddVariableMinimizedByFinalizer(time_dimension.CumulVar(routing.End(i)))


    #####################################
    # Add Pick Up Deilivery Constraints #
    #####################################
    for request in data["pickups_deliveries"]:
        pickup_index = manager.NodeToIndex(request[0])
        delivery_index = manager.NodeToIndex(request[1])
        routing.AddPickupAndDelivery(pickup_index, delivery_index)
        routing.solver().Add(routing.VehicleVar(pickup_index) == routing.VehicleVar(delivery_index))


    ###########################
    # Add Capacity Constraint #
    ###########################
    def demand_callback(from_index):
        """Returns the demand of the node."""
        # Convert from routing variable Index to demands NodeIndex.
        from_node = manager.IndexToNode(from_index)
        return data["demands"][from_node]

    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    capacity = "Capacity"
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,  # null capacity slack
        data["vehicle_capacities"],  # vehicle maximum capacities
        True,  # start cumul to zero
        capacity,
    )

    # Setting first solution heuristic
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (routing_enums_pb2.FirstSolutionStrategy.PARALLEL_CHEAPEST_INSERTION)

    # Solve the problem
    solution = routing.SolveWithParameters(search_parameters)

    # Print solution on console
    if solution:
        return(storeSolution(data, manager, routing, solution))
    else:
        return("No Solution!")


