import React, { Component } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Typography, Box, Link, Stack, Breadcrumbs } from "@mui/material";
import { styled } from "@mui/styles";
import Image from 'mui-image';
import NavIcon from '@mui/icons-material/NavigateNext';

// Custom Link Components
const NavLink = styled((props) => (
  <Link
    underline="none"
    color='white'
    fontSize={'13px'}
    fontWeight={'regular'}
    const {...props}
  />))
  (({ theme }) => ({
    '&:hover': {
      color: theme.palette.text.hover
    }
  }));

const BodyLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.text.hover
  }
}));

export default class Nepts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/* Page Header */}
        <Header />

        {/* Page Body */}
        <Container
          disableGutters={true}
          sx={{
            minHeight: '120vh',
            minWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: '0px',
            m: '0px',
          }}>

          {/* Page Image */}
          <Image
            height='300px'
            src="/static/images/img-4.png"
            shift='left'
            duration={1500}
          />

          {/* Current Page Title */}
          <Typography
            variant="h5"
            position='relative'
            fontWeight='bold'
            color='white'
            marginTop='-160px'
            marginLeft='70px'
          >
            Non-emergency Patient Transport Service
          </Typography>

          {/* Display current page navigaton */}
          <Breadcrumbs
            separator={<NavIcon fontSize="small" sx={{ color: 'white' }} />}
            aria-label="breadcrumb"
            sx={{
              position: 'relative',
              marginTop: '5px',
              marginLeft: '75px',
            }}
          >
            <NavLink href='/'>Home</NavLink>,
            <NavLink href='/our-services'>Our Services</NavLink>
            <NavLink >NEPTS</NavLink>
          </Breadcrumbs>

          {/* Body */}
          <Container
            sx={{
              width: '80%',
              mt: '150px',
              bgcolor: 'transparent',
            }}
          >
            <Stack spacing={6} direction={'column'}>
              {/* Content 1*/}
              <Box>
                {/* Title */}
                <Typography fontWeight='bold' variant="h5" color="text.secondary">
                  What is Non-emergency Patient Transport Service (NEPTS) ?
                </Typography>

                {/* Content */}
                <Container
                  sx={{
                    width: '95%',
                    mt: '22px',
                  }}
                >
                  <Stack spacing={5} direction={'column'}>
                    {/* Point 1 */}
                    <Box>
                      <Typography fontWeight='bold' variant="subtitle1" color="black">
                        It depends if it is emergency
                      </Typography>

                      {/* Detail */}
                      <Typography variant="subtitle1" color="black">
                        Non-emergency patient transport is an important service for those who cannot attend hospital, outpatient appointments, community clinics or get home after a hospital admission by any other means. NHS-funded transport does not cover journeys to GPs, dentists, pharmacies and opticians.
                      </Typography>
                    </Box>

                    {/* Point 2 */}
                    <Box>
                      <Typography fontWeight='bold' variant="subtitle1" color="black">
                        If you ever encounter Emergency Situation
                      </Typography>

                      {/* Detail */}
                      <Typography variant="subtitle1" color="black">
                        In a medical emergency, call 999 and ask for an ambulance. You will not have to pay to be taken to hospital in an emergency. A medical emergency is when someone is seriously ill or injured and their life is at risk. <br /><br />
                        <BodyLink target="_blank" rel="noopener" fontStyle={'italic'} href="https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/">Read about when to call 999.</BodyLink>
                      </Typography>
                    </Box>
                  </Stack>
                </Container>
              </Box>

              {/* Content 2*/}
              <Box>
                {/* Title */}
                <Typography fontWeight='bold' variant="h5" color="text.secondary">
                  Are you eligible for NEPTS ?
                </Typography>

                {/* Content */}
                <Container
                  sx={{
                    width: '95%',
                    mt: '22px',
                  }}
                >
                  <Typography variant="subtitle1" color="black">
                    Check here : <BodyLink underline="none" href="/nepts-eligibility">Who is Eligible for NEPTS</BodyLink>
                  </Typography>
                </Container>
              </Box>

              {/* Content 3*/}
              <Box>
                {/* Title */}
                <Typography fontWeight='bold' variant="h5" color="text.secondary">
                  How to Book ?
                </Typography>

                {/* Content */}
                <Container
                  sx={{
                    width: '95%',
                    mt: '22px',
                  }}
                >
                  <Typography variant="subtitle1" color="black">
                    Check Here : <BodyLink underline="none" href="/nepts-how-to-book">How to Book NEPTS</BodyLink>
                  </Typography>
                </Container>
              </Box>

            </Stack>
          </Container>
        </Container>

        {/* Page Footer */}
        <Footer />
      </div>
    )
  }
}