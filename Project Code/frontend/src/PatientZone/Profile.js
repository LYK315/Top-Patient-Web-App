import React, { Component } from "react";
import ZoneHeader from "../components/PatientZoneHeader";
import { Box, Grid, Typography, TextField, Container, Button, Alert, IconButton, Slide, FormControl, Input, InputAdornment, Backdrop, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import CloseIcon from '@mui/icons-material/Close';
import EditOffIcon from '@mui/icons-material/EditOff';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import AuthContext from "../components/AuthContext";

// Custom Button Component
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

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      showBackdrop: true,
      showAlert: false,
      editDisability: false,
      editContact: false,
      editEmail: false,
      nhsNum: "",
      gender: "",
      firstName: "",
      lastName: "",
      dob: "",
      disability: "",
      contact: "",
      email: "",
      authToken: "",
    })

    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
    this.handleEditField = this.handleEditField.bind(this);
    this.getPatientInfo = this.getPatientInfo.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
  }

  // Get patient information
  getPatientInfo = async () => {
    // Access Context Data
    let userContext = this.context;
    let emailID = userContext.user.email;
    let firstName = userContext.user.firstName;
    let accessToken = userContext.authToken.access;

    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      // Get patient data via api request
      const res = await axios.get('http://127.0.0.1:8000/api/get-patient', config)
      if (res.status === 200) {
        let data = res.data;

        this.setState({
          showBackdrop: false,
          nhsNum: data.nhsNumber,
          gender: data.gender,
          dob: data.birthDate,
          contact: data.contact,
          email: emailID,
          firstName: firstName,
        }, () => { });

        if (data.disability == '1') {
          this.setState({ disability: "I'm able to Walk" })
        } else if (data.disability == '2') {
          this.setState({ disability: "I Need a Wheelchair" })
        } if (data.disability == '3') {
          this.setState({ disability: "I Need a Stretcher" })
        }
      }
    } catch (error) {
      console.log(err)
    }
  }

  // Handle Close Alert
  handleCloseAlert() {
    this.setState({
      showAlert: false,
    })
  }

  // Handle Scroll to Top
  scrollToTop() {
    window.scrollTo({ top: 0 })
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Handle user press edit either editable field
  handleEditField(fieldID) {
    if (fieldID === 'disability') {
      this.setState({
        editDisability: !(this.state.editDisability)
      })
    } else if (fieldID === 'contact') {
      this.setState({
        editContact: !(this.state.editContact)
      })
    } else if (fieldID === 'email') {
      this.setState({
        editEmail: !(this.state.editEmail)
      })
    }
  }

  // Update Patient Data in Database
  updatePatientData = async () => {
    // Show Backdrop Loading
    this.setState({ showBackdrop: true })

    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access

    // Assign values to be passed to database
    const data = {
      contact: this.state.contact,
    };

    // Update Patient Data via API
    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      const res = await axios.put('http://127.0.0.1:8000/api/update-patient', data, config);
      if (res.status === 200) {
        setTimeout(() => {
          this.setState({
            showAlert: true,
            showBackdrop: false,
            editContact: false,
          })
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Handle contact change
  handleContactChange(event) {
    this.setState({
      contact: event.target.value
    });
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // GGet Patient Info immediately after page load
    window.addEventListener('load', this.getPatientInfo);

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

        {/* Header App Bar */}
        <ZoneHeader />

        {/* Page Body */}
        <Box
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: 'auto',
            maxWidth: '100vw',
          }}>
          <Container
            sx={{
              width: '90%',
              pt: '4rem',
              pb: '2rem'
            }}
          >
            {/* Alert Message - Profile Updated */}
            <Slide direction="down" in={this.state.showAlert} timeout={400} onAnimationEnd={this.scrollToTop}>
              <Alert
                severity="success"
                sx={{
                  display: this.state.showAlert ? 'flex' : 'none',
                  position: 'absolute',
                  mt: '-52px',
                  mx: 'auto',
                  width: '63%',
                  left: '0',
                  right: '0',
                }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={this.handleCloseAlert}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Profile Updated Succesfully !
              </Alert>
            </Slide>

            {/* Title */}
            <Typography
              variant="h4"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              {this.state.firstName}'s Profile
            </Typography>

            {/* Page Content */}
            <Grid
              mx={'auto'}
              container
              justifyContent={'start'}
              rowGap={'2rem'}
              alignItems={'center'}
              width={'85%'}
              pt={'50px'}
              pb={'15px'}
            >
              {/* NHS Number */}
              <Grid
                container
                justifyContent={'start'}
                width={'100%'}
              >
                <Grid item lg={2}>
                  <Typography variant="h6" color="text.primary">NHS Number</Typography>
                </Grid>
                <Grid item lg={0.5}>
                  :
                </Grid>
                <Grid item lg={7}>
                  <TextField
                    fullWidth
                    disabled
                    variant="standard"
                    id="patient-nhs"
                    value={this.state.nhsNum}
                  />
                </Grid>
              </Grid>

              {/* Gender */}
              <Grid
                container
                justifyContent={'start'}
                width={'100%'}
              >
                <Grid item lg={2}>
                  <Typography variant="h6" color="text.primary">Gender</Typography>
                </Grid>
                <Grid item lg={0.5}>
                  :
                </Grid>
                <Grid item lg={7}>
                  <TextField
                    fullWidth
                    disabled
                    variant="standard"
                    id="patient-gender"
                    value={this.state.gender}
                  />
                </Grid>
              </Grid>

              {/* DOB */}
              <Grid
                container
                justifyContent={'start'}
                width={'100%'}
              >
                <Grid item lg={2}>
                  <Typography variant="h6" color="text.primary">Birth Date</Typography>
                </Grid>
                <Grid item lg={0.5}>
                  :
                </Grid>
                <Grid item lg={7}>
                  <TextField
                    fullWidth
                    disabled
                    variant="standard"
                    id="patient-dob"
                    value={this.state.dob}
                  />
                </Grid>
              </Grid>

              {/* Disability */}
              <Grid
                container
                justifyContent={'start'}
                width={'100%'}
              >
                <Grid item lg={2}>
                  <Typography variant="h6" color="text.primary">Disability</Typography>
                </Grid>
                <Grid item lg={0.5}>
                  :
                </Grid>
                <Grid item lg={7}>
                  <TextField
                    fullWidth
                    disabled
                    variant="standard"
                    id="patient-nhs"
                    value={this.state.disability}
                  />
                </Grid>
              </Grid>

              {/* Mobile Number */}
              <Grid
                container
                justifyContent={'start'}
                width={'100%'}
              >
                <Grid item lg={2}>
                  <Typography variant="h6" color="text.primary">Contact</Typography>
                </Grid>
                <Grid item lg={0.5}>
                  :
                </Grid>
                <Grid item lg={7}>
                  <FormControl fullWidth variant="standard" disabled={this.state.editContact ? false : true}>
                    <Input
                      value={this.state.editContact ? null : this.state.contact}
                      defaultValue={this.state.editContact ? this.state.contact : null}
                      id="patient-disability"
                      onChange={this.handleContactChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => this.handleEditField('contact')}
                          >
                            {this.state.editContact ? <EditOffIcon /> : <EditIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {/* Email */}
              <Grid
                container
                justifyContent={'start'}
                width={'100%'}
              >
                <Grid item lg={2}>
                  <Typography variant="h6" color="text.primary">Email</Typography>
                </Grid>
                <Grid item lg={0.5}>
                  :
                </Grid>
                <Grid item lg={7}>
                  <TextField
                    fullWidth
                    disabled
                    variant="standard"
                    id="patient-email"
                    value={this.state.email}
                  />
                </Grid>
              </Grid>

              {/* Update Changes */}
              <NavButton
                variant="contained"
                onClick={this.updatePatientData}
                sx={{
                  my: '30px',
                  mx: 'auto'
                }}
              >
                Update Changes
              </NavButton>
            </Grid>

          </Container>
        </Box>
      </div>
    )
  }
}