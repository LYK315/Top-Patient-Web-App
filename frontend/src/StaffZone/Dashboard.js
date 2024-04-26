import React, { Component } from "react";
import ZoneHeader from "../components/StaffZoneHeader";
import Typography from '@mui/material/Typography'
import { Box, Button, Container, Divider, Slide, Stack } from "@mui/material";
import styled from "@emotion/styled";
import ServiceIcon from '@mui/icons-material/MedicalInformation';
import SelectionIcon from '@mui/icons-material/RoomPreferences';
import AuthContext from "../components/AuthContext";

// Custom Button Components
const NavButton = styled(Button)(({ theme }) => ({
  paddingTop: '2rem',
  paddingBottom: '2rem',
  width: '100%',
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    opacity: '20%',
    color: 'white',
    backgroundColor: theme.palette.text.secondary
  }
}));

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

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      isAdmin: true,
      pageClicked: 'services',
    })

    this.handlePageBtnClick = this.handlePageBtnClick.bind(this);
  }

  // Handle mouse click target
  handlePageBtnClick(btnID) {
    if (btnID == 'services') {
      this.setState({ pageClicked: 'services' })
    } else {
      this.setState({ pageClicked: 'others' })
    }
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Access Context Data
    let userContext = this.context

    return (
      <div>
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
              width: '90%',
              pt: '4rem',
              pb: '15rem'
            }}
          >
            {/* Title */}
            <Typography
              variant="h4"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              Welcome Back, {userContext.user.firstName}
            </Typography>

            {/* Manage Service / Others Btn */}
            <Stack
              direction={'row'}
              spacing={'2rem'}
              justifyContent={'center'}
              mx={'auto'}
              mt={'3rem'}
              display={this.state.isAdmin ? 'flex' : 'none'}
            >
              {/* All Services Button */}
              <PageButton onClick={() => this.handlePageBtnClick('services')}
                sx={{ bgcolor: this.state.pageClicked === 'services' ? '#BAD9FF' : '#D9EAFF' }}>
                All Services
              </PageButton>

              <Typography variant="h4">/</Typography>

              {/* Other Button */}
              <PageButton onClick={() => this.handlePageBtnClick('others')}
                sx={{ bgcolor: this.state.pageClicked === 'others' ? '#BAD9FF' : '#D9EAFF' }}>
                Other
              </PageButton>

            </Stack>

            {/* All Services */}
            <Slide
              direction={"right"}
              in={this.state.pageClicked === 'services'}
              timeout={500}
            >
              <Stack
                display={this.state.pageClicked == 'services' ? 'flex' : 'none'}
                mx={'auto'}
                width={'85%'}
                pt={'60px'}
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                borderBottom={'solid'}
                sx={{
                  borderWidth: '2.2px',
                  borderColor: 'text.secondary'
                }}
                divider={<Divider orientation='horizontal' variant="fullWidth" flexItem sx={{ borderWidth: '1px', borderColor: 'text.secondary' }} />}
              >

                <Box display={'flex'} flexDirection={'row'} gap={'1rem'} alignItems={'center'} mb='2rem'>
                  <ServiceIcon sx={{ fontSize: '35px' }} />
                  <Typography variant="h4" color="text.primary" fontWeight={'bold'}>Select A Service</Typography>
                </Box>

                <NavButton href="nepts">
                  <Typography variant="h5" >Non-emergency Patient Transport Service (NEPTS)</Typography>
                </NavButton>

                <NavButton disabled>
                  <Typography variant="h5">Long Distance Patient Transport Service (LDPTS)</Typography>
                </NavButton>

                <NavButton disabled>
                  <Typography variant="h5">Other Services 1</Typography>
                </NavButton>
              </Stack>
            </Slide>

            {/* Others */}
            <Slide
              direction={'left'}
              in={this.state.pageClicked === 'others'}
              timeout={500}
            >
              <Stack
                display={this.state.pageClicked == 'others' ? 'flex' : 'none'}
                mx={'auto'}
                width={'85%'}
                pt={'60px'}
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                borderBottom={'solid'}
                sx={{
                  borderWidth: '2.2px',
                  borderColor: 'text.secondary'
                }}
                divider={<Divider orientation='horizontal' variant="fullWidth" flexItem sx={{ borderWidth: '1px', borderColor: 'text.secondary' }} />}
              >

                <Box display={'flex'} flexDirection={'row'} gap={'1rem'} alignItems={'center'} mb='2rem'>
                  <SelectionIcon sx={{ fontSize: '35px' }} />
                  <Typography variant="h4" color="text.primary" fontWeight={'bold'}>Select A Section</Typography>
                </Box>

                {/* Get Routing Schedule Button */}
                <NavButton href='routing-schedule'>
                  <Typography variant="h5">Get Routing Schedule</Typography>
                </NavButton>

                {/* Manage Staff Button */}
                <NavButton href="manage-staff">
                  <Typography variant="h5" >Manage Staff</Typography>
                </NavButton>

                {/* Patient Application Button */}
                <NavButton href='patient-application'>
                  <Typography variant="h5">Patient Application</Typography>
                </NavButton>
              </Stack>
            </Slide>

          </Container>
        </Box>
      </div>
    )
  }
}