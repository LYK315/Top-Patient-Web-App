import React, { Component } from "react";
import ZoneHeader from "../components/StaffZoneHeader";
import { Box, Step, StepLabel, Stepper, Typography, TextField, StepButton, Stack, Button, Grid, MenuItem, Slide, Backdrop, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PatientDetailIcon from '@mui/icons-material/AssignmentInd';
import DateIcon from '@mui/icons-material/DateRange';
import LocationIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import DoneIcon from '@mui/icons-material/DoneAll';
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import axios from "axios";
import AuthContext from "../components/AuthContext";

// Step Labels
const steps = ['Patient Details', 'Date & Time', 'Location', 'Appointment Details', 'Done']

// Custom Step Icon Style
const ApptStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#DDD',
  zIndex: 1,
  color: theme.palette.primary.dark,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(90deg, rgba(176,212,255,1) 66%, rgba(176,212,255,1) 66%, rgba(176,212,255,1) 66%)',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.33)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(90deg, rgba(176,212,255,1) 66%, rgba(176,212,255,1) 66%, rgba(176,212,255,1) 66%)',
  }),
}));

// Set Step Icon
function apptStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <PatientDetailIcon />,
    2: <DateIcon />,
    3: <LocationIcon />,
    4: <InfoIcon />,
    5: <DoneIcon />,
  };

  return (
    <ApptStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ApptStepIconRoot>
  );
}

// Custom Button
const NavButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#D9EAFF',
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

// Custom Textfield
const CustTextField = styled((props) => (
  <TextField
    size="small"
    variant="outlined"
    required={true}
    fullWidth={true}
    const {...props}
  />))
  (({ theme }) => ({
  }));

export default class Nepts extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      stepClicked: 'Patient Details',
      navBtnClicked: 'Patient Details',
      backNextClicked: '',
      stepCompleted: 0,
      apptRefID: '',
      showBackdrop: false,
      currentDate: null,

      nhsNumber: '',
      birthDate: '',
      fullName: '',
      gender: '',
      contact: '',
      email: '',

      apptDate: '',
      apptTime: '',
      minEndTime: null,
      apptEndTime: '',

      addrPickUp1: ' ',
      addrPickUp2: ' ',
      addrPickUpCode: '',
      addrPickUpCity: '',

      addrAppt1: ' ',
      addrAppt2: ' ',
      addrApptCode: '',
      addrApptCity: '',

      gpName: '',
      disability: -1,
      escort: null,
      notes: '',
      specialReq: '',
    });

    this.setCurrentDate = this.setCurrentDate.bind(this);
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleNavBtnClick = this.handleNavBtnClick.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.appendAppointment = this.appendAppointment.bind(this);
    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
  }

  // Set Current Date
  setCurrentDate() {
    // Min Date is "tommorrow"
    this.setState({
      currentDate: dayjs(Date.now() + 86400000),
    })
  }

  // If either 'step' is clicked
  handleStepClick(stepID) {
    this.setState({
      stepClicked: stepID,
    })
  }

  // If next/back button is clicked
  handleNavBtnClick(stepID, btnID) {
    // If next button is pressed
    if (btnID == 'next') {
      this.setState({ backNextClicked: 'next', stepClicked: stepID });
      if (stepID == 'Date & Time') {
        if (this.state.stepCompleted < 1)
          this.setState({ stepCompleted: 1 })
      } else if (stepID == 'Location') {
        if (this.state.stepCompleted < 2)
          this.setState({ stepCompleted: 2 })
      } else if (stepID == 'Appointment Details') {
        if (this.state.stepCompleted < 3)
          this.setState({ stepCompleted: 3 })
      } else if (stepID == 'Done') {
        if (this.state.stepCompleted < 4)
          this.setState({ stepCompleted: 4 })
      }
    }
    // If back button is pressed
    if (btnID == 'back') {
      this.setState({ backNextClicked: 'back', stepClicked: stepID });
    }
  }

  // Handle all text field change
  handleTextFieldChange(event, field) {
    this.setState({
      [field]: event.target.value
    }, () => { });
  }

  // Set Date Change (dob / appt date)
  handleDateChange(date, field) {
    let formatDate = dayjs(date);
    this.setState({
      [field]: dayjs(formatDate.get('years') + "-" + (formatDate.get('months') + 1) + "-" + formatDate.get('date'))
        .format('YYYY-MM-DD').toString(),
    }, () => { });
  }

  // Set Appointment Time
  handleTimeChange(time, field) {
    let formatTime = dayjs(time);

    let formattedTime = dayjs(formatTime.get('years') + "-" + (formatTime.get('months') + 1) + "-" + formatTime.get('date') + " " + formatTime.get('hours') + ":" + formatTime.get('minutes') + ":" + formatTime.get('seconds'))
      .format('HH:mm:ss').toString();

    const minTime = dayjs().set('hour', formatTime.get('hours')).set('minute', formatTime.get('minute')).startOf('minute');

    if (field == 'apptTime') {
      this.setState({ apptTime: formattedTime, minEndTime: minTime });
    } else {
      this.setState({ apptEndTime: formattedTime });
    }
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Append Appointment to Database
  appendAppointment() {
    // Show Loading Backdrop
    this.setState({
      showBackdrop: true,
    })

    // Access Context Value
    let userContext = this.context;
    let accessToken = userContext.authToken.access;

    // Authorization Key to send POST request
    const config = {
      headers: {
        'Authorization': "Bearer " + String(accessToken),
      }
    }

    // Appointment data to append to database
    let apptData = {
      nhsNumber: this.state.nhsNumber,
      birthDate: this.state.birthDate,
      fullName: this.state.fullName,
      gender: this.state.gender,
      contact: this.state.contact,
      email: this.state.email,
      apptDate: this.state.apptDate,
      apptTime: this.state.apptTime,
      apptEndTime: this.state.apptEndTime,
      addrPickUp: (this.state.addrPickUp1 + "," + this.state.addrPickUp2 + "," + this.state.addrPickUpCity + "," + this.state.addrPickUpCode),
      addrAppt: (this.state.addrAppt1 + "," + this.state.addrAppt2 + "," + this.state.addrApptCity + "," + this.state.addrApptCode),
      gpName: this.state.gpName,
      disability: this.state.disability,
      escort: this.state.escort,
      notes: this.state.notes,
      specialReq: this.state.specialReq,
    };

    // Append Patient Appointment to Database
    axios.post('http://127.0.0.1:8000/api/create-appointment-staff', apptData, config).then(res => {
      if (res.status === 200) {
        console.log(res.data.refID);
        setTimeout(() => {
          this.setState({
            apptRefID: res.data.refID,
            showBackdrop: false,
          })
          this.handleNavBtnClick('Done', 'next')
        }, 1000)
      }
    }).catch(err => {
      console.log("Error: " + err);
    })
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Get Patient Info immediately after page loaded
    window.addEventListener('load', this.setCurrentDate);

    return (
      <div>
        {/* Display Backdrop Loading */}
        <Backdrop
          sx={{ color: '#FFF', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showBackdrop}
          onClick={this.handleCloseBackdrop}
        >
          <CircularProgress color="primary" />
        </Backdrop>

        {/* Page Header */}
        <ZoneHeader />

        {/* Page Background Img */}
        <Box
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: '200vh',
            maxWidth: '100vw',
          }}>

          {/* Page Body */}
          <Box
            sx={{
              mx: 'auto',
              width: '80%',
              pt: '3rem',
              pb: '5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Title */}
            <Typography
              variant="h5"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              Non-Emergency Patient Transport Booking (NEPTS)
            </Typography>

            {/* Dispaly Current Step */}
            <Stepper
              alternativeLabel
              activeStep={this.state.stepCompleted}
              sx={{
                width: '80%',
                mt: '3rem',
                '.MuiStepConnector-root': {
                  top: 25,
                },
                '.MuiStepConnector-line': {
                  height: 2,
                  border: 0,
                  backgroundColor: '#DDD',
                },
                '.Mui-active': {
                  '.MuiStepConnector-line': {
                    backgroundImage: 'linear-gradient(90deg, rgba(0,86,189,1) 66%, rgba(0,86,189,1) 66%, rgba(0,86,189,1) 66%)',
                  },
                },
                '.Mui-completed': {
                  '.MuiStepConnector-line': {
                    backgroundImage: 'linear-gradient(90deg, rgba(0,86,189,1) 66%, rgba(0,86,189,1) 66%, rgba(0,86,189,1) 66%)',
                  },
                },
                '.MuiStepLabel-label': { fontSize: '0.8rem' }
              }}
            >
              {steps.map((label) => (
                <Step key={label}
                  sx={{
                    '.MuiStepLabel-labelContainer': {
                      color: '#CCC',
                      '.Mui-active': {
                        color: 'text.secondary',
                        fontWeight: this.state.stepClicked == label ? '900' : '400',
                      },
                      '.Mui-completed': {
                        color: 'text.secondary',
                        fontWeight: this.state.stepClicked == label ? '900' : '400',
                      },
                    }
                  }}
                >
                  <StepButton onClick={() => this.handleStepClick(label)} disableRipple>
                    <StepLabel StepIconComponent={apptStepIcon}>
                      {label}
                    </StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>

            {/* Input - Patient Details */}
            <Slide
              direction={this.state.backNextClicked === 'next' ? "right" : 'left'}
              in={this.state.stepClicked === 'Patient Details'}
              timeout={500}
            >
              <Box
                display={this.state.stepClicked === 'Patient Details' ? 'flex' : 'none'}
                mt={'4rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                width={'60%'}
                gap={'2rem'}
              >
                <Grid
                  container
                  display={'flex'}
                  rowGap={'2rem'}
                  width={'100%'}
                  justifyContent={'space-between'}
                >
                  {/* NHS Number */}
                  <Grid item lg={5.8}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="patient-nhs"
                      label="NHS Number"
                      placeholder="Enter Patient NHS Number"
                      size="normal"
                      onChange={(e) => this.handleTextFieldChange(e, "nhsNumber")}
                    />
                  </Grid>

                  {/* DOB */}
                  <Grid item lg={5.8}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        components={['DatePicker']}
                        sx={{
                          overflow: 'visible', p: 0,
                          '& .css-11a8txn-MuiStack-root': {
                            width: '100%'
                          }
                        }}
                      >
                        <DemoItem>
                          <DatePicker
                            disabled={this.state.stepCompleted == 4 ? true : false}
                            onChange={(e) => this.handleDateChange(e, 'birthDate')}
                            label="Date of Birth"
                            slotProps={{
                              textField: {
                                required: true,
                                variant: 'outlined',
                                id: 'appt-date',
                              },
                            }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>

                  {/* Full Name */}
                  <Grid item lg={5.8}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="patient-fullName"
                      label="Full Name"
                      placeholder="Enter Patient Full Name"
                      size="normal"
                      onChange={(e) => this.handleTextFieldChange(e, "fullName")}
                    />
                  </Grid>

                  {/* Gender */}
                  <Grid item lg={5.8}>
                    <TextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-gender"
                      label="Gender"
                      fullWidth
                      select
                      defaultValue=""
                      onChange={(e) => { this.handleTextFieldChange(e, 'gender') }}
                    >
                      <MenuItem key={'1'} value={'Male'}>
                        Male
                      </MenuItem>
                      <MenuItem key={'2'} value={'Female'}>
                        Female
                      </MenuItem>
                      <MenuItem key={'3'} value={'Prefer Not to Say'}>
                        Prefer Not To Say
                      </MenuItem>
                    </TextField>
                  </Grid>

                  {/* Contact */}
                  <Grid item lg={5.8}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="patient-contact"
                      label="Contact Number"
                      placeholder="Enter Patient Contact"
                      size="normal"
                      onChange={(e) => this.handleTextFieldChange(e, "contact")}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item lg={5.8}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="patient-email"
                      label="Email"
                      placeholder="Enter Patient Email"
                      size="normal"
                      onChange={(e) => this.handleTextFieldChange(e, "email")}
                    />
                  </Grid>

                </Grid >

                {/* Next Button */}
                <NavButton sx={{ mx: 'auto', mt: '10px' }} onClick={() => this.handleNavBtnClick('Date & Time', 'next')}>
                  Next Step
                </NavButton>

              </Box>
            </Slide>

            {/* Input - Date & Time */}
            <Slide
              direction={this.state.backNextClicked === 'next' ? "right" : 'left'}
              in={this.state.stepClicked === 'Date & Time'}
              timeout={500}
            >
              <Box
                display={this.state.stepClicked === 'Date & Time' ? 'flex' : 'none'}
                mt={'4rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                width={'60%'}
                gap={'2rem'}
              >
                {/* Appt Date */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={['DatePicker']}
                    sx={{
                      overflow: 'visible', p: 0,
                      '& .css-11a8txn-MuiStack-root': {
                        width: '100%'
                      }
                    }}
                  >
                    <DemoItem>
                      <DatePicker
                        minDate={this.state.currentDate}
                        disabled={this.state.stepCompleted == 4 ? true : false}
                        onChange={(e) => this.handleDateChange(e, 'apptDate')}
                        label="Appointment Date"
                        slotProps={{
                          textField: {
                            required: true,
                            variant: 'outlined',
                            id: 'appt-date',
                          },
                        }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>

                {/* Appt Time */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={['TimePicker']}
                    sx={{
                      overflow: 'visible', p: 0,
                      '& .css-11a8txn-MuiStack-root': {
                        width: '100%'
                      }
                    }}
                  >
                    <DemoItem>
                      <TimePicker
                        disabled={this.state.stepCompleted == 4 ? true : false}
                        onChange={(e) => this.handleTimeChange(e, 'apptTime')}
                        label="Appointment Time"
                        slotProps={{
                          textField: {
                            required: true,
                            variant: 'outlined',
                            id: 'appt-time',
                          },
                        }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>

                {/* Appt End Time */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={['TimePicker']}
                    sx={{
                      overflow: 'visible', p: 0,
                      '& .css-11a8txn-MuiStack-root': {
                        width: '100%'
                      }
                    }}
                  >
                    <DemoItem>
                      <TimePicker
                        disabled={this.state.stepCompleted == 4 ? true : false}
                        minTime={this.state.minEndTime}
                        onChange={(e) => this.handleTimeChange(e, 'apptEndTime')}
                        label="Appointment End Time (Est.)"
                        slotProps={{
                          textField: {
                            required: true,
                            variant: 'outlined',
                            id: 'appt-endTime',
                          },
                        }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>

                {/* Navigation Button */}
                <Stack
                  direction={'row'}
                  spacing={'2rem'}
                  mx={'auto'}
                  mt={'20px'}
                >
                  {/* Back Button */}
                  <NavButton onClick={() => this.handleNavBtnClick('Patient Details', 'back')}>
                    Back
                  </NavButton>

                  {/* Next Button */}
                  <NavButton onClick={() => this.handleNavBtnClick('Location', 'next')}>
                    Next Step
                  </NavButton>

                </Stack>

              </Box>
            </Slide>

            {/* Input - Location */}
            <Slide
              direction={this.state.backNextClicked === 'next' ? "right" : 'left'}
              in={this.state.stepClicked === 'Location'}
              timeout={500}
            >
              <Box
                display={this.state.stepClicked === 'Location' ? 'flex' : 'none'}
                mt={'4rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                width={'60%'}
                gap={'3.5rem'}
              >
                {/* Pick Up Address */}
                <Grid
                  container
                  display={'flex'}
                  rowGap={'1.2rem'}
                  width={'100%'}
                  justifyContent={'space-between'}
                >
                  {/* Title */}
                  <Grid item lg={12}>
                    <Typography variant="h6" color="text.secondary">Pick Up Address</Typography>
                  </Grid>

                  {/* Address Line 1 */}
                  <Grid item lg={12}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-addrL1"
                      label="Address Line 1"
                      placeholder="Enter your Address Line 1"
                      onChange={(e) => this.handleTextFieldChange(e, "addrPickUp1")}
                    />
                  </Grid>

                  {/* Address Line 2 */}
                  <Grid item lg={12}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-addrL2"
                      label="Address Line 2"
                      placeholder="Enter your Address Line 2"
                      onChange={(e) => this.handleTextFieldChange(e, "addrPickUp2")}
                    />
                  </Grid>

                  {/* Sort Code */}
                  <Grid item lg={5.7}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-sortCode"
                      label="Sort Code"
                      placeholder="Enter your Sort Code"
                      onChange={(e) => this.handleTextFieldChange(e, "addrPickUpCode")}
                    />
                  </Grid>

                  {/* Town / City */}
                  <Grid item lg={5.7}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-city"
                      label="Town / City"
                      placeholder="Enter your City"
                      onChange={(e) => this.handleTextFieldChange(e, "addrPickUpCity")}
                    />
                  </Grid>

                </Grid>

                {/* GP Name */}
                <Grid
                  container
                  display={'flex'}
                  rowGap={'1.2rem'}
                  width={'100%'}
                  justifyContent={'space-between'}
                >
                  {/* Title */}
                  <Grid item lg={12}>
                    <Typography variant="h6" color="text.secondary">GP / Hospital / Practice Name</Typography>
                  </Grid>

                  {/* GP Name */}
                  <Grid item lg={12}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-gpName"
                      label="GP Name"
                      placeholder="Enter Appointment GP's Name"
                      onChange={(e) => this.handleTextFieldChange(e, "gpName")}
                    />
                  </Grid>
                </Grid>

                {/* Appt Address */}
                <Grid
                  container
                  display={'flex'}
                  rowGap={'1.2rem'}
                  width={'100%'}
                  justifyContent={'space-between'}
                >
                  {/* Title */}
                  <Grid item lg={12}>
                    <Typography variant="h6" color="text.secondary">Appointment Address</Typography>
                  </Grid>

                  {/* Address Line 1 */}
                  <Grid item lg={12}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-apptAddrL1"
                      label="Address Line 1"
                      placeholder="Enter appointment (GP) Address Line 1"
                      onChange={(e) => this.handleTextFieldChange(e, "addrAppt1")}
                    />
                  </Grid>

                  {/* Address Line 2 */}
                  <Grid item lg={12}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-apptAddrL2"
                      label="Address Line 2"
                      placeholder="Enter appointment (GP) Address Line 2"
                      onChange={(e) => this.handleTextFieldChange(e, "addrAppt2")}
                    />
                  </Grid>

                  {/* Sort Code */}
                  <Grid item lg={5.7}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-apptSortCode"
                      label="Sort Code"
                      placeholder="Enter Sort Code"
                      onChange={(e) => this.handleTextFieldChange(e, "addrApptCode")}
                    />
                  </Grid>

                  {/* Town / City */}
                  <Grid item lg={5.7}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-apptCity"
                      label="Town / City"
                      placeholder="Enter City"
                      onChange={(e) => this.handleTextFieldChange(e, "addrApptCity")}
                    />
                  </Grid>

                </Grid>

                {/* Navigation Button */}
                <Stack
                  direction={'row'}
                  spacing={'2rem'}
                  mx={'auto'}
                  mt={'20px'}
                >
                  {/* Back Button */}
                  <NavButton onClick={() => this.handleNavBtnClick('Date & Time', 'back')}>
                    Back
                  </NavButton>

                  {/* Next Button */}
                  <NavButton onClick={() => this.handleNavBtnClick('Appointment Details', 'next')}>
                    Next Step
                  </NavButton>

                </Stack>
              </Box>
            </Slide>

            {/* Input - Appt Detail */}
            <Slide
              direction={this.state.backNextClicked === 'next' ? "right" : 'left'}
              in={this.state.stepClicked === 'Appointment Details'}
              timeout={500}
            >
              <Box
                display={this.state.stepClicked === 'Appointment Details' ? 'flex' : 'none'}
                mt={'4rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                width={'60%'}
                gap={'2rem'}
              >
                {/* Disability & Escort */}
                <Grid
                  container
                  display={'flex'}
                  width={'100%'}
                  justifyContent={'space-between'}
                >
                  {/* Disability */}
                  <Grid item lg={5.7}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-diability"
                      label="Disability"
                      select
                      defaultValue=""
                      onChange={(e) => this.handleTextFieldChange(e, "disability")}
                    >
                      <MenuItem disabled key={0} value={null}>
                        Slect One that Matches Most
                      </MenuItem>
                      <MenuItem key={1} value={1}>
                        I'm Able to Walk
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        I Need a Wheelchair
                      </MenuItem>
                      <MenuItem key={3} value={3}>
                        I Need a Stretcher
                      </MenuItem>
                    </CustTextField>
                  </Grid>

                  {/* Medical / Relative Escort */}
                  <Grid item lg={5.7}>
                    <CustTextField
                      disabled={this.state.stepCompleted == 4 ? true : false}
                      id="appt-escort"
                      label="Medical / Relative Escort"
                      select
                      defaultValue=""
                      helperText="*Note: Only one (1) escort is allowed."
                      onChange={(e) => this.handleTextFieldChange(e, "escort")}
                    >
                      <MenuItem disabled key={0} value={null}>
                        Do you need an Escort ?
                      </MenuItem>
                      <MenuItem key={1} value={true}>
                        Yes
                      </MenuItem>
                      <MenuItem key={2} value={false}>
                        No
                      </MenuItem>
                    </CustTextField>
                  </Grid>
                </Grid>

                {/* Important Note */}
                <TextField
                  disabled={this.state.stepCompleted == 4 ? true : false}
                  error={false}
                  variant="outlined"
                  id="appt-note"
                  label="Anything Important we Should Take Note ? (optional)"
                  placeholder="Let us know if there is anything our staff should take note during the journey.."
                  fullWidth
                  multiline
                  rows={3}
                  onChange={(e) => this.handleTextFieldChange(e, "notes")}
                />

                {/* Special Requirements */}
                <TextField
                  disabled={this.state.stepCompleted == 4 ? true : false}
                  error={false}
                  variant="outlined"
                  id="appt-requirements"
                  label="Special Requirements (optional)"
                  placeholder="Let us know if you have any special requirements.."
                  fullWidth
                  multiline
                  rows={3}
                  onChange={(e) => this.handleTextFieldChange(e, "specialReq")}
                />

                {/* Navigation Button */}
                <Stack
                  direction={'row'}
                  spacing={'2rem'}
                  mx={'auto'}
                  mt={'20px'}
                >
                  {/* Back Button */}
                  <NavButton onClick={() => this.handleNavBtnClick('Location', 'back')}>
                    Back
                  </NavButton>

                  {/* Submit Button */}
                  <NavButton onClick={this.appendAppointment}>
                    Submit
                  </NavButton>

                </Stack>
              </Box>
            </Slide>

            {/* Display - Done */}
            <Slide direction="right" in={this.state.stepClicked === 'Done'} timeout={500}>
              <Box
                display={this.state.stepClicked === 'Done' ? 'flex' : 'none'}
                mt={'4rem'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                width={'60%'}
                gap={'2.5rem'}
              >
                {/* Booking ID */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  mx={'auto'}
                  gap={'1rem'}
                >
                  <Typography variant="h5" fontWeight='bold' color="text.secondary">
                    Booking Reference Number
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {this.state.apptRefID}
                  </Typography>
                </Box>

                {/* Notes */}
                <Typography variant="subtitle1" color="text.primary" textAlign={'center'}>
                  Booking request has been successfully submitted.<br /><br />
                  Do remind patient on the Booking Reference Number above.
                </Typography>

                {/* Back to Dashboard Button */}
                <NavButton href="/staff-zone/nepts">
                  New Booking
                </NavButton>
              </Box>
            </Slide>

          </Box>
        </Box>
      </div>
    )
  }
}