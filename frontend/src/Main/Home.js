import React, { Component } from "react";
import { Container, Typography, Box, Link, Stack, Grid, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "mui-image";
import styled from "@emotion/styled";
import ArrowIcon from '@mui/icons-material/Signpost';
import VanIcon from '@mui/icons-material/AirportShuttle';
import NurseIcon from '@mui/icons-material/WheelchairPickup';
import DriverIcon from '@mui/icons-material/Groups';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import AchieveIcon from '@mui/icons-material/Verified';
import ExpandIcon from '@mui/icons-material/KeyboardArrowRight';

// All Custom Typography
const SloganTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  height: '45%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
}));

const BlueTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'inline-block',
  fontWeight: 'bold'
}));

const BlackTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: 'inline-block',
  fontWeight: 'bold'
}));

const GreyBoldTypography = styled(Typography)(({ theme }) => ({
  color: '#616161',
  display: 'inline-block',
  fontWeight: 'bold'
}));

const GreyTypography = styled(Typography)(({ theme }) => ({
  color: '#616161',
  display: 'inline-block',
}));

// Custom Links
const NavLink = styled(Link)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.text.hover
  }
}));

const BodyLink = styled((props) => (
  <Link
    target="_blank"
    rel="noopener"
    const {...props}
  />))
  (({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.hover
    }
  }));

// Custom Button
const NavButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#D9EAFF',
  textAlign: 'center',
  fontWeight: 'bold',
  width: '100%',
  height: '40px',
  color: theme.palette.text.secondary,
  '&:hover': {
    opacity: '50%',
    backgroundColor: '#D9EAFF',
  }
}));

// Drop down lists properties
const FaqAccordian = styled((props) => (
  <Accordion
    square={true}
    const {...props}
  />))
  (({ theme }) => ({
    borderRadius: '10px',
    '&:before': {
      display: 'none',
    },
  }));

const FaqAccordianSum = styled((props) => (
  <AccordionSummary
    expandIcon={< ExpandIcon />}
    aria-controls="panel1a-content"
    const {...props}
  />))
  (({ theme }) => ({
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    }
  }));

// Custom Box for Credibility Area
const CredibilityBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  justifyContent: 'center',
  alignItems: 'center',
  width: '20%',
}));

export default class Home extends Component {
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
          disableGutters='true'
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
            height='350px'
            src="/static/images/img-0.jpg"
            shift='left'
            duration='1000'
          />

          {/* Slogan */}
          <Box
            bgcolor={'#d6f1ff'}
            width={'400px'}
            height={'130px'}
            mx={'auto'}
            marginTop={'-80px'}
            zIndex={'1'}
            sx={{
              borderRadius: '10px',
            }}
          >
            <SloganTypography variant="h5" fontWeight={'800'}>You Can Always Trust Us</SloganTypography>
            <SloganTypography variant="h6" fontWeight={'300'}>We are always here for you, you are not alone.</SloganTypography>
          </Box>
          <Box
            bgcolor={'#d6f1ff'}
            width={'50px'}
            height={'50px'}
            mx={'auto'}
            marginTop={'-32px'}
            zIndex={'0'}
            sx={{
              boxShadow: '2',
              rotate: '45deg'
            }}
          />

          {/* Content 1 - Our About Us Brief */}
          <Box
            bgcolor={'#F4FBFF'}
            width={'100%'}
            height={'auto'}
            mt={'30px'}
            p={'25px'}
            display={'flex'}
            justifyContent={'center'}
          >
            <Stack
              direction={'row'}
              alignItems={"center"}
              spacing={'0'}
              width={'80%'}
            >
              {/* Text */}
              <Box display={'flex'} width={'50%'} justifyContent={'left'}>
                <Box
                  width={'90%'}
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1.5rem'}
                >
                  {/* Title */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    sx={{
                      gap: "0.5rem"
                    }}
                  >
                    <BlackTypography variant="h5" >Our</BlackTypography>
                    <BlueTypography variant="h5">Mission,</BlueTypography>
                    <BlackTypography variant="h5">Our</BlackTypography>
                    <BlueTypography variant="h5">Vision</BlueTypography>
                  </Box>

                  {/* Detail */}
                  <Typography variant="subtitle1">
                    “To inspire hope and contribute to health and well-being by providing the best care to every patient through integrated clinical practice, education and research.”<br /><br />

                    “Our vision is to be the unmatched leader in improving quality and reducing the cost of health care for patients in the communities we serve.”
                  </Typography>

                  {/* Find Out More */}
                  <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'0.5rem'}>
                    <ArrowIcon sx={{ color: "text.secondary" }} />
                    <NavLink href="/about-us" variant="subtitle1" underline="none">Find Out More About Us</NavLink>
                  </Box>
                </Box>
              </Box>

              {/* Image */}
              <Box display={'flex'} width={'50%'} justifyContent={'center'}>
                <Image
                  height='90%'
                  width='auto'
                  src="/static/images/img-12.jpg"
                  shift='right'
                  duration='1000'
                  style={{ borderRadius: '5px' }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Content 2- NHS Strike October */}
          <Box
            width={'100%'}
            height={'auto'}
            py={'40px'}
            px={'25px'}
            display={'flex'}
            justifyContent={'center'}
          >
            <Box
              width={'80%'}
              display={'flex'}
              flexDirection={'column'}
              gap={'1.5rem'}
            >
              {/* Title */}
              <Box
                display={'flex'}
                flexDirection={'row'}
                sx={{
                  gap: "0.5rem"
                }}
              >
                <BlackTypography variant="h5" >NHS</BlackTypography>
                <BlueTypography variant="h5">Strikes</BlueTypography>
                <BlueTypography variant="h5">In October</BlueTypography>
              </Box>

              {/* Detail */}
              <Box width={'80%'}>
                <Typography variant="subtitle1">
                  Strikes are planned to take place in some parts of the NHS on 2 to 5 October 2023.<br /><br />

                  During the strikes, A&E departments and 111 are likely to be extremely busy with longer waiting times than normal. But it's important to get medical help if you need it.<br /><br />

                  For urgent help for people aged 5 or over use <BodyLink href="https://111.nhs.uk/">111 online</BodyLink>. Call 111 for children under 5. Call 999 if it's a life-threatening emergency.<br /><br />

                  The NHS will contact you if you have an appointment that needs to be changed. If you have not been contacted, attend your appointment as planned.<br /><br />

                  GP appointments and services are not affected.<br /><br />

                  <BodyLink href="https://www.england.nhs.uk/long-read/information-for-the-public-on-industrial-action/">Find out more about the NHS industrial action from NHS England</BodyLink><br /><br />
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Content 3 - Our Services Brief */}
          <Box
            bgcolor={'#F4FBFF'}
            width={'100%'}
            height={'auto'}
            py={'40px'}
            px={'25px'}
            display={'flex'}
            justifyContent={'center'}
          >
            <Box
              width={'80%'}
              display={'flex'}
              flexDirection={'column'}
              gap={'2rem'}
            >
              {/* Title */}
              <Box
                width={'100%'}
                display={'flex'}
                flexDirection={'column'}
                gap={'0.5rem'}
              >
                {/* Title */}
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  sx={{
                    gap: "0.5rem"
                  }}
                >
                  <BlackTypography variant="h5" >Explore our</BlackTypography>
                  <BlueTypography variant="h5">Services</BlueTypography>
                </Box>

                {/* Subtitle */}
                <Typography variant="subtitle1">Find the services you need and book appointments online.</Typography>
              </Box>

              {/* Nav Buttons */}
              <Box width={'80%'}>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6}>
                    <NavButton href="/nepts" variant="contained">Non-emergency Patient Transport</NavButton>
                  </Grid>
                  <Grid item xs={6}>
                    <NavButton onClick={() => alert('LDPT service coming up !')} variant="contained">Long Distance Patient Transport</NavButton>
                  </Grid>
                  <Grid item xs={6}>
                    <NavButton disabled variant="contained">Other Services 1</NavButton>
                  </Grid>
                  <Grid item xs={6}>
                    <NavButton disabled variant="contained">Other Services 2</NavButton>
                  </Grid>
                </Grid>
              </Box>

              {/* Find Out More */}
              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={'0.5rem'}>
                <ArrowIcon sx={{ color: "text.secondary" }} />
                <NavLink href="/our-services" variant="subtitle1" underline="none">Find Out More Services</NavLink>
              </Box>
            </Box>
          </Box>

          {/* Content 4 - Credibility */}
          <Box
            width={'100%'}
            height={'auto'}
            py={'40px'}
            px={'25px'}
            display={'flex'}
            justifyContent={'center'}
          >
            <Box
              width={'80%'}
              display={'flex'}
              flexDirection={'column'}
              gap={'1.5rem'}
            >
              <Box
                width={'100%'}
                display={'flex'}
                flexDirection={'column'}
                gap={'3rem'}
              >
                {/* Title */}
                <Box
                  width={'100%'}
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'0.5rem'}
                >
                  {/* Title */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    sx={{
                      gap: "0.5rem"
                    }}
                  >
                    <BlackTypography variant="h5" >Why you can</BlackTypography>
                    <BlueTypography variant="h5">Trust Us</BlueTypography>
                    <BlackTypography variant="h5" >?</BlackTypography>
                  </Box>

                  {/* Subtitle */}
                  <Typography variant="subtitle1">
                    We are a team that is committed to the highest standards of patient care by providing quality services and professional knowledges, ensuring the best experience of medical care for patients.
                  </Typography>
                </Box>

                {/* Icon Info */}
                <Stack
                  width={'100%'}
                  direction={'row'}
                  alignItems={"start"}
                  spacing={'space-between'}
                >
                  <CredibilityBox>
                    <VanIcon sx={{ fontSize: '50px', color: "text.secondary" }} />
                    <GreyBoldTypography variant="h6">28</GreyBoldTypography>
                    <GreyTypography variant="subtitle1">Vans</GreyTypography>
                  </CredibilityBox>

                  <CredibilityBox>
                    <NurseIcon sx={{ fontSize: '50px', color: "text.secondary" }} />
                    <GreyBoldTypography variant="h6">{"> "}30</GreyBoldTypography>
                    <GreyTypography variant="subtitle1">Nurses</GreyTypography>
                  </CredibilityBox>

                  <CredibilityBox>
                    <DriverIcon sx={{ fontSize: '50px', color: "text.secondary" }} />
                    <GreyBoldTypography variant="h6">{"> "}30</GreyBoldTypography>
                    <GreyTypography variant="subtitle1">Drivers</GreyTypography>
                  </CredibilityBox>

                  <CredibilityBox>
                    <TrophyIcon sx={{ fontSize: '50px', color: "text.secondary" }} />
                    <GreyBoldTypography variant="h6">9</GreyBoldTypography>
                    <GreyTypography variant="subtitle1">Top Service Award</GreyTypography>
                  </CredibilityBox>

                  <CredibilityBox>
                    <AchieveIcon sx={{ fontSize: '50px', color: "text.secondary" }} />
                    <GreyBoldTypography variant="h6">{"> "}12688</GreyBoldTypography>
                    <GreyTypography variant="subtitle1">Services Achieved</GreyTypography>
                  </CredibilityBox>

                </Stack>
              </Box>
            </Box>
          </Box>

          {/* Content 5 - FAQ */}
          <Box
            bgcolor={'#F4FBFF'}
            width={'100%'}
            height={'auto'}
            py={'40px'}
            px={'25px'}
            display={'flex'}
            justifyContent={'center'}
          >
            <Stack
              direction={'row'}
              alignItems={"center"}
              spacing={'0'}
              width={'80%'}
            >
              {/* Text */}
              <Box display={'flex'} width={'60%'} justifyContent={'left'}>
                <Box
                  width={'90%'}
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1.5rem'}
                >
                  {/* Title */}
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    sx={{
                      gap: "0.5rem"
                    }}
                  >
                    <BlackTypography variant="h5" >Frequently</BlackTypography>
                    <BlackTypography variant="h5" >Asked</BlackTypography>
                    <BlueTypography variant="h5">Questions</BlueTypography>
                  </Box>

                  {/* Details */}
                  <FaqAccordian>
                    <FaqAccordianSum>
                      <Typography fontWeight='bold'>How to be part of TPT ?</Typography>
                    </FaqAccordianSum>
                    <AccordionDetails>
                      <Typography>
                        Be energitic, and be passionate to make the world a better place.
                      </Typography>
                    </AccordionDetails>
                  </FaqAccordian>

                  <FaqAccordian>
                    <FaqAccordianSum>
                      <Typography fontWeight='bold'>How to Book NEPTS ?</Typography>
                    </FaqAccordianSum>
                    <AccordionDetails>
                      <Typography>
                        Go to our services and click NEPTS.
                      </Typography>
                    </AccordionDetails>
                  </FaqAccordian>

                  <FaqAccordian>
                    <FaqAccordianSum>
                      <Typography fontWeight='bold'>Is Long Distance Patient Transport Available ?</Typography>
                    </FaqAccordianSum>
                    <AccordionDetails>
                      <Typography>
                        No, its not available at the moment.
                      </Typography>
                    </AccordionDetails>
                  </FaqAccordian>

                </Box>
              </Box>

              {/* Image */}
              <Box display={'flex'} width={'40%'} justifyContent={'center'}>
                <Image
                  height='150px'
                  width='auto'
                  src="/static/images/img-13.png"
                  shift='right'
                  duration='1000'
                />
              </Box>
            </Stack>

          </Box>
        </Container>
        <Footer />
      </div>
    )
  }
}