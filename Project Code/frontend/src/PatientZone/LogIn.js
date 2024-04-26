import React, { Component } from "react";
import { Typography, Box, Stack, Button, TextField, Paper, Slide, FormControl, InputLabel, Input, InputAdornment, IconButton, MenuItem, Grid, OutlinedInput, FormHelperText, Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import UploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import AuthContext from "../components/AuthContext";

// Custom Buton Components
const CustButton = styled((props) => (
  <Button
    size="small"
    const {...props}
  />))
  (({ theme }) => ({
    textTransform: 'none',
    fontWeight: 'bold',
  }));

const NavButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#D9EAFF',
  borderRadius: '20px',
  textAlign: 'center',
  fontWeight: 'bold',
  textTransform: 'none',
  width: '150px',
  height: '35px',
  color: theme.palette.text.secondary,
  '&:hover': {
    opacity: '50%',
    backgroundColor: '#D9EAFF',
  }
}));

// Custom Typography Components
const TitleTypography = styled((props) => (
  <Typography
    variant="h6"
    color='text.secondary'
    const {...props}
  />))
  (({ theme }) => ({
    fontWeight: 'bold',
  }));

export default class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayBoard: 'LogIn', // LogIn or CreateAcc
      showPass: false, // Show / Hide password
      showConfirmPass: false, // Show / Hide confirm password
      passMatch: true, // Check if password & confirmPass match
      allFieldEntered: true, // Check if all field is not empty
      showBackdrop: false, // Show backdrop
      showAlert: false, // Show alert
      alertType: ' ', // emptyField, createAcc
      nhsNum: ' ',
      dob: ' ',
      fName: ' ',
      lName: ' ',
      email: ' ',
      contact: ' ',
      gender: ' ',
      disability: 0,
      pass: ' ',
      confirmPass: ' ',
      crntCond: ' ',
      file: ' ',
    }

    this.handleDisplayBoard = this.handleDisplayBoard.bind(this);
    this.handleShowPass = this.handleShowPass.bind(this);
    this.handleMouseDownPass = this.handleMouseDownPass.bind(this);
    this.handleShowConfirmPass = this.handleShowConfirmPass.bind(this);
    this.handleMouseDownConfirmPass = this.handleMouseDownConfirmPass.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleCheckPassword = this.handleCheckPassword.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.appendPatientDB = this.appendPatientDB.bind(this);
    this.checkField = this.checkField.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
  }

  // Handle display (LogIn / Create Account)
  handleDisplayBoard(display) {
    this.setState({
      displayBoard: display
    })
  };

  // Handle (Hide/Show) Password
  handleShowPass() {
    this.setState({
      showPass: !(this.state.showPass)
    })
  };

  // Handle (Hide/Show) Confirm Password
  handleShowConfirmPass() {
    this.setState({
      showConfirmPass: !(this.state.showConfirmPass)
    })
  };

  // Prevent browser default event on password input field
  handleMouseDownPass(event) {
    event.preventDefault();
  }

  // Prevent browser default event on confirm password input field
  handleMouseDownConfirmPass(event) {
    event.preventDefault();
  }

  // Handle all text field change
  handleTextFieldChange(event, field) {
    this.setState({
      [field]: event.target.value
    }, () => {
      // Here to Access variable if want immediate update
    });
  }

  // Set Date of Birth
  handleDateChange(date) {
    let formatDate = dayjs(date);
    this.setState({
      dob: dayjs(formatDate.get('years') + "-" + (formatDate.get('months') + 1) + "-" + formatDate.get('date'))
        .format('YYYY-MM-DD').toString(),
    }, () => {
    });
  }

  // Check Password & Confirm Password is same
  handleCheckPassword(event) {
    let confirmPass = event.target.value;
    if (this.state.pass != confirmPass) {
      this.setState({ passMatch: false })
    } else {
      this.setState({ passMatch: true })
    }
  }

  // Handle File Upload
  handleFileUpload(event) {
    this.setState({
      file: event.target.value,
    }, () => {
      console.log("File: " + this.state.file);
    });
  }

  // Handle Error Message Bar
  handleCloseAlert() {
    this.setState({
      showAlert: false,
    })
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Check if all fields are entered
  checkField() {
    if (this.state.nhsNum == ' ' || this.state.dob == ' ' || this.state.fName == ' ' || this.state.lName == ' ' ||
      this.state.email == ' ' || this.state.contact == ' ' || this.state.gender == ' ' || this.state.disability == 0 ||
      this.state.confirmPass == ' ' || this.state.crntCond == ' ') {
      this.setState({
        allFieldEntered: false,
        showAlert: true,
        alertType: 'emptyField'
      });
      return false;
    } else {
      this.setState({ allFieldEntered: true, showBackdrop: true })
      return true;
    }
  }

  // Append new Patient to Database
  appendPatientDB() {
    if (!this.checkField()) {
      return;
    }

    // Assign values to be passed to database
    const data = {
      first_name: this.state.fName,
      last_name: this.state.lName,
      email: this.state.email,
      password: this.state.confirmPass,
      nhsNumber: this.state.nhsNum,
      gender: this.state.gender,
      birthDate: this.state.dob,
      disability: this.state.disability,
      contact: this.state.contact,
      currentCondition: this.state.crntCond
    };

    // Create Patient entry in Database
    axios.post('http://127.0.0.1:8000/api/create-patient', data).then(res => {
      if (res.status === 200) {
        // Show Log In "paper"
        this.setState({
          displayBoard: 'LogIn',
          showAlert: true,
          alertType: 'createAcc',
          showBackdrop: false,
        });
      }
    }).catch(err => {
      console.log("Error: " + err);
    })
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Access Context Data
    let userContext = this.context
    let loginUser = userContext.loginUser

    return (
      <Box
        sx={{
          backgroundImage: "url('/static/images/background-img.png')",
          minHeight: '100vh',
          maxHeight: '200vh',
          maxWidth: '100vw',
        }}>
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            pt: '40px'
          }}>

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
              {this.state.alertType == 'emptyField' ? 'Please enter all required field !' : 'Account Created !'}
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

          {/* Logo and Title */}
          <Box
            mx={'auto'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={'3rem'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: '20px'
            }}
          >
            <img
              src="/static/images/tpt.png"
              alt="logo"
              width='350px'
              height='auto'
            />

            <TitleTypography display={this.state.displayBoard === 'LogIn' ? 'block' : 'none'}>
              Log In Patient Account
            </TitleTypography>

            <TitleTypography display={this.state.displayBoard === 'CreateAcc' ? 'block' : 'none'}>
              Create Patient Account
            </TitleTypography>
          </Box>

          {/* Log In Part */}
          <Slide direction="right" in={this.state.displayBoard === 'LogIn'} timeout={500}>
            <Paper
              elevation={2}
              sx={{
                display: this.state.displayBoard === 'LogIn' ? 'flex' : 'none',
                borderRadius: '10px',
                width: 'fit-content',
                mx: 'auto',
                px: '40px',
                py: '30px'
              }}
            >
              <Box
                mx={'auto'}
                justifyContent={'center'}
                alignItems={'center'}
                gap={'2.5rem'}
                sx={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Email */}
                <TextField
                  variant="standard"
                  required={true}
                  id="patient-email"
                  name="patientEmail"
                  label="Email"
                  placeholder="Enter your Email"
                  sx={{
                    width: '300px'
                  }}
                  onChange={(e) => { this.handleTextFieldChange(e, 'email') }}
                />

                {/* Password */}
                <FormControl fullWidth variant="standard" required>
                  <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                  <Input
                    placeholder="Enter your Password"
                    id="patient-password"
                    name="patientPass"
                    type={this.state.showPass ? 'text' : 'password'}
                    onChange={(e) => { this.handleTextFieldChange(e, 'pass') }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleShowPass}
                          onMouseDown={this.handleMouseDownPass}
                        >
                          {this.state.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                {/* Log In Button */}
                <NavButton onClick={() => loginUser(this.state.email, this.state.pass, 'patient')} variant="contained">Log In</NavButton>

                {/* Create Account / Privacy Policy */}
                <Stack
                  direction={'row'}
                  justifyContent={'space-evenly'}
                  width={'100%'}
                >
                  <CustButton onClick={() => this.handleDisplayBoard('CreateAcc')}>Create Account</CustButton>
                  <CustButton href='#Privacy Policy'>Privacy Policy</CustButton>
                </Stack>
              </Box>
            </Paper>
          </Slide>

          {/* Create Account Part */}
          <Slide direction="left" in={this.state.displayBoard === 'CreateAcc'} timeout={500}>
            <Paper
              elevation={2}
              sx={{
                display: this.state.displayBoard === 'CreateAcc' ? 'block' : 'none',
                borderRadius: '10px',
                width: 'fit-content',
                mx: 'auto',
                mb: '100px',
                px: '40px',
                py: '30px'
              }}
            >
              {/* Input Fields Desktop Version */}
              <Box
                mx={'auto'}
                justifyContent={'center'}
                alignItems={'center'}
                display={{ xs: 'none', lg: 'none', xl: 'flex' }}
                flexDirection={'column'}
                gap={'1.5rem'}
                width={'800px'}
              >
                <Grid
                  container
                  justifyContent={'space-between'}
                  rowGap={'1.2rem'}
                  alignItems={'center'}
                  width={'100%'}
                  pb={'15px'}
                >
                  {/* NHS Number */}
                  <Grid item lg={5.8}>
                    <TextField
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-nhs"
                      label="NHS Number"
                      placeholder="Enter your NHS Number"
                      fullWidth
                      onChange={(e) => { this.handleTextFieldChange(e, 'nhsNum') }}
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
                            format="YYYY-MM-DD"
                            label="Date of Birth"
                            onChange={this.handleDateChange}
                            slotProps={{
                              textField: {
                                required: true,
                                variant: 'outlined',
                                id: 'patient-dob',
                              },
                            }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>

                  {/* First Name */}
                  <Grid item lg={5.8}>
                    <TextField
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-firstName"
                      label="First Name"
                      placeholder="Enter your Frist Name"
                      fullWidth
                      onChange={(e) => { this.handleTextFieldChange(e, 'fName') }}
                    />
                  </Grid>

                  {/* Last Name */}
                  <Grid item lg={5.8}>
                    <TextField
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-lastName"
                      label="Last Name"
                      placeholder="Enter your Last Name"
                      fullWidth
                      onChange={(e) => { this.handleTextFieldChange(e, 'lName') }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item lg={5.8}>
                    <TextField
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-email"
                      label="Email"
                      placeholder="Enter your Email"
                      fullWidth
                      onChange={(e) => { this.handleTextFieldChange(e, 'email') }}
                    />
                  </Grid>

                  {/* Mobile Number */}
                  <Grid item lg={5.8}>
                    <TextField
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-mobile"
                      label="Mobile Number"
                      placeholder="Enter your Mobile Number"
                      fullWidth
                      onChange={(e) => { this.handleTextFieldChange(e, 'contact') }}
                    />
                  </Grid>

                  {/* Gender */}
                  <Grid item lg={5.8}>
                    <TextField
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

                  {/* Disability */}
                  <Grid item lg={5.8}>
                    <TextField
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-disability"
                      label="Disability"
                      placeholder="Select any that matches the most"
                      fullWidth
                      select
                      defaultValue=""
                      onChange={(e) => { this.handleTextFieldChange(e, 'disability') }}
                    >
                      <MenuItem key={1} value={1}>
                        I'm Able to Walk
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        I Need a Wheelchair
                      </MenuItem>
                      <MenuItem key={3} value={3}>
                        I Need a Stretcher
                      </MenuItem>
                    </TextField>
                  </Grid>

                  {/* Password */}
                  <Grid item lg={5.8}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                      <OutlinedInput
                        label='Password'
                        placeholder="Enter your Password"
                        id="patient-password"
                        type={this.state.showPass ? 'text' : 'password'}
                        onChange={(e) => { this.handleTextFieldChange(e, 'pass') }}
                        error={this.state.passMatch ? false : true}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={this.handleShowPass}
                              onMouseDown={this.handleMouseDownPass}
                            >
                              {this.state.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText sx={{ color: 'red', display: this.state.passMatch ? 'none' : 'flex' }}>
                        Password does not match!
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Confirm Password */}
                  <Grid item lg={5.8}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
                      <OutlinedInput
                        label='Confirm Password'
                        placeholder="Enter your Password"
                        id="patient-ConfirmPassword"
                        type={this.state.showConfirmPass ? 'text' : 'password'}
                        onChange={(e) => { this.handleTextFieldChange(e, 'confirmPass') }}
                        onKeyUp={this.handleCheckPassword}
                        error={this.state.passMatch ? false : true}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={this.handleShowConfirmPass}
                              onMouseDown={this.handleMouseDownConfirmPass}
                            >
                              {this.state.showConfirmPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText sx={{ color: 'red', display: this.state.passMatch ? 'none' : 'flex' }}>
                        Password does not match!
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Current Condition */}
                  <Grid item lg={12}>
                    <TextField
                      error={false}
                      variant="outlined"
                      required={true}
                      id="patient-currCond"
                      label="Your Current Condition"
                      placeholder="Briefly describe your current medical condition"
                      fullWidth
                      multiline
                      rows={4}
                      onChange={(e) => { this.handleTextFieldChange(e, 'crntCond') }}
                    />
                  </Grid>

                  {/* Upload File */}
                  <Box
                    py={'20px'}
                    pr={'15px'}
                    alignItems={'center'}
                    border={'solid'}
                    borderRadius={'3px'}
                    borderColor={'#bcbcbc'}
                    sx={{ borderWidth: '0.5px' }}
                    width={'fit-content'}
                  >
                    <Grid item lg={12}>
                      <Stack
                        m={0}
                        p={0}
                        pl={'13px'}
                        direction={'row'}
                        spacing={1.5}
                        width={'100%'}
                        alignItems={'center'}
                      >
                        <Typography textAlign={'center'} variant="body1" color={'text.secondary'} >Do you have a Letter from Doctor / GP ?</Typography>
                        <Typography textAlign={'center'} variant='caption' color={'text.disabled'}>*Optional</Typography>
                        <Button size="small" disableElevation component='label' variant="contained" startIcon={<UploadIcon />}>
                          Upload file
                          <input type="file" hidden onChange={this.handleFileUpload} />
                        </Button>
                      </Stack>
                    </Grid>
                  </Box>
                </Grid>

                {/* Create Account Button */}
                <NavButton variant="contained" onClick={this.appendPatientDB}>Create Account</NavButton>

                <Stack
                  direction={'row'}
                  justifyContent={'space-evenly'}
                  width={'50%'}
                >
                  <CustButton onClick={() => this.handleDisplayBoard('LogIn')}>Log In</CustButton>
                  <CustButton onClick={() => alert('Privacy Policy')}>Privacy Policy</CustButton>
                </Stack>
              </Box>

              {/* Input Fields Mobile Version */}
              <Box
                mx={'auto'}
                justifyContent={'center'}
                alignItems={'center'}
                gap={'1.5rem'}
                display={{ xs: 'flex', lg: 'flex', xl: 'none' }}
                flexDirection={'column'}
              >
                {/* NHS Number */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-nhs"
                  label="NHS Number"
                  placeholder="Enter your NHS Number"
                  sx={{
                    width: '300px'
                  }}
                />

                {/* DOB */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']} sx={{ overflow: 'visible' }}>
                    <DemoItem>
                      <DatePicker
                        label="Date of Birth"
                        sx={{ width: '300px' }}
                        slotProps={{
                          textField: {
                            required: true,
                            variant: 'outlined',
                            id: 'patient-dob'
                          },
                        }}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>

                {/* Title */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-gender"
                  label="Gender"
                  fullWidth
                  select
                  defaultValue=""
                >
                  <MenuItem key={'1'} value={'1'}>
                    Male
                  </MenuItem>
                  <MenuItem key={'2'} value={'2'}>
                    Female
                  </MenuItem>
                  <MenuItem key={'3'} value={'3'}>
                    Prefer Not To Say
                  </MenuItem>
                </TextField>

                {/* First Name */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-firstName"
                  label="First Name"
                  placeholder="Enter your Frist Name"
                  fullWidth
                />

                {/* Last Name */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-lastName"
                  label="Last Name"
                  placeholder="Enter your Last Name"
                  fullWidth
                />

                {/* Email */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-email"
                  label="Email"
                  placeholder="Enter your Email"
                  fullWidth
                />

                {/* Mobile Number */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-mobile"
                  label="Mobile Number"
                  placeholder="Enter your Mobile Number"
                  fullWidth
                />

                {/* Password */}
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    label='Password'
                    placeholder="Enter your Password"
                    id="patient-password"
                    type={this.state.showPass ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleShowPass}
                          onMouseDown={this.handleMouseDownPass}
                          edge='end'
                        >
                          {this.state.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                {/* Confirm Password */}
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                  <OutlinedInput
                    label='Confirm Password'
                    placeholder="Confirm your Password"
                    id="patient-ConfirmPassword"
                    type={this.state.showConfirmPass ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleShowConfirmPass}
                          onMouseDown={this.handleMouseDownConfirmPass}
                          edge='end'
                        >
                          {this.state.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                {/* Disability */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-disability"
                  label="Disability"
                  placeholder="Select any that matches the most"
                  fullWidth
                  select
                  defaultValue=""
                >
                  <MenuItem key={1} value={1}>
                    I'm Able to Walk
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    I Need a Wheelchair
                  </MenuItem>
                  <MenuItem key={3} value={3}>
                    I Need a Stretcher
                  </MenuItem>
                </TextField>

                {/* Current Situation */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="patient-currCond"
                  label="Your Current Condition"
                  placeholder="Briefly describe your current medical condition"
                  fullWidth
                  multiline
                  rows={4}
                />

                {/* Uploade File */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                  alignItems={'center'}
                  mb={'15px'}
                  border={'solid'}
                  borderRadius={'3px'}
                  borderColor={'#bcbcbc'}
                  pt={'15px'}
                  pb={'20px'}
                  sx={{ borderWidth: '0.5px' }}
                  minWidth={'300px'}
                >
                  <Stack
                    m={0}
                    p={0}
                    direction={'row'}
                    spacing={0.5}
                    width={'90%'}
                  >
                    <Typography textAlign={'left'} variant="body1" color={'text.secondary'} >Letter from Doctor / GP</Typography>
                    <Typography textAlign={'left'} variant='caption' color={'text.disabled'}>*Optional</Typography>
                  </Stack>
                  <Button disableElevation component='label' variant="contained" startIcon={<UploadIcon />}>
                    Upload file
                    <input type="file" hidden />
                  </Button>
                </Box>

                {/* Create Account Button */}
                <NavButton variant="contained" onClick={this.appendPatientDB}>Create Account</NavButton>

                <Stack
                  direction={'row'}
                  justifyContent={'space-evenly'}
                  width={'100%'}
                >
                  <CustButton onClick={() => this.handleDisplayBoard('LogIn')}>Log In</CustButton>
                  <CustButton href='#Privacy Policy'>Privacy Policy</CustButton>
                </Stack>

              </Box>

            </Paper>
          </Slide>

        </Box>
      </Box>
    )
  }
}
