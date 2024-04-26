import React, { Component } from "react";
import ZoneHeader from "../components/StaffZoneHeader";
import Typography from '@mui/material/Typography'
import { Backdrop, Box, Button, CircularProgress, Container, Dialog, Divider, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from "@mui/material";
import styled from "@emotion/styled";
import CloseIcon from '@mui/icons-material/CloseRounded';
import { Link } from "react-router-dom";
import AuthContext from "../components/AuthContext";
import axios from "axios";

// Custom Table Cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '1rem',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 700,
  },
}));

// Custom Table Row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.light,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default class PatientApplication extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      showDialog: false,
      showBackdrop: false,
      patientList: [],
      modifyPatientList: {},
    })

    this.getPatientList = this.getPatientList.bind(this);
    this.handleCloseBackdrop = this.handleCloseBackdrop.bind(this);
    this.showModifyDialog = this.showModifyDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  // Get Patient Waiting NEPTS Application
  getPatientList = async () => {
    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access

    // Show Backdrop Loading while Retrieving Patient List
    this.setState({
      showBackdrop: true,
    })

    // Get patient list via API
    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      const res = await axios.get('http://127.0.0.1:8000/api/get-patient-neptsReq', config);
      if (res.status === 200) {
        this.setState({
          patientList: res.data,
          showBackdrop: false,
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Handle Backdrop Closed
  handleCloseBackdrop() {
    this.setState({ showBackdrop: false })
  }

  // Display Patient Details Dialog
  showModifyDialog(data) {
    this.setState({
      showDialog: true,
      modifyPatientList: data
    })
  }

  // Handle Dialog Closed
  handleCloseDialog() {
    this.setState({ showDialog: false, modifyPatientList: {} })
  }

  // Handle Display Disability
  displayDisability(disability) {
    if (disability == 1) {
      return "I'm Able to Walk"
    } else if (disability == 2) {
      return "I Need a Wheelchair"
    } else {
      return "I Need a Stretcher"
    }
  }

  // Update Patient NEPTS Eligibility in Database
  updateNeptsEligibility = async (eligibility, userID) => {
    // Show Backdrop Loading
    this.setState({ showDialog: false, showBackdrop: true })

    // Access Context Data
    let userContext = this.context
    let accessToken = userContext.authToken.access

    // Assign values to be passed to database
    const data = {
      neptsValid: eligibility,
    };

    // Update Patient Data via API
    try {
      // Authorization Key to send GET request
      const config = {
        headers: {
          'Authorization': "Bearer " + String(accessToken),
        }
      }

      const res = await axios.put('http://127.0.0.1:8000/api/update-patientNepts/' + userID, data, config);
      if (res.status === 200) {
        setTimeout(() => {
          this.setState({
            showBackdrop: false,
          })
          // Reload page to update up coming bookings
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Handle Patient NEPTS Eligibility
  neptsEligibility(eligibility, userID) {
    if (eligibility) {
      this.updateNeptsEligibility(1, userID)
    } else {
      this.updateNeptsEligibility(2, userID)
    }
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Retrieve Context Data immediately after page loaded
    window.addEventListener('load', this.getPatientList);

    return (
      <div>
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
          open={this.state.showDialog}
          onClose={this.handleCloseDialog}
          PaperProps={{
            sx: {
              maxWidth: '500px',
              width: '500px',
              borderRadius: '10px'
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
              textAlign={'center'}
              fontSize={'18px'}
              fontWeight={'700'}
              width={'100%'}
            >
              Patient Details
            </Typography>

            <IconButton onClick={this.handleCloseDialog} sx={{ p: '0rem', alignItems: 'start', color: "#000" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider variant='fullWidth' sx={{ p: '5px' }} />

          {/* Patient Details */}
          <Grid
            container
            justifyContent={'space-between'}
            rowGap={'1.2rem'}
            alignItems={'center'}
            width={'100%'}
            p={'1.5rem 2rem 0rem 2.5rem'}
          >
            <Grid item lg={3} fontWeight={500}>NHS Number</Grid>
            <Grid item lg={0.3}>:</Grid>
            <Grid item lg={8.5}>{this.state.modifyPatientList.nhsNumber}</Grid>

            <Grid item lg={3} fontWeight={500}>Gender</Grid>
            <Grid item lg={0.3}>:</Grid>
            <Grid item lg={8.5}>{this.state.modifyPatientList.gender}</Grid>

            <Grid item lg={3} fontWeight={500}>Birth Date</Grid>
            <Grid item lg={0.3}>:</Grid>
            <Grid item lg={8.5}>{this.state.modifyPatientList.birthDate}</Grid>

            <Grid item lg={3} fontWeight={500}>Disability</Grid>
            <Grid item lg={0.3}>:</Grid>
            <Grid item lg={8.5}>{this.displayDisability(this.state.modifyPatientList.disability)}</Grid>

            <Grid item lg={3} fontWeight={500}>Current Cond.</Grid>
            <Grid item lg={0.3}>:</Grid>
            <Grid item lg={8.5}>{this.state.modifyPatientList.currentCondition}</Grid>

            <Grid item lg={3} fontWeight={500}>Contact</Grid>
            <Grid item lg={0.3}>:</Grid>
            <Grid item lg={8.5}>{this.state.modifyPatientList.contact}</Grid>
          </Grid>

          {/* Eligible / Not Eligible */}
          <Stack
            direction={'row'}
            gap={'3rem'}
            justifyContent={"center"}
            width={'100%'}
            mt={'2.5rem'}
            mb={'1.5rem'}
          >
            {/* Eligible */}
            <Button
              sx={{
                px: '1.5rem',
                py: '0.2rem',
                borderRadius: '20px',
                backgroundColor: '#AEFFA3',
                color: 'text.primary',
                textTransform: 'none',
                '&:hover': {
                  opacity: '70%',
                }
              }}
              onClick={() => this.neptsEligibility(true, this.state.modifyPatientList.user)}
            >
              Eligible
            </Button>

            {/* Not Eligible */}
            <Button
              sx={{
                px: '1.5rem',
                py: '0.2rem',
                borderRadius: '20px',
                backgroundColor: '#FF8273',
                color: 'text.primary',
                textTransform: 'none',
                '&:hover': {
                  opacity: '70%',
                }
              }}
              onClick={() => this.neptsEligibility(false, this.state.modifyPatientList.user)}
            >
              Not Eligible
            </Button>
          </Stack>

        </Dialog>

        {/* Page Header */}
        <ZoneHeader />

        {/* Page Body */}
        <Box
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: '200vh',
            maxWidth: '100vw',
          }}>
          <Container
            sx={{
              width: '100%',
              pt: '4rem',
              pb: '15rem'
            }}
          >
            {/* Title - Patient Application */}
            <Typography
              variant="h4"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              Patient Application
            </Typography>

            {/* Display No Patient NEPTS Application */}
            <Typography
              display={this.state.patientList.length == 0 ? 'flex' : 'none'}
              variant="h5" color={'gray'}
              mt={'5rem'}
            >
              No Patient Application for NEPTS for Now.
            </Typography>

            {/* Table - Patient Application List */}
            <TableContainer
              component={Paper}
              sx={{
                mt: '2rem',
                display: this.state.patientList.length == 0 ? 'none' : 'flex'
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="patient application table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No.</StyledTableCell>
                    <StyledTableCell>NHS Number</StyledTableCell>
                    <StyledTableCell>Gender</StyledTableCell>
                    <StyledTableCell align="center">Birth Date</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {this.state.patientList.map((patient, index) => (
                    <StyledTableRow
                      key={index + 1}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell style={{ width: 100 }} component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ width: 225 }}>{patient.nhsNumber}</TableCell>
                      <TableCell style={{ width: 100 }}>{patient.gender}</TableCell>
                      <TableCell style={{ width: 100 }} align="center">{patient.birthDate}</TableCell>
                      <TableCell style={{ width: 125 }} align="center" onClick={() => this.showModifyDialog(patient)}><Link component='button'>Details</Link></TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </Container>
        </Box>
      </div >
    );
  }
}