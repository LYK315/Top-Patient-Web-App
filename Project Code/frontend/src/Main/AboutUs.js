import React, { Component } from "react";
import { Container, Typography, Box, Link, Card, Stack, Breadcrumbs } from "@mui/material";
import { styled } from "@mui/styles";
import { Image } from 'mui-image'
import NavIcon from '@mui/icons-material/NavigateNext';
import Header from "../components/Header";
import Footer from "../components/Footer";

// Custom Link Component
const NavLink = styled((props) => (
  <Link
    underline="none"
    color='white'
    fontSize={'13px'}
    fontWeight={'regular'}
    const {...props}
  />))
  (({ theme }) => ({
    textShadow: '0px 0px 10px black',
    '&:hover': {
      color: theme.palette.text.hover
    }
  }));

// Custom Typogrphy Component
const BlueTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'inline-block',
  fontWeight: 'bold'
}));

// Custom Typogrphy Component
const BlackTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: 'inline-block',
  fontWeight: 'bold'
}));

export default class AboutUs extends Component {
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
            src="/static/images/img-12.jpg"
            shift='left'
            duration={1500}
          />

          {/* Current Page Title */}
          <Typography
            variant="h4"
            position='relative'
            fontWeight='bold'
            color='white'
            marginTop='-160px'
            marginLeft='70px'
            style={{
              textShadow: '0px 0px 10px black'
            }}
          >
            About Us
          </Typography>

          {/* Display current page breadcrumb */}
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
            <NavLink >About Us</NavLink>
          </Breadcrumbs>

          {/* Page Title */}
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'center'}
          >
            <Box
              mt='155px'
              width={'50%'}
              display={'flex'}
              flexDirection={'column'}
              gap={'1.5rem'}
              justifyContent={'center'}
              alignItems={'center'}
              textAlign={'center'}
            >
              {/* Title */}
              <Box
                display={'flex'}
                flexDirection={'row'}
                sx={{
                  gap: "0.5rem"
                }}
              >
                <BlackTypography variant="h5" >"We want to </BlackTypography>
                <BlueTypography variant="h5">Make A Difference</BlueTypography>
                <BlackTypography variant="h5" >"</BlackTypography>
              </Box>

              {/* Detail */}
              <Typography variant="subtitle1">
                “To inspire hope and contribute to health and well-being by providing the best care to every patient through integrated clinical practice, education and research.” <br /><br />

                “Our vision is to be the unmatched leader in improving quality and reducing the cost of health care for patients in the communities we serve.”
              </Typography>
            </Box>
          </Box>

          {/* Page Content */}
          <Stack
            mt='80px'
            width='100%'
            height='870px'
            direction='column'
            spacing='0'
            mx='auto'
          >
            {/* Our Mission */}
            <Card
              variant="none"
              sx={{
                bgcolor: '#F4FBFF',
                display: 'flex',
                height: '50%'
              }}
            >
              {/* Details */}
              <Box display={'flex'} width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  width={'80%'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  textAlign={'center'}
                  gap={'2rem'}
                >
                  {/* Title */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    sx={{
                      gap: "0.5rem"
                    }}
                  >
                    <BlackTypography variant="h3" >OUR</BlackTypography>
                    <BlueTypography variant="h3">MISSION</BlueTypography>
                  </Box>

                  {/* Info */}
                  <Typography variant="h6" fontWeight={'normal'}>
                    "Service with a SMILE"
                  </Typography>

                  <Typography variant="subtitle1" fontWeight={'normal'} width={'80%'} textAlign={'left'}>
                    S  -  Satisfactory return to stakeholders<br />
                    M  -  Modern, comprehensive and safe facility and environment<br />
                    I  -  Inspired, engaged and driven teams<br />
                    L  -  Leading-edge clinical practices and technologies<br />
                    E  -  Exceed customers’ expectations<br />
                  </Typography>
                </Box>
              </Box>

              {/* Image */}
              <Box
                sx={{
                  width: '50%',
                  display: 'block',
                  p: '0'
                }}
              >
                <Image
                  src="/static/images/img-14.jpg"
                  width={'100%'}
                  shift='left'
                  duration={1000}
                />
              </Box>
            </Card>

            {/* Our Goal */}
            <Card
              variant="none"
              sx={{
                bgcolor: '#F4FBFF',
                display: 'flex',
                height: '50%'
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  width: '50%',
                  display: 'block',
                  p: '0'
                }}
              >
                <Image
                  src="/static/images/img-10.jpg"
                  width={'100%'}
                  shift='right'
                  duration={1000}
                />
              </Box>

              {/* Details */}
              <Box display={'flex'} width={'50%'} justifyContent={'center'} alignItems={'center'}>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  width={'80%'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  textAlign={'center'}
                  gap={'2rem'}
                >
                  {/* Title */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    sx={{
                      gap: "0.5rem"
                    }}
                  >
                    <BlackTypography variant="h3" >OUR</BlackTypography>
                    <BlueTypography variant="h3">GOAL</BlueTypography>
                  </Box>

                  {/* Info */}
                  <Typography variant="h6" fontWeight={'normal'}>
                    To be one of the leading private medical Transport centres in the EUROPE
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Stack>

          {/* Our Values */}
          <Box
            mt={'60px'}
            display={'flex'}
            flexDirection={'column'}
            gap={'2rem'}
            width={'100%'}
            height={'auto'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            {/* Title */}
            <Box
              display={'flex'}
              flexDirection={'row'}
              width={'auto'}
              sx={{
                gap: "0.5rem"
              }}
            >
              <BlackTypography variant="h3" >Our</BlackTypography>
              <BlueTypography variant="h3">Values</BlueTypography>
            </Box>

            {/* Details */}
            <Stack
              width={'100%'}
              spacing={'1.5rem'}
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              {/* Compassion */}
              <Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                >
                  <Typography variant="subtitle1" fontWeight={'bold'} color={'text.secondary'}>C</Typography>
                  <Typography variant="subtitle1">ompassion</Typography>
                </Box>
                <Typography variant="subtitle1">We are always sensitive to our patients’ needs</Typography>
              </Box>

              {/* Respect */}
              <Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                >
                  <Typography variant="subtitle1" fontWeight={'bold'} color={'text.secondary'}>R</Typography>
                  <Typography variant="subtitle1">espect</Typography>
                </Box>
                <Typography variant="subtitle1">We believe in being humble, polite and respectful</Typography>
              </Box>

              {/* Humility */}
              <Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                >
                  <Typography variant="subtitle1" fontWeight={'bold'} color={'text.secondary'}>H</Typography>
                  <Typography variant="subtitle1">umility</Typography>
                </Box>
                <Typography variant="subtitle1">We strive for excellence and take pride in all that we do</Typography>
              </Box>

              {/* Excellence */}
              <Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                >
                  <Typography variant="subtitle1" fontWeight={'bold'} color={'text.secondary'}>E</Typography>
                  <Typography variant="subtitle1">xcellence</Typography>
                </Box>
                <Typography variant="subtitle1">We respect every individual and are always professional in our conduct and behaviour</Typography>
              </Box>

              {/* Integrity */}
              <Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                >
                  <Typography variant="subtitle1" fontWeight={'bold'} color={'text.secondary'}>I</Typography>
                  <Typography variant="subtitle1">ntegrity</Typography>
                </Box>
                <Typography variant="subtitle1">We believe in doing the right thing at all times</Typography>
              </Box>
            </Stack>
          </Box>
        </Container >
        <Footer />
      </div>
    )
  }
}