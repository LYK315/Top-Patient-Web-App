import React, { Component } from "react";
import ZoneHeader from "../components/StaffZoneHeader";
import Typography from '@mui/material/Typography'
import { Link, Box, Button, Card, Container, Grid, Stack, Backdrop, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import axios from "axios";
import DateIcon from '@mui/icons-material/DateRange';
import ViewIcon from '@mui/icons-material/Preview';
import RegenerateIcon from '@mui/icons-material/Autorenew';
import UpdateIcon from '@mui/icons-material/Update';
import AuthContext from "../components/AuthContext";


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

export default class RoutingSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      accessToken: '',
      apptData: [],
      uniqueApptDate: [],
      updateTime: [],
      showBackdrop: false,
      pageClicked: 'addStaff',
    })

    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
    this.getUniqueApptDate = this.getUniqueApptDate.bind(this);
    this.updateRoutingSchedule = this.updateRoutingSchedule.bind(this);
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Get Unique Appointment Dates
  getUniqueApptDate(apptData) {
    let uniqueDates = []
    for (var appt of apptData) {
      if (!uniqueDates.includes(appt.apptDate)) {
        uniqueDates.push(appt.apptDate)
      }
    }

    this.setState({
      uniqueApptDate: uniqueDates
    })
  }

  // Get Patient Appointments from Database
  getPatientAppointment = async () => {
    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access

    // Show Backdrop Loading while Retrieving Appointment Data
    this.setState({
      showBackdrop: true,
      accessToken: accessToken,
    })

    // Get patient appointment via API
    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(this.state.accessToken ? this.state.accessToken : accessToken),
        }
      }

      // Get All Schedules Unique Date
      const res = await axios.get('http://127.0.0.1:8000/api/get-all-appointment', config);
      if (res.status === 200) {
        this.setState({
          apptData: res.data,
          showBackdrop: false,
        }, () => { this.getUniqueApptDate(this.state.apptData) })

        // Get Schedule previous Updated Time
        let dates = this.state.uniqueApptDate;
        const res_2 = await axios.get('http://127.0.0.1:8000/api/get-schedule-update', { params: dates, headers: config.headers });
        if (res_2.status === 200) {
          var updateTime = []
          for (let data of res_2.data) {
            let date = data.updateTime
            // Parse the string into a Date object
            const cleaned = new Date(date);

            // Convert to local time
            const localDatetime = new Date(cleaned.getTime() + cleaned.getTimezoneOffset() * 60000);

            // Format the datetime object
            updateTime.push(localDatetime.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }));
          }
        }
        this.setState({
          updateTime: updateTime
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Update Optimized Routing Schedule 
  updateRoutingSchedule = async (date) => {
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
      console.log(config);

      // Update Shcedule Data via API
      let res = await axios.put('http://127.0.0.1:8000/api/update-schedule/' + date, "", config);
      if (res.status === 200) {
        this.setState({
          showBackdrop: false,
        }, () => {
          alert('Route for ' + date + ' updated, reload page now ?');
          window.location.reload();
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Retrieve Context Data immediately after page loaded
    window.onload = () => {
      this.getPatientAppointment();
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
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: '200vh',
            maxWidth: '100vw',
          }}>

          {/* Page Body */}
          <Container
            sx={{
              width: '100%',
              pt: '4rem',
              pb: '15rem'
            }}
          >
            {/* Title - Routing Schedule */}
            <Typography
              variant="h4"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              Routing Schedules
            </Typography>

            {/* All Schedule */}
            <Stack
              display={'flex'}
              mt={'3rem'}
              mb={'5rem'}
              direction={'column'}
              gap={'2rem'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {this.state.uniqueApptDate.map((data, index) => (
                <Card
                  elevation={3}
                  sx={{
                    flexDirection: 'column',
                    width: '80%',
                    borderRadius: '10px',
                    p: '20px',
                  }}
                >
                  {/* Date */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    width={'100%'}
                    alignItems={'center'}
                  >
                    {/* Date */}
                    <Grid container lg={2.3}>
                      <Grid item lg={2} display={'flex'} alignItems={'center'}><DateIcon sx={{ fontSize: '20px' }} /></Grid>
                      <Grid item lg={10}>
                        <Typography alignItems={'center'} variant="subtitle1" color="text.primary" fontWeight='bold'>{data}</Typography>
                      </Grid>
                    </Grid>

                    {/* Last Update */}
                    <Grid container lg={5} fontStyle={'italic'} alignItems={'center'}>
                      <Grid item lg={0.8} display={'flex'} justifyContent={'start'} alignItems={'center'} mt={'0.2rem'}>
                        <UpdateIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                      </Grid>
                      <Grid item lg={2.8}>
                        <Typography variant="caption" color="text.disabled">
                          Last Update
                        </Typography>
                      </Grid>
                      <Grid item lg={0.3}>
                        <Typography variant="caption" color="text.disabled">
                          :
                        </Typography>
                      </Grid>
                      <Grid item lg={7}>
                        <Typography variant="caption" color="text.disabled">
                          {this.state.updateTime[index] ? `${this.state.updateTime[index]}` : 'No Previous Update'}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* View & Regenerate Btn */}
                    <Grid container lg={4}>
                      {/* View */}
                      <Grid item lg={1.5} display={'flex'} justifyContent={'start'}>
                        <ViewIcon />
                      </Grid>
                      <Grid item lg={4.5} display={'flex'} justifyContent={'start'}>
                        <NavLink underline="none" href={`routing-schedule/${data}`}>View</NavLink>
                      </Grid>

                      {/* Regenerate */}
                      <Grid item lg={1.5} display={'flex'} justifyContent={'start'}>
                        <RegenerateIcon />
                      </Grid>
                      <Grid item lg={4.5} display={'flex'} justifyContent={'start'}>
                        <NavLink underline="none" onClick={() => this.updateRoutingSchedule(data)} sx={{ cursor: 'pointer' }}>Regenerate</NavLink>
                      </Grid>
                    </Grid>

                  </Box>

                </Card>
              ))}

            </Stack>

            {/* Display No Schedule */}
            <Typography
              display={this.state.uniqueApptDate.length == 0 ? 'flex' : 'none'}
              variant="h5" color={'gray'}
              mt={'-3rem'}
            >
              No Up Coming Schedules.
            </Typography>

          </Container>
        </Box>
      </div >
    )
  }
}