"""
Clean Data extracted from database. 

Return cleaned data for calculating Optimized Routing Schedule.

Return Arguments:
- addressList
- timeWindows
- deliveryNodes
- escort (demand / vehicle capacity)
"""

def convertTimestamp(hour, min):
    startOperation = 7  # 7AM
    return ((hour*60 + min)*60 - startOperation*60*60)


def convertAddr(addr):
    return '+'.join(addr.replace(',', ' ').split())


def convertEscort(escort):
    return 0 if escort == False else 1


def cleanData(apptData):
    # Original Address List
    oriAddressList = ["University of Essex, Wivenhoe Park, Colchester CO4 3S"]

    # All Patient to Pick Up that day
    patientData = []
    for data in apptData:
       oriAddressList.append(data['addrPickUp'])
       patientData.append((convertAddr(data['addrPickUp']), convertAddr(data['addrAppt']), int(data['apptTime'][:2]), int(data['apptTime'][3:5]), convertEscort(data['escort'])))

    # All Hospitals to Visit that day
    uniqueHospital = set()
    hospitalAddr = []
    for data in apptData:
        uniqueHospital.add((data["addrAppt"], data["apptTime"]))
    for hospital in uniqueHospital:
        oriAddressList.append(hospital[0])
        hospitalAddr.append((convertAddr(hospital[0]), int(hospital[1][:2]), int(hospital[1][3:5])))
    
    # Combine All Addresses (patient + hospital) & Escort (patient)
    addressList = ["University+of+Essex+Wivenhoe+Park+Colchester+CO4+3S"]
    escort = [0]
    for i in range(len(patientData)):
      addressList.append(patientData[i][0])
      escort.append(patientData[i][4] + 1)
    for i in range(len(hospitalAddr)):
      addressList.append(hospitalAddr[i][0])
      escort.append(0)

    # Time Windows for Each Location
    timeWindows = [(0, 0)]
    for i in range (len(patientData)):
      time1 = convertTimestamp(patientData[i][2], patientData[i][3]) - 3600 # subtract 1 hour
      time2 = time1 + 1800 # Add 30 mins
      timeWindows.append((time1, time2))
    for i in range (len(hospitalAddr)):
      time1 = convertTimestamp(hospitalAddr[i][1], hospitalAddr[i][2]) - 1800 # subtract 30 mins
      time2 = time1 + 900 # Add 15 mins
      timeWindows.append((time1, time2))

    # Pick Up - Delivery Nodes for that day
    deliveryNodes = []
    for i in range(len(patientData)):
       deliveryNodes.append((i+1, addressList.index(patientData[i][1])))

    return ( oriAddressList, addressList, timeWindows, deliveryNodes, escort )