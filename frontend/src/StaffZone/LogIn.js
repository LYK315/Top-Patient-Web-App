import React, { Component } from "react";
import { Typography, Box, Link, Stack, Button, TextField, Paper, Slide, FormControl, InputLabel, Input, InputAdornment, IconButton, MenuItem, Grid, CssBaseline, OutlinedInput } from "@mui/material";
import styled from "@emotion/styled";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AuthContext from "../components/AuthContext";
import axios from "axios";

// Custom Button Components
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
      displayBoard: 'LogIn',
      showPass: false,
      showConfirmPass: false,
      email: '',
      password: '',
      confirmPassword: '',
    }

    this.handleDisplayBoard = this.handleDisplayBoard.bind(this);
    this.handleShowPass = this.handleShowPass.bind(this);
    this.handleMouseDownPass = this.handleMouseDownPass.bind(this);
    this.handleShowConfirmPass = this.handleShowConfirmPass.bind(this);
    this.handleMouseDownConfirmPass = this.handleMouseDownConfirmPass.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.appendAdmin = this.appendAdmin.bind(this);
  }

  // Handle Display LogIn / Create Account
  handleDisplayBoard(display) {
    this.setState({
      displayBoard: display
    })
  };

  // Password Textfield (show / hide)
  handleShowPass() {
    this.setState({
      showPass: !(this.state.showPass)
    })
  };

  // Prevent HTML default action on mouse click
  handleMouseDownPass(event) {
    event.preventDefault();
  }

  // Confirm Password Textfield (show / hide)
  handleShowConfirmPass() {
    this.setState({
      showConfirmPass: !(this.state.showConfirmPass)
    })
  };

  // Prevent HTML default action on mouse click
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

  // Append new Admin to Database
  appendAdmin() {
    // Assign values to be passed to database
    const data = {
      first_name: 'admin',
      last_name: 'admin',
      email: this.state.email,
      password: this.state.confirmPassword,
    };

    // Create Admin entry in Database
    axios.post('http://127.0.0.1:8000/api/create-admin', data).then(res => {
      if (res.status === 200) {
        // Show Log In "paper"
        this.setState({
          displayBoard: 'LogIn',
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
      // Page Background Ims
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
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            pt: '40px'
          }}>

          {/* Logo & Title */}
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
              Log In Staff Account
            </TitleTypography>

            <TitleTypography display={this.state.displayBoard === 'CreateAcc' ? 'block' : 'none'}>
              Create Staff Account
            </TitleTypography>
          </Box>

          {/* Log In */}
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
                {/* Staff Email */}
                <TextField
                  variant="standard"
                  required={true}
                  id="staff-email"
                  label="Staff Email"
                  placeholder="Enter your Staff Email"
                  onChange={(e) => { this.handleTextFieldChange(e, 'email') }}
                  sx={{
                    width: '300px'
                  }}
                />

                {/* Password */}
                <FormControl fullWidth variant="standard" required>
                  <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                  <Input
                    placeholder="Enter your Password"
                    id="staff-password"
                    type={this.state.showPass ? 'text' : 'password'}
                    onChange={(e) => { this.handleTextFieldChange(e, 'password') }}
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

                <NavButton onClick={() => loginUser(this.state.email, this.state.password, 'staff')} variant="contained">Log In</NavButton>

                <Stack
                  direction={'row'}
                  justifyContent={'space-evenly'}
                  width={'100%'}
                >
                  <CustButton onClick={() => this.handleDisplayBoard('CreateAcc')}>Create Account</CustButton>
                  <CustButton onClick={() => alert('Privacy Policy')}>Privacy Policy</CustButton>
                </Stack>
              </Box>
            </Paper>
          </Slide>

          {/* Create Account */}
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
              >

                {/* Staff Email */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="staff-email"
                  label="Staff Email"
                  onChange={(e) => { this.handleTextFieldChange(e, 'email') }}
                  placeholder="Enter your Staff Email"
                  sx={{
                    width: '300px'
                  }}
                />

                {/* Password */}
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    label='Password'
                    placeholder="Enter your Password"
                    id="staff-password"
                    type={this.state.showPass ? 'text' : 'password'}
                    onChange={(e) => { this.handleTextFieldChange(e, 'password') }}
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

                {/* Confirm Password */}
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
                  <OutlinedInput
                    label='Confirm Password'
                    placeholder="Enter your Password"
                    id="staff-ConfirmPassword"
                    type={this.state.showConfirmPass ? 'text' : 'password'}
                    onChange={(e) => { this.handleTextFieldChange(e, 'confirmPassword') }}
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
                </FormControl>

                {/* Create Account Button */}
                <NavButton onClick={this.appendAdmin} variant="contained" sx={{ mt: '10px' }}>Create Account</NavButton>

                {/* Log In / Privacy */}
                <Stack
                  direction={'row'}
                  justifyContent={'space-evenly'}
                  width={'100%'}
                >
                  <CustButton onClick={() => this.handleDisplayBoard('LogIn')}>Log In</CustButton>
                  <CustButton onClick={()=>alert("Privacy Policy")}>Privacy Policy</CustButton>
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
                {/* Staff Email */}
                <TextField
                  error={false}
                  variant="outlined"
                  required={true}
                  id="staff-email"
                  label="Staff Email"
                  placeholder="Enter your Staff Email"
                  onChange={(e) => { this.handleTextFieldChange(e, 'email') }}
                  sx={{
                    width: '300px'
                  }}
                />

                {/* Password */}
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    label='Password'
                    placeholder="Enter your Password"
                    id="staff-password"
                    type={this.state.showPass ? 'text' : 'password'}
                    onChange={(e) => { this.handleTextFieldChange(e, 'password') }}
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
                    id="staff-ConfirmPassword"
                    type={this.state.showConfirmPass ? 'text' : 'password'}
                    onChange={(e) => { this.handleTextFieldChange(e, 'confirmPassword') }}
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

                {/* Create Account Button */}
                <NavButton onClick={this.appendAdmin} variant="contained">Create Account</NavButton>

                {/* Log In / Privacy */}
                <Stack
                  direction={'row'}
                  justifyContent={'space-evenly'}
                  width={'100%'}
                >
                  <CustButton onClick={() => this.handleDisplayBoard('LogIn')}>Log In</CustButton>
                  <CustButton onClick={()=>alert("Privacy Policy")}>Privacy Policy</CustButton>
                </Stack>

              </Box>

            </Paper>
          </Slide>

        </Box>
      </Box>
    )
  }
}