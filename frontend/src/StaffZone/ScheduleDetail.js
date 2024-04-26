import React, { Component } from "react";
import { useParams } from "react-router-dom";
import ZoneHeader from "../components/StaffZoneHeader";
import Typography from '@mui/material/Typography'
import { Link, Box, Button, Card, Container, Stack, Backdrop, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AuthContext from "../components/AuthContext";
import { APIProvider } from '@vis.gl/react-google-maps';
import './mapPin.css'

// Custom Button
const PageButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  textAlign: 'center',
  fontWeight: 'bold',
  textTransform: 'none',
  width: '135px',
  height: '40px',
  color: theme.palette.text.secondary,
  '&:hover': {
    opacity: '50%',
    backgroundColor: '#D9EAFF',
  }
}));

// Custom Links
const NavLink = styled(Link)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.text.hover
  }
}));

class ScheduleDetail extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      accessToken: '',
      showBackdrop: false,
      pageClicked: '',

      patientAddrs: [],
      hospitalAddrs: [],
      escortList: [],
      schedule: [],
      totalTime: 0,
      numPatient: 0,

      directionsService: '',
      directionsRenderer: '',
      routes: '',
    })

    this.handlePageBtnClick = this.handlePageBtnClick.bind(this);
    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
    this.getRoutingSchedule = this.getRoutingSchedule.bind(this);
  }

  // Handle mouse click target
  handlePageBtnClick(btnID) {
    if (btnID == 'services') {
      this.setState({ pageClicked: 'addStaff' })
    } else {
      this.setState({ pageClicked: 'viewStaff' })
    }
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Save PDF File
  saveAsPDF(date) {
    const capture = document.querySelector('.actual-pdf');
    const fileName = 'routing-schedule-' + date + '.pdf';

    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const pdf = new jsPDF('p', 'px', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save(fileName);
    });
  };

  // Get Optimized Routing Schedule 
  getRoutingSchedule = async (date) => {
    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access

    // Show Backdrop Loading while Retrieving Appointment Data
    this.setState({
      showBackdrop: true,
      accessToken: accessToken,
    })

    // Get Schedule Data via API
    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      // Get Shcedule Data via API
      let res = await axios.get('http://127.0.0.1:8000/api/get-schedule/' + date, config);
      if (res.status === 200) {
        let scheduleData = res.data

        // If data is empty, Generate Schedule Data and Store to Database
        if (scheduleData['date'] === null) {
          res = await axios.get('http://127.0.0.1:8000/api/new-schedule/' + date, config);
          if (res.status === 200) {
            scheduleData = res.data
          }
        }

        // Clean Address List Data
        let addressList = JSON.parse(scheduleData['addressList'].replace(/'/g, '"'));
        let patientAddrs = [], hospitalAddrs = []
        for (let i = 0; i < addressList.length; i++) {
          (i <= scheduleData['numPatient']) ? patientAddrs.push(addressList[i]) : hospitalAddrs.push(addressList[i]);
        }

        // Clean Escort List
        let escortList = scheduleData['escortList'].slice(1, -1).split(', ');

        // Clean Schedule
        let validJson = scheduleData['schedule'].replace(/[\\"]/g, '').replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']');
        let schedule = JSON.parse(validJson)

        this.setState({
          showBackdrop: false,
          totalTime: scheduleData['totalTime'],
          numPatient: scheduleData['numPatient'],
          patientAddrs: patientAddrs,
          hospitalAddrs: hospitalAddrs,
          escortList: escortList,
          schedule: schedule
        }, () => { initMap(addressList, schedule); })
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Convert Time
  convertTime(seconds) {
    seconds += 7 * 60 * 60
    let hour = Math.floor(seconds / 3600)
    let minute = (Math.floor(seconds % 3600) / 60).toFixed(2)

    let time = hour.toString().padStart(2, '0') + ':' + minute.toString()
    return (time)
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Retrieve Context Data immediately after page loaded
    const { date } = this.props.params;

    // Get or Generate Schedule Data on page load
    window.onload = () => {
      this.getRoutingSchedule(date);
    }

    return (
      <div>
        {/* Page Header */}
        <ZoneHeader />

        {/* Backdrop Loading */}
        <Backdrop
          sx={{ color: '#FFF', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showBackdrop}
          onClick={this.handleCloseBackdrop}
        >
          <CircularProgress color="primary" />
        </Backdrop>

        {/* Page Background Img */}
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          pb={'5rem'}
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: '500vh',
            maxWidth: '100vw',
          }}>

          {/* Page Body */}
          <Container
            className="actual-pdf"
            sx={{
              width: '100%',
              pt: '4rem',
              pb: '2rem'
            }}
          >
            {/* Title - Routing Schedule */}
            <Typography
              display='flex'
              variant="h4"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              Routing Schedule {">"} {date}
            </Typography>


            {/* Route Title - Schedules */}
            <Typography
              display='flex'
              variant="h6"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
              mt={'2.5rem'}
              sx={{ textDecoration: 'underline' }}
            >
              Routing Schedules
            </Typography>
            {/* All Schedules */}
            <Box display={'flex'} flexDirection={'column'} rowGap={'0.5rem'}>
              {this.state.schedule.map((schedule) => (
                <Box>
                  {/* Vehicle Plate Number */}
                  <Typography variant='body1'>
                    <b>Route for {schedule.vehicle}:</b>
                  </Typography>

                  {/* Schedule Details */}
                  <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} columnGap={'0.5rem'}>
                    {schedule.nodeList.map((node, index) => (
                      <Typography variant="body1" textAlign={'left'}>
                        Node {node} {'(' + this.convertTime(schedule.timeWindows[index][0]) + ', ' + this.convertTime(schedule.timeWindows[index][1]) + ')'} {index !== schedule.nodeList.length - 1 ? '->' : ''}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>


            {/* Route Title - Routing Map */}
            <Typography
              display='flex'
              variant="h6"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
              mt={'3rem'}
              sx={{ textDecoration: 'underline' }}
            >
              Routing Map
            </Typography>
            {/* Google Map - All Shcedules */}
            <APIProvider apiKey="AIzaSyDodyAhuZKTVbVwSWt_DcmQvM8e4hyG2rU">
              <div id="map" style={{ height: '50vh' }}></div>
            </APIProvider>


            {/* Route Title - Patient Nodes */}
            <Typography
              display='flex'
              variant="h6"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
              mt={'3rem'}
              sx={{ textDecoration: 'underline' }}
            >
              Patient Nodes
            </Typography>
            {/* All Patient Nodes */}
            <Stack
              display={'flex'}
              mt={'0.3rem'}
              mb={'3rem'}
              direction={'column'}
              gap={'0.5rem'}
              alignItems={'left'}
              justifyContent={'center'}
            >
              {this.state.patientAddrs.map((address, index) => (
                <Typography key={index} variant="body1" textAlign='left'>
                  <b>Node {index}</b>: {address}
                </Typography>
              ))}
            </Stack>

            {/* Route Title - Hospital Nodes */}
            <Typography
              display='flex'
              variant="h6"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
              sx={{ textDecoration: 'underline' }}
            >
              Hospital Nodes
            </Typography>
            {/* All Hospital Nodes */}
            <Stack
              display={'flex'}
              mt={'0.3rem'}
              mb={'0.5rem'}
              direction={'column'}
              gap={'0.5rem'}
              alignItems={'left'}
              justifyContent={'center'}
            >
              {this.state.hospitalAddrs.map((address, index) => (
                <Typography key={index} variant="body1" textAlign='left'>
                  <b>Node {index + this.state.numPatient + 1}</b>: {address}
                </Typography>
              ))}
            </Stack>

          </Container>
          <PageButton sx={{ bgcolor: '#BAD9FF' }} onClick={() => this.saveAsPDF(date)}>Save as PDF</PageButton>
        </Box>
      </div >
    )
  }
}

// Wrap class with function to access useNavigate
function Wrapper() {
  return <ScheduleDetail params={useParams()} />;
}

// Initialize Google Map
function initMap(addrList, schedule) {
  var directionsService = new google.maps.DirectionsService();

  var place = new google.maps.LatLng(51.88569957546048, 0.9333481202924858);
  var mapOptions = {
    zoom: 15,
    center: place,
    mapId: '7eb2dbc45832c93a'
  }
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  calculateAndDisplayRoute(directionsService, map, addrList, schedule);
}

// Draw Schedule Routes on Google Map
async function calculateAndDisplayRoute(directionsService, map, addrList, schedule) {

  const routeColor = ['red', 'blue', 'green', 'orange']

  const waypoints = [];
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  for (const [index, vehicle] of schedule.entries()) {
    // Assign Addresses to Draw on Route
    const nodeList = vehicle.nodeList
    for (let i = 0; i < nodeList.length - 1; i++) {
      // Declare Addresses for Waypoints
      const addr = addrList[nodeList[i]]
      waypoints.push({
        location: addr,
        stopover: true,
      });
    }

    // Draw Each Vehicle's Route Path
    directionsService
      .route({
        origin: waypoints[0]['location'],
        destination: waypoints[waypoints.length - 1]['location'],
        waypoints: waypoints,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING,
      }).then(async (response) => {
        // Create new Directions Renderer Object
        const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });

        // Assign Route Path Color
        directionsRenderer.setOptions({
          polylineOptions: {
            strokeColor: routeColor[index]
          }
        });

        // Draw the Route
        directionsRenderer.setDirections(response);
        directionsRenderer.setMap(map);
      });
  }

  // Plot Location Nodes
  for (const [index, addr] of addrList.entries()) {
    try {
      const latlng = await geocodeAddress(addr, 'AIzaSyDodyAhuZKTVbVwSWt_DcmQvM8e4hyG2rU');
      const { latitude, longitude } = latlng

      const priceTag = document.createElement("div");
      priceTag.className = 'location-pin';
      priceTag.textContent = String(index);

      const marker = new AdvancedMarkerElement({
        map,
        position: { lat: latitude, lng: longitude },
        content: priceTag,
        title: addr
      });
    } catch (e) {
      console.error("Error:", e);
    }
  }
}

// Get Latitude and Longitude of Location
async function geocodeAddress(address, apiKey) {
  // Construct the Geocoding API URL
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    // Fetch data from the Geocoding API
    const response = await fetch(geocodingUrl);
    const data = await response.json();

    // Check if the response contains results
    if (data.results.length > 0) {
      // Extract the latitude and longitude from the response
      const location = data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;

      // Return the latitude and longitude
      // return { latitude, longitude };
      return ({ latitude, longitude })
    } else {
      console.log("No results found for the address:", address);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
}


export default Wrapper;
