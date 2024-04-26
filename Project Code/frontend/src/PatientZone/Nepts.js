import React, { Component } from "react";
import ZoneHeader from "../components/PatientZoneHeader";
import { Box, Step, StepLabel, Stepper, Typography, TextField, StepButton, Stack, Button, Grid, MenuItem, Slide, Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateIcon from '@mui/icons-material/DateRange';
import LocationIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import DoneIcon from '@mui/icons-material/DoneAll';
import PendingIcon from '@mui/icons-material/PendingActions';
import BlockIcon from '@mui/icons-material/Block';
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import axios from "axios";
import AuthContext from "../components/AuthContext";

// Step Labels
const steps = ['Date & Time', 'Location', 'Appointment Details', 'Done']

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
    1: <DateIcon />,
    2: <LocationIcon />,
    3: <InfoIcon />,
    4: <DoneIcon />,
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
      neptsValid: -1,
      initDisability: '',

      stepClicked: 'Date & Time',
      navBtnClicked: 'Date & Time',
      backNextClicked: '',
      stepCompleted: 0,
      showBackdrop: false,
      alertType: '',
      showAlert: false,
      apptRefID: '',
      currentDate: null,

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

    this.getPatientInfo = this.getPatientInfo.bind(this);
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleNavBtnClick = this.handleNavBtnClick.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
    this.checkEmptyField = this.checkEmptyField.bind(this);
    this.appendAppointment = this.appendAppointment.bind(this);
  }

  // Get Patient Information
  getPatientInfo() {
    // Access Context Data
    let userContext = this.context;
    let accessToken = userContext.authToken.access;

    // Authorization Key to send GET request
    const config = {
      headers: {
        'Authorization': "Bearer " + String(accessToken),
      }
    }

    // Get patient data via api request
    axios.get('http://127.0.0.1:8000/api/get-patient', config).then(res => {
      if (res.status === 200) {
        let data = res.data;

        this.setState({
          // Set Min Date is "tommorrow"
          currentDate: dayjs(Date.now() + 86400000),
          neptsValid: data.neptsValid,
        }, () => { });

        if (data.disability == '1') {
          this.setState({ initDisability: "I'm able to Walk" })
        } else if (data.disability == '2') {
          this.setState({ initDisability: "I Need a Wheelchair" })
        } if (data.disability == '3') {
          this.setState({ initDisability: "I Need a Stretcher" })
        }
      }
    }).catch(err => { console.log(err); })
  }

  // If either step is clicked
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
      if (stepID == 'Location') {
        if (this.state.stepCompleted < 1)
          this.setState({ stepCompleted: 1 })
      } else if (stepID == 'Appointment Details') {
        if (this.state.stepCompleted < 2)
          this.setState({ stepCompleted: 2 })
      } else if (stepID == 'Done') {
        if (this.state.stepCompleted < 3)
          this.setState({ stepCompleted: 3 })
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
    }, () => {
    });
  }

  // Set Appointment Date
  handleDateChange(date) {
    let formatDate = dayjs(date);
    this.setState({
      apptDate: dayjs(formatDate.get('years') + "-" + (formatDate.get('months') + 1) + "-" + formatDate.get('date'))
        .format('YYYY-MM-DD').toString(),
    }, () => {
    });
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

  // Handle Error Message Closed
  handleCloseAlert() {
    this.setState({ showAlert: false })
  }

  // Check if any required field is empty
  checkEmptyField(step) {
    if (step == 'Date & Time') {
      if (this.state.apptDate == '' || this.state.apptTime == '' || this.state.apptEndTime == '') {
        this.setState({ showAlert: true, alertType: 'emptyField' })
      } else {
        this.handleNavBtnClick('Location', 'next');
      }
    } else if (step == 'Location') {
      if (this.state.addrPickUp1 == '' || this.state.addrPickUpCity == '' || this.state.addrPickUpCode == '' || this.state.addrAppt1 == '' || this.state.addrApptCity == '' || this.state.addrApptCode == '' || this.state.gpName == '') {
        this.setState({ showAlert: true, alertType: 'emptyField' })
      } else {
        this.handleNavBtnClick('Appointment Details', 'next');
      }
    } else { // Step == appointment details
      if (this.state.disability == -1 || this.state.escort == null) {
        this.setState({ showAlert: true, alertType: 'emptyField' });
      } else {
        this.setState({ showBackdrop: true });
      }
    }
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Append Appointment to Database
  appendAppointment() {
    // Check if Appointment Details are entered
    this.checkEmptyField('Appointment Details')
    if (this.state.showAlert == true) {
      return
    }

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
    axios.post('http://127.0.0.1:8000/api/create-appointment-patient', apptData, config).then(res => {
      if (res.status === 200) {
        setTimeout(() => {
          this.setState({
            showAlert: true,
            alertType: 'bookingSubmit',
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
    window.addEventListener('load', this.getPatientInfo);

    return (
      <div>
        {/* Display Alert */}
        <Snackbar
          color="red"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.showAlert}
          onClose={this.handleCloseAlert}
          autoHideDuration={6000}
          message="alert message"
        >
          <Alert
            elevation={2}
            onClose={this.handleCloseAlert}
            severity={this.state.alertType == 'emptyField' ? 'warning' : 'success'}
            sx={{ width: '100%' }}
          >
            {this.state.alertType == 'emptyField' ? 'Please enter all required field !' : 'Booking request submitted !'}
          </Alert>
        </Snackbar>

        {/* Display Backdrop Loading */}
        <Backdrop
          sx={{ color: '#FFF', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showBackdrop}
          onClick={this.handleCloseBackdrop}
        >
          <CircularProgress color="primary" />
        </Backdrop>

        {/* Header App Bar */}
        <ZoneHeader />

        {/* Background Image */}
        <Box
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: '200vh',
            maxWidth: '100vw',
          }}>
          {/* Page Content */}
          <Box
            sx={{
              mx: 'auto',
              width: '80%',
              pt: '3rem',
              pb: '5rem',
              display: 'flex',
              flexDirection: 'column',
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

            {/* Make Booking Step by Step */}
            <Box
              display={this.state.neptsValid == 1 ? 'flex' : 'none'}
              width='100%'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
            >
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
                  '.MuiStepLabel-label': { fontSize: '0.8rem' },
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
                          disabled={this.state.stepCompleted < 3 ? false : true}
                          onChange={this.handleDateChange}
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
                          disabled={this.state.stepCompleted < 3 ? false : true}
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
                          disabled={this.state.stepCompleted < 3 ? false : true}
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

                  {/* Next Button */}
                  <NavButton
                    sx={{ mx: 'auto', mt: '10px' }}
                    onClick={() => this.checkEmptyField('Date & Time')}
                  >
                    Next Step
                  </NavButton>

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
                        disabled={this.state.stepCompleted == 3 ? true : false}
                        id="appt-addrL1"
                        label="Address Line 1"
                        placeholder="Enter your Address Line 1"
                        onChange={(e) => this.handleTextFieldChange(e, "addrPickUp1")}
                      />
                    </Grid>

                    {/* Address Line 2 */}
                    <Grid item lg={12}>
                      <CustTextField
                        disabled={this.state.stepCompleted == 3 ? true : false}
                        id="appt-addrL2"
                        label="Address Line 2"
                        placeholder="Enter your Address Line 2"
                        onChange={(e) => this.handleTextFieldChange(e, "addrPickUp2")}
                      />
                    </Grid>

                    {/* Post Code */}
                    <Grid item lg={5.7}>
                      <CustTextField
                        disabled={this.state.stepCompleted == 3 ? true : false}
                        id="appt-postcode"
                        label="Post Code"
                        placeholder="Enter your Post Code"
                        onChange={(e) => this.handleTextFieldChange(e, "addrPickUpCode")}
                      />
                    </Grid>

                    {/* Town / City */}
                    <Grid item lg={5.7}>
                      <CustTextField
                        disabled={this.state.stepCompleted == 3 ? true : false}
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
                        disabled={this.state.stepCompleted == 3 ? true : false}
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
                        disabled={this.state.stepCompleted == 3 ? true : false}
                        id="appt-apptAddrL1"
                        label="Address Line 1"
                        placeholder="Enter appointment (GP) Address Line 1"
                        onChange={(e) => this.handleTextFieldChange(e, "addrAppt1")}
                      />
                    </Grid>

                    {/* Address Line 2 */}
                    <Grid item lg={12}>
                      <CustTextField
                        disabled={this.state.stepCompleted == 3 ? true : false}
                        id="appt-apptAddrL2"
                        label="Address Line 2"
                        placeholder="Enter appointment (GP) Address Line 2"
                        onChange={(e) => this.handleTextFieldChange(e, "addrAppt2")}
                      />
                    </Grid>

                    {/* Post Code */}
                    <Grid item lg={5.7}>
                      <CustTextField
                        disabled={this.state.stepCompleted == 3 ? true : false}
                        id="appt-apptPostCode"
                        label="Post Code"
                        placeholder="Enter Post Code"
                        onChange={(e) => this.handleTextFieldChange(e, "addrApptCode")}
                      />
                    </Grid>

                    {/* Town / City */}
                    <Grid item lg={5.7}>
                      <CustTextField
                        disabled={this.state.stepCompleted == 3 ? true : false}
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
                    <NavButton
                      onClick={() => this.checkEmptyField('Location')}
                    >
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
                        disabled={this.state.stepCompleted == 3 ? true : false}
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
                        disabled={this.state.stepCompleted == 3 ? true : false}
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
                    disabled={this.state.stepCompleted == 3 ? true : false}
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
                    disabled={this.state.stepCompleted == 3 ? true : false}
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

                    {/* Next Button */}
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
                    Thank you for booking with Top Patient Transport. Your request has been successfully submitted and we’ve sent an confirmation email to you. We look forward to seeing you, have a pleasant day ahead ! <br /><br />
                    Kindly note that cancelling your appointment last minute would delay other patient’s schedule, we appreciate your understanding. Contact our general line +44 123456789 if you have further enquiries.
                  </Typography>

                  {/* Back to Dashboard Button */}
                  <NavButton href="/patient-zone/patientDashboard">
                    Home Page
                  </NavButton>
                </Box>
              </Slide>
            </Box>

            {/* Approval Pending / Not Eligible */}
            <Box
              display={this.state.neptsValid == 1 ? 'none' : 'flex'}
              mt='4.5rem'
              width='100%'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
            >
              {/* Approval Pending */}
              <Slide direction="right" in={this.state.neptsValid == 0} timeout={500}>
                <Box
                  display={this.state.neptsValid == 0 ? 'flex' : 'none'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={'60%'}
                  gap={'3.5rem'}
                >
                  {/* Approval Pending */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    mx={'auto'}
                    gap={'0.8rem'}
                  >
                    <PendingIcon sx={{ fontSize: '40px', color: 'text.disabled' }} />
                    <Typography variant="h4" fontWeight='bold' color="text.disabled">
                      Approval Pending
                    </Typography>
                  </Box>

                  {/* Notes */}
                  <Typography variant="subtitle1" color="text.primary" textAlign={'center'}>
                    Your account is still pending for our staff to validate your eligibility to use our NEPT Service. <br /><br />

                    We will inform you via email once your account has been validated. Contact our general line <br />
                    +44 123456789 if you have further enquiries.
                  </Typography>

                  {/* Back to Dashboard Button */}
                  <NavButton href="/patient-zone/patientDashboard">
                    Home Page
                  </NavButton>
                </Box>
              </Slide>

              {/* Not Eligible */}
              <Slide direction="right" in={this.state.neptsValid == 2} timeout={500}>
                <Box
                  display={this.state.neptsValid == 2 ? 'flex' : 'none'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={'60%'}
                  gap={'3.5rem'}
                >
                  {/* Not Eligible */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    mx={'auto'}
                    gap={'0.8rem'}
                  >
                    <BlockIcon sx={{ fontSize: '40px', color: 'error.main' }} />
                    <Typography variant="h4" fontWeight='bold' color="error.main">
                      Not Eligible
                    </Typography>
                  </Box>

                  {/* Notes */}
                  <Typography variant="subtitle1" color="text.primary" textAlign={'center'}>
                    Sorry, you are not eligible for using our NEPT Service. <br /><br />

                    Contact our general line +44 123456789 if you need further assitance.
                  </Typography>

                  {/* Back to Dashboard Button */}
                  <NavButton href="/patient-zone/patientDashboard">
                    Home Page
                  </NavButton>
                </Box>
              </Slide>
            </Box>

          </Box>
        </Box>
      </div>
    )
  }
}