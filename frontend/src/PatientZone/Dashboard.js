import React, { Component } from "react";
import ZoneHeader from "../components/PatientZoneHeader";
import Typography from '@mui/material/Typography'
import { Box, Button, Container, Divider, Stack } from "@mui/material";
import styled from "@emotion/styled";
import ServiceIcon from '@mui/icons-material/MedicalInformation';
import AuthContext from "../components/AuthContext";

// Custom Button Component
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


export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  // Declare Context Type
  static contextType = AuthContext
  
  render() {
    // Access Context Data
    let userContext = this.context
    
    return (
      <div>
        {/* Patient Zone Header */}
        <ZoneHeader />

        {/* Patient Zone - Background Img */}
        <Box
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: '200vh',
            maxWidth: '100vw',
          }}>

          {/* Patient Zone - Dashboard Content */}
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
              {userContext.user.firstName}'s Patient Zone
            </Typography>

            {/* Services Provided */}
            <Stack
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

          </Container>
        </Box>
      </div>
    )
  }
}