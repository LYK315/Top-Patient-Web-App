import React, { Component } from "react";
import ZoneHeader from "../components/PatientZoneHeader";
import { Backdrop, Box, Card, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Link, Stack, Typography, TextField, DialogActions, Button, Divider, FormControl, FormHelperText, OutlinedInput, Stepper, Step, StepButton, StepLabel, Slide, IconButton, MenuItem, Snackbar, Alert } from "@mui/material";
import LocationIcon from '@mui/icons-material/LocationOn';
import DateIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import BookingIcon from '@mui/icons-material/PendingActions';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import AuthContext from "../components/AuthContext";
import NextIcon from '@mui/icons-material/ArrowRightRounded';
import BackIcon from '@mui/icons-material/ArrowLeftRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import axios from "axios";
import styled from "@emotion/styled";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

// Step Labels
const steps = ['Date & Time', 'Location', 'Appointment Details']

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

// Set Step Icon
function apptStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <DateIcon />,
    2: <LocationIcon />,
    3: <InfoIcon />,
  };

  return (
    <ApptStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ApptStepIconRoot>
  );
}

export default class MyAppt extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      stepClicked: 'Date & Time',
      navBtnClicked: 'Date & Time',
      backNextClicked: '',
      stepCompleted: 2,

      showAlert: false,
      alertType: '',
      showBackdrop: false,
      showDialog: '',
      showHelperError: '',
      modifyApptData: {},
      confirmRefID: '',
      cancelReason: '',
      firstName: '',
      apptData: [],
      expiredData: [],

      apptDate: '',
      apptTime: '',
      minEndTime: null,
      apptEndTime: '',

      addrPickUp: '',
      addrAppt: '',

      gpName: '',
      disability: -1,
      escort: null,
      notes: '',
      specialReq: '',
    })

    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleNavBtnClick = this.handleNavBtnClick.bind(this);
    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
    this.showModifyDialog = this.showModifyDialog.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleHelperError = this.handleHelperError.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.getPatientAppointment = this.getPatientAppointment.bind(this);
    this.filterExpireAppt = this.filterExpireAppt.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.updateAppointment = this.updateAppointment.bind(this);
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
    } else {// If back button is pressed
      this.setState({ backNextClicked: 'back', stepClicked: stepID });
    }
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Handle Dialog Closed
  handleCloseDialog() {
    this.setState({ showDialog: '', stepClicked: 'Date & Time' })
  }

  // Handle Error Message Closed
  handleCloseAlert() {
    this.setState({ showAlert: false })
  }

  // Get Patient Appointments from Database
  getPatientAppointment = async () => {
    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access

    // Show Backdrop Loading while Retrieving Appointment Data
    this.setState({
      showBackdrop: true,
      firstName: userContext.user.firstName
    })

    // Get patient appointment via API
    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      const res = await axios.get('http://127.0.0.1:8000/api/get-appointment', config);
      if (res.status === 200) {
        this.setState({
          apptData: res.data,
          showBackdrop: false,
        }, () => { this.filterExpireAppt(this.state.apptData) })
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Filter Expried Appointments
  filterExpireAppt(apptData) {
    let upComingAppt = []
    let expiredAppt = []

    for (var data of apptData) {
      let date = data.apptDate.split("-")
      let time = data.apptTime.split(":")
      let apptTimeStamp = new Date(date[0], date[1] - 1, date[2], time[0], time[1])
      data.expired = apptTimeStamp.getTime() < Date.now() ? expiredAppt.push(data) : upComingAppt.push(data)
    }

    this.setState({
      apptData: upComingAppt,
      expiredData: expiredAppt
    }, () => { })
  }

  // Double Confirm Before Delete / Update Booking Data
  showModifyDialog(data, action) {
    this.setState({
      showDialog: action,
      modifyApptData: data
    })
  }

  // Handle All textfield changes
  handleTextFieldChange(event, field) {
    this.setState({ [field]: event.target.value })
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

  // Handle Show Helper Text
  handleHelperError(field) {
    if (field == 'reasonCancel') {
      this.setState({ showHelperError: 'reasonCancel' })
    } else {
      this.setState({ showHelperError: 'apptRefID' })
    }
  }

  // Check if user confirms to Cancel Appointment
  confirmDelete() {
    // Delete Appointment only if User Confirms
    if (this.state.cancelReason != '') {
      if (this.state.modifyApptData.refID != this.state.confirmRefID) {
        this.setState({ showHelperError: 'apptRefID' })
      } else {
        this.deleteAppointment(this.state.confirmRefID);
      }
    } else {
      this.setState({ showHelperError: 'reasonCancel' })
    }
  }

  // Delete Appointment
  deleteAppointment = async (apptRefID) => {
    // Show Loagind Backdrop
    this.setState({ showBackdrop: true, showDialog: '' })

    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access

    // Delete patient booking via API
    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      const res = await axios.delete('http://127.0.0.1:8000/api/delete-appointment/' + apptRefID, config);
      if (res.status === 200) {
        setTimeout(() => {
          this.setState({
            showAlert: true,
            alertType: 'cancel',
            showBackdrop: false,
          })
          // Reload page to update up coming bookings
          window.location.reload();
        }, 1200)
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Update Appointment
  updateAppointment = async () => {
    // Show Loagind Backdrop
    this.setState({ showBackdrop: true, showDialog: '' })

    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access
    let apptRefID = this.state.modifyApptData.refID

    // Booking data to update in database
    let apptData = {
      apptDate: this.state.apptDate == '' ? this.state.modifyApptData.apptDate : this.state.apptDate,
      apptTime: this.state.apptTime == '' ? this.state.modifyApptData.apptTime : this.state.apptTime,
      apptEndTime: this.state.apptEndTime == '' ? this.state.modifyApptData.apptEndTime : this.state.apptEndTime,
      addrPickUp: this.state.addrPickUp == '' ? this.state.modifyApptData.addrPickUp : this.state.addrPickUp,
      addrAppt: this.state.addrAppt == '' ? this.state.modifyApptData.addrAppt : this.state.addrAppt,
      gpName: this.state.gpName == '' ? this.state.modifyApptData.gpName : this.state.gpName,
      disability: this.state.disability == -1 ? this.state.modifyApptData.disability : this.state.disability,
      escort: this.state.escort == null ? this.state.modifyApptData.escort : this.state.escort,
      notes: this.state.notes == '' ? this.state.modifyApptData.notes : this.state.notes,
      specialReq: this.state.specialReq == '' ? this.state.modifyApptData.specialReq : this.state.specialReq,
    };

    // Update patient booking via API
    try {
      // Authorization Key to send PUT request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      const res = await axios.put('http://127.0.0.1:8000/api/update-appointment/' + apptRefID, apptData, config);
      console.log(res.status);
      if (res.status === 200) {
        setTimeout(() => {
          this.setState({
            showBackdrop: false,
            showAlert: true,
            alertType: 'update',
          })
          // Reload page to update up coming bookings
          window.location.reload();
        }, 1200)
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Format Time
  formatTime = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    const parsedHours = parseInt(hours, 10);

    const ampm = parsedHours >= 12 ? 'PM' : 'AM';
    const formattedHours = parsedHours % 12 === 0 ? 12 : parsedHours % 12;

    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Retrieve Context Data immediately after page loaded
    window.addEventListener('load', this.getPatientAppointment);

    return (
      <div>
        {/* Display Alert */}
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.showAlert}
          onClose={this.handleCloseAlert}
          autoHideDuration={6000}
          message="alert message"
        >
          <Alert
            elevation={2}
            onClose={this.handleCloseAlert}
            severity={'success'}
            sx={{ width: '100%' }}
          >
            {this.state.alertType == 'cancel' ? 'Booking Cancelled !' : 'Booking Detials Updated !'}
          </Alert>
        </Snackbar>

        {/* Backdrop Loading */}
        <Backdrop
          sx={{ color: '#FFF', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.showBackdrop}
          onClick={this.handleCloseBackdrop}
        >
          <CircularProgress color="primary" />
        </Backdrop>

        {/* Dialog to Confirm Cancel Booking */}
        <Dialog
          open={this.state.showDialog == 'cancel' ? true : false}
          onClose={this.handleCloseDialog}
          PaperProps={{
            sx: {
              maxWidth: '500px',
              width: '500px',
              borderRadius: '5px'
            }
          }}
        >
          {/* Title */}
          <Box
            width='100%'
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pt={'1rem'}
            p={'1rem 1rem 0rem 1.5rem'}
          >
            <Typography
              textAlign={'left'}
              fontSize={'18px'}
              fontWeight={'450'}
            >
              Cancel Booking {'>'} {this.state.modifyApptData.refID}
            </Typography>

            <IconButton onClick={this.handleCloseDialog} sx={{ p: '0rem', alignItems: 'start', color: "#000" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider variant='fullWidth' sx={{ p: '5px' }} />

          {/* Show Appointment Detail to Cancel */}
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            my={'20px'}
            gap={'0.5rem'}
          >
            <BookingIcon sx={{ fontSize: '35px', color: 'gray' }} />
            <DialogTitle sx={{ textAlign: 'center', p: '0px', pt: '5px' }}>
              {this.state.modifyApptData.refID}
            </DialogTitle>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={'0.5rem'}>
              <DateIcon sx={{ fontSize: '18px' }} />

              {this.state.modifyApptData.apptDate}, {this.formatTime(String(this.state.modifyApptData.apptTime))}
            </Box>
          </Box>
          <Divider variant='fullWidth' sx={{ p: '0px' }} />

          {/* Reason to Cancel */}
          <DialogContent
            sx={{
              textAlign: 'start',
              pt: '15px', px: '20px', pb: '5px',
              fontWeight: '450',
              fontSize: '13px'
            }}>
            *Reason to Cancel:
          </DialogContent>
          <FormControl fullWidth variant="outlined" required sx={{ pt: '0px', px: '20px', pb: '0px' }}>
            <OutlinedInput
              placeholder="We need to know why are you cancelling?"
              onChange={(e) => { this.handleTextFieldChange(e, "cancelReason") }}
              inputProps={{ style: { padding: '10px' } }}
            />
          </FormControl>
          <FormHelperText sx={{ px: '20px', color: 'red', display: this.state.showHelperError == 'reasonCancel' ? 'flex' : 'none' }}>
            Reason is required !
          </FormHelperText>
          <Divider variant='fullWidth' sx={{ p: '10px' }} />

          {/* Instruction to Confirm Cancel */}
          <DialogContent sx={{ pt: '20px', px: '20px', pb: '0px', fontSize: '13px', fontWeight: '450' }}>
            To confirm, type "{this.state.modifyApptData.refID}" in box below:
          </DialogContent>

          {/* User input Ref ID to Confirm Cancel */}
          <FormControl fullWidth variant="outlined" required sx={{ pt: '0px', px: '20px', pb: '0px' }}>
            <OutlinedInput
              onChange={(e) => { this.handleTextFieldChange(e, 'confirmRefID') }}
              inputProps={{ style: { textTransform: "uppercase", padding: '5px 10px' } }}
            />
          </FormControl>
          <FormHelperText sx={{ px: '20px', color: 'red', display: this.state.showHelperError == 'apptRefID' ? 'flex' : 'none' }}>
            Reference ID does not match !
          </FormHelperText>

          {/* Buttons Confirm Cancel / Discard */}
          <DialogActions sx={{ pr: '20px' }}>
            <Button color='error' sx={{ fontWeight: 700 }} onClick={this.confirmDelete}>Confirm Cancel</Button>
            <Button sx={{ fontWeight: 700 }} onClick={this.handleCloseDialog}>Discard</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog to Update Booking Details */}
        <Dialog
          open={this.state.showDialog == 'change' ? true : false}
          onClose={this.handleCloseDialog}
          PaperProps={{
            sx: {
              pt: '0.5rem',
              pb: '3rem',
              maxHeight: '500px',
              maxWidth: '800px',
              width: '1000px',
              borderRadius: '5px',
              display: 'block',
              alignItems: 'center',
            }
          }}
        >
          {/* Title */}
          <Box
            width='100%'
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pt={'1rem'}
            px={'2rem'}
          >
            <Typography
              textAlign={'left'}
              fontSize={'18px'}
              fontWeight={'900'}
            >
              Update Booking Details {'>'} {this.state.modifyApptData.refID}
            </Typography>

            <IconButton onClick={this.handleCloseDialog} sx={{ p: '0rem', alignItems: 'start', color: "#000" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Dispaly Current Step */}
          <Stepper
            alternativeLabel
            activeStep={this.state.stepCompleted}
            sx={{
              mx: 'auto',
              my: '2rem',
              p: '0rem',
              width: '80%',
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

          {/* Input - Date & Time */}
          <Box
            display={this.state.stepClicked === 'Date & Time' ? 'flex' : 'none'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={'2.5rem'}
          >
            {/* Back Button */}
            <IconButton
              size="small"
              onClick={() => this.handleNavBtnClick('Date & Time', 'back')}
            >
              <BackIcon sx={{ fontSize: "3.5rem" }} />
            </IconButton>

            {/* Appointment Date & Time */}
            <Slide
              direction={this.state.backNextClicked === 'next' ? "right" : 'left'}
              in={this.state.stepClicked === 'Date & Time'}
              timeout={500}
            >
              <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                width={'68%'}
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
                        defaultValue={dayjs((this.state.modifyApptData.apptDate))}
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
                        value={(dayjs("2001-03-15T" + this.state.modifyApptData.apptTime))}
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
                        defaultValue={(dayjs("2001-03-15," + this.state.modifyApptData.apptEndTime))}
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
              </Box>
            </Slide>

            {/* Next Button */}
            <IconButton
              size="small"
              onClick={() => this.handleNavBtnClick('Location', 'next')}>
              <NextIcon sx={{ fontSize: "3.5rem" }} />
            </IconButton>
          </Box>

          {/* Input - Location */}
          <Box
            display={this.state.stepClicked === 'Location' ? 'flex' : 'none'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={'2.5rem'}
          >
            {/* Back Button */}
            <IconButton
              size="small"
              onClick={() => this.handleNavBtnClick('Date & Time', 'back')}
            >
              <BackIcon sx={{ fontSize: "3.5rem" }} />
            </IconButton>

            {/* Appointment Location */}
            <Slide
              direction={this.state.backNextClicked === 'next' ? "right" : 'left'}
              in={this.state.stepClicked === 'Location'}
              timeout={500}
            >
              <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                width={'68%'}
                gap={'3rem'}
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

                  {/* Pick Up Address */}
                  <Grid item lg={12}>
                    <CustTextField
                      defaultValue={this.state.modifyApptData.addrPickUp}
                      id="appt-addr"
                      label="Pick Up Address Details"
                      onChange={(e) => this.handleTextFieldChange(e, "addrPickUp")}
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
                      defaultValue={this.state.modifyApptData.gpName}
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

                  {/* Appointment Address*/}
                  <Grid item lg={12}>
                    <CustTextField
                      defaultValue={this.state.modifyApptData.addrAppt}
                      id="appt-apptAddr"
                      label="Appointment Address Details"
                      placeholder="Enter appointment (GP) Address"
                      onChange={(e) => this.handleTextFieldChange(e, "addrAppt")}
                    />
                  </Grid>
                </Grid>

              </Box>
            </Slide>

            {/* Next Button */}
            <IconButton
              size="small"
              onClick={() => this.handleNavBtnClick('Appointment Details', 'next')}>
              <NextIcon sx={{ fontSize: "3.5rem" }} />
            </IconButton>
          </Box>

          {/* Input - Appt Detail */}
          <Box
            display={this.state.stepClicked === 'Appointment Details' ? 'flex' : 'none'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={'2.5rem'}
          >
            {/* Back Button */}
            <IconButton
              size="small"
              onClick={() => this.handleNavBtnClick('Location', 'back')}
            >
              <BackIcon sx={{ fontSize: "3.5rem" }} />
            </IconButton>

            {/* Appointment Details */}
            <Slide
              direction={this.state.backNextClicked === 'next' ? "right" : 'left'}
              in={this.state.stepClicked === 'Appointment Details'}
              timeout={500}
            >
              <Box
                display={this.state.stepClicked === 'Appointment Details' ? 'flex' : 'none'}
                flexDirection={'column'}
                justifyContent={'center'}
                width={'68%'}
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
                      id="appt-diability"
                      label="Disability"
                      select
                      defaultValue={this.state.modifyApptData.disability}
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
                      id="appt-escort"
                      label="Medical / Relative Escort"
                      select
                      defaultValue={this.state.modifyApptData.escort}
                      helperText="*Note: Only one (1) escort is allowed."
                      onChange={(e) => this.handleTextFieldChange(e, "escort")}
                    >
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
                  error={false}
                  variant="outlined"
                  id="appt-note"
                  label={String("Important Notes (optional)")}
                  placeholder="Let us know if there is anything our staff should take note during the journey.."
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue={this.state.modifyApptData.notes}
                  onChange={(e) => this.handleTextFieldChange(e, "notes")}
                />

                {/* Special Requirements */}
                <TextField
                  error={false}
                  variant="outlined"
                  id="appt-requirements"
                  label="Special Requirements (optional)"
                  placeholder="Let us know if you have any special requirements.."
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue={this.state.modifyApptData.specialReq}
                  onChange={(e) => this.handleTextFieldChange(e, "specialReq")}
                />

              </Box>
            </Slide>

            {/* Next Button */}
            <IconButton
              size="small"
              onClick={() => this.handleNavBtnClick('Appointment Details', 'next')}>
              <NextIcon sx={{ fontSize: "3.5rem" }} />
            </IconButton>
          </Box>

          {/* Update Button */}
          <Box mt={'2rem'} display='flex' justifyContent={'center'}>
            <NavButton onClick={() => this.updateAppointment()}>
              Update
            </NavButton>
          </Box>

        </Dialog>

        {/* Header App Bar */}
        <ZoneHeader />

        {/* Background Image */}
        <Box
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: 'fit-auto',
            maxWidth: '100vw',
          }}
        >
          {/* Page Content */}
          <Box
            sx={{
              mx: 'auto',
              width: '80%',
              pt: '3rem',
              pb: '5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Title - Up Coming Appointment */}
            <Typography
              variant="h5"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              {this.state.firstName} 's Up-Coming Appointment(s)
            </Typography>

            {/* All Appointment Info */}
            <Stack
              display={this.state.apptData.length == 0 ? 'none' : 'flex'}
              mt={'3rem'}
              mb={'5rem'}
              direction={'column'}
              gap={'2rem'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {this.state.apptData.map((data) => (
                <Card
                  elevation={3}
                  sx={{
                    flexDirection: 'column',
                    width: '75%',
                    borderRadius: '10px',
                    p: '20px',
                  }}
                >
                  {/* GP Name & Date Time */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    width={'100%'}
                    alignItems={'center'}
                  >
                    {/* GP Name */}
                    <Grid container lg={6}>
                      <Grid item lg={0.8} display={'flex'} alignItems={'center'}><LocationIcon sx={{ fontSize: '20px' }} /></Grid>
                      <Grid item lg={11}>
                        <Typography alignItems={'center'} variant="subtitle1" color="text.primary" fontWeight='bold'>{data.gpName}</Typography>
                      </Grid>
                    </Grid>

                    {/* Date Time */}
                    <Grid container lg={6}>
                      <Grid item lg={0.8} display={'flex'} alignItems={'center'}><DateIcon sx={{ fontSize: '20px' }} /></Grid>
                      <Grid item lg={11}>
                        <Typography alignItems={'center'} variant="subtitle1" color="text.primary" fontWeight='bold'>{data.apptDate}, {this.formatTime(data.apptTime)} - {this.formatTime(data.apptEndTime)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Appt Details */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    width={'95%'}
                    alignItems={'center'}
                    mx={'auto'}
                    mt={'1.5rem'}
                  >
                    {/* Booking Ref */}
                    <Grid container width={'82%'} justifyContent={'start'} rowGap={'1rem'}>
                      <Grid item lg={2.5}>
                        <Typography variant="subtitle2" color="text.primary">
                          Booking Ref.
                        </Typography>
                      </Grid>
                      <Grid item lg={0.5}>
                        :
                      </Grid>
                      <Grid item lg={9}>
                        <Typography variant="subtitle2" color="text.primary">
                          {data.refID}
                        </Typography>
                      </Grid>


                      {/* Pick Up Addr */}
                      <Grid item lg={2.5}>
                        <Typography variant="subtitle2" color="text.primary">
                          Pick Up Address
                        </Typography>
                      </Grid>
                      <Grid item lg={0.5}>
                        :
                      </Grid>
                      <Grid item lg={9}>
                        <Typography variant="subtitle2" color="text.primary">
                          {data.addrPickUp}
                        </Typography>
                      </Grid>

                      {/* Appt Address */}
                      <Grid item lg={2.5}>
                        <Typography variant="subtitle2" color="text.primary">
                          Appt. Address
                        </Typography>
                      </Grid>
                      <Grid item lg={0.5}>
                        :
                      </Grid>
                      <Grid item lg={9}>
                        <Typography variant="subtitle2" color="text.primary">
                          {data.addrAppt}
                        </Typography>
                      </Grid>

                    </Grid>

                    {/* Cancel / Edit Appt */}
                    <Grid container width={'18%'} display={'flex'} justifyContent={'start'}>
                      {/* Cancel */}
                      <Grid item lg={5} display={'flex'} justifyContent={'start'}>
                        <Link component={'button'} onClick={() => this.showModifyDialog(data, 'cancel')}>Cancel</Link>
                      </Grid>
                      <Grid item lg={4} display={'flex'} justifyContent={'center'}>
                        <DeleteIcon />
                      </Grid>

                      {/* Edit */}
                      <Grid item lg={5} display={'flex'} justifyContent={'start'}>
                        <Link component={'button'} onClick={() => this.showModifyDialog(data, 'change')}>Change</Link>
                      </Grid>
                      <Grid item lg={4} display={'flex'} justifyContent={'center'}>
                        <EditIcon />
                      </Grid>
                    </Grid>

                  </Box>
                </Card>
              ))}

            </Stack>

            {/* Display No Bookings Yet */}
            <Typography
              display={this.state.apptData.length == 0 ? 'flex' : 'none'}
              variant="h5" color={'gray'}
              mt={'5rem'}
            >
              No Up Coming Bookings.
            </Typography>

            {/* ------------------------------------------------------------------------- */}

            {/* Title - Expired Appointment */}
            <Typography
              display={this.state.expiredData.length == 0 ? 'none' : 'flex'}
              variant="h5"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
              mt={'1rem'}
            >
              Previous Appointment(s)
            </Typography>

            {/* All Appointment Info */}
            <Stack
              display={this.state.expiredData.length == 0 ? 'none' : 'flex'}
              mt={'3rem'}
              mb={'5rem'}
              direction={'column'}
              gap={'2rem'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {this.state.expiredData.map((data) => (
                <Card
                  elevation={3}
                  sx={{
                    opacity: '50%',
                    flexDirection: 'column',
                    width: '75%',
                    borderRadius: '10px',
                    p: '20px',
                  }}
                >
                  {/* GP Name & Date Time */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    width={'100%'}
                    alignItems={'center'}
                  >
                    {/* GP Name */}
                    <Grid container lg={6}>
                      <Grid item lg={0.8} display={'flex'} alignItems={'center'}><LocationIcon sx={{ fontSize: '20px' }} /></Grid>
                      <Grid item lg={11}>
                        <Typography alignItems={'center'} variant="subtitle1" color="text.primary" fontWeight='bold'>{data.gpName}</Typography>
                      </Grid>
                    </Grid>

                    {/* Date Time */}
                    <Grid container lg={6}>
                      <Grid item lg={0.8} display={'flex'} alignItems={'center'}><DateIcon sx={{ fontSize: '20px' }} /></Grid>
                      <Grid item lg={11}>
                        <Typography alignItems={'center'} variant="subtitle1" color="text.primary" fontWeight='bold'>{data.apptDate}, {this.formatTime(data.apptTime)} - {this.formatTime(data.apptEndTime)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Appt Details */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    width={'95%'}
                    alignItems={'center'}
                    mx={'auto'}
                    mt={'1.5rem'}
                  >
                    {/* Booking Ref */}
                    <Grid container width={'82%'} justifyContent={'start'} rowGap={'1rem'}>
                      <Grid item lg={2.5}>
                        <Typography variant="subtitle2" color="text.primary">
                          Booking Ref.
                        </Typography>
                      </Grid>
                      <Grid item lg={0.5}>
                        :
                      </Grid>
                      <Grid item lg={9}>
                        <Typography variant="subtitle2" color="text.primary">
                          {data.refID}
                        </Typography>
                      </Grid>


                      {/* Pick Up Addr */}
                      <Grid item lg={2.5}>
                        <Typography variant="subtitle2" color="text.primary">
                          Pick Up Address
                        </Typography>
                      </Grid>
                      <Grid item lg={0.5}>
                        :
                      </Grid>
                      <Grid item lg={9}>
                        <Typography variant="subtitle2" color="text.primary">
                          {data.addrPickUp}
                        </Typography>
                      </Grid>

                      {/* Appt Address */}
                      <Grid item lg={2.5}>
                        <Typography variant="subtitle2" color="text.primary">
                          Appt. Address
                        </Typography>
                      </Grid>
                      <Grid item lg={0.5}>
                        :
                      </Grid>
                      <Grid item lg={9}>
                        <Typography variant="subtitle2" color="text.primary">
                          {data.addrAppt}
                        </Typography>
                      </Grid>

                    </Grid>

                  </Box>
                </Card>
              ))}

            </Stack>

          </Box>
        </Box>
      </div >
    )
  }
}