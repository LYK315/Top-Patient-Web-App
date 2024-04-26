import React, { Component } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Typography, Box, Link, Stack, Breadcrumbs } from "@mui/material";
import { styled } from "@mui/styles";
import { Image } from 'mui-image'
import NavIcon from '@mui/icons-material/NavigateNext';
import DotIcon from '@mui/icons-material/Circle';

// Custom Links Components
const NavLink = styled((props) => (
  <Link
    underline={'none'}
    color={'white'}
    fontSize={'13px'}
    fontWeight={'regular'}
    const {...props}
  />))
  (({ theme }) => ({
    '&:hover': {
      color: theme.palette.text.hover
    }
  }));

const BodyLink = styled((props) => (
  <Link
    target="_blank"
    rel="noopener"
    fontStyle='italic'
    const {...props}
  />))
  (({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.hover
    }
  }));

// Custom Typography Components
const TitleTypography = styled((props) => (
  <Typography
    fontWeight={'bold'}
    variant="h5"
    color={'text.secondary'}
    const {...props}
  />))
  (({ theme }) => ({
  }));

const SubtitleTypography = styled((props) => (
  <Typography
    fontWeight={'bold'}
    variant="subtitle1"
    color={'black'}
    const {...props}
  />))
  (({ theme }) => ({
  }));

export default class Nepts_Eligibility extends Component {
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
            duration={1000}
          />

          {/* Current Page Title */}
          <Typography
            variant="h4"
            position='relative'
            fontWeight='bold'
            color='white'
            marginTop='-160px'
            marginLeft='70px'
          >
            Who is Eligible for NEPTS
          </Typography>

          {/* Display current page navigaton */}
          <Breadcrumbs
            separator={<NavIcon fontSize="small" sx={{ color: 'white' }} />}
            sx={{
              position: 'relative',
              marginTop: '5px',
              marginLeft: '75px',
            }}
          >
            <NavLink href='/'>Home</NavLink>,
            <NavLink href='/our-services'>Our Services</NavLink>
            <NavLink href='/nepts'>NEPTS</NavLink>
            <NavLink >Eligibility</NavLink>
          </Breadcrumbs>

          {/* Page Content */}
          <Box
            width='68%'
            height='auto'
            direction='column'
            mx='auto'
            mt='150px'
            display={'flex'}
            flexDirection={'column'}
            gap={'5rem'}
          >
            {/* Content 1 */}
            <Box display={'flex'} flexDirection={'column'} gap={'2rem'} alignItems={'center'}>

              {/* Title */}
              <Box width={'100%'} textAlign={'left'}>
                <TitleTypography>
                  Are you eligible for Non-emergency Patient Transport (NEPTS) ?
                </TitleTypography>
              </Box>

              {/* Point 1 */}
              <Box display={'flex'} flexDirection={'column'} width={'95%'} gap={'1rem'}>
                {/* Subtitle */}
                <SubtitleTypography>
                  You are considered eligible if :
                </SubtitleTypography>

                {/* Content */}
                <Stack
                  mx={'auto'}
                  spacing={'1rem'}
                  width={'92%'}
                  direction={'column'}
                  justifyContent={'center'}
                >
                  {/* Sub Point 1 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      Your medical condition is such that you require the skills and support of NEPTS staff during or after your journey, and/or it would be detrimental to your condition or recovery to travel by other means. Or:
                    </Typography>
                  </Stack>

                  {/* Sub Point 2 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      Your medical condition affects your mobility to such an extent that you would be unable to access healthcare and/or it would be detrimental to your condition or recovery to travel by other means.
                    </Typography>
                  </Stack>

                  {/* Sub Point 3 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      You may also travel if you are the recognised parent or guardian of a child being transported by NEPTS.
                    </Typography>
                  </Stack>

                </Stack>
              </Box>

              {/* Point 2 */}
              <Box display={'flex'} flexDirection={'column'} width={'95%'} gap={'1rem'}>
                {/* Subtitle */}
                <SubtitleTypography>
                  You are not eligible if :
                </SubtitleTypography>

                {/* Content */}
                <Stack
                  mx={'auto'}
                  spacing={'1rem'}
                  width={'92%'}
                  direction={'column'}
                  justifyContent={'center'}
                >
                  {/* Sub Point 1 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      You are attending a primary care service, such as a routine GP or health centre appointment.
                    </Typography>
                  </Stack>

                  {/* Sub Point 2 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      You are not an NHS patient.
                    </Typography>
                  </Stack>

                  {/* Sub Point 3 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      You require transport outside England, Scotland and Wales The person booking your NEPTS.
                    </Typography>
                  </Stack>

                  {/* Point 4 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                    mt={'10px'}
                  >
                    <Typography variant="subtitle1">
                      For more info, please check : <BodyLink href="https://www.england.nhs.uk/urgent-emergency-care/improving-ambulance-services/nepts-review/">NHS England</BodyLink>
                    </Typography>
                  </Stack>

                </Stack>
              </Box>

            </Box>

            {/* Content 2 */}
            <Box display={'flex'} flexDirection={'column'} gap={'2rem'} alignItems={'center'}>

              {/* Title */}
              <Box width={'100%'} textAlign={'left'}>
                <TitleTypography>
                  What to do if I am not eligible for NEPTS ?
                </TitleTypography>
              </Box>

              {/* Point 1 */}
              <Box display={'flex'} flexDirection={'column'} width={'95%'} gap={'0.5rem'} alignItems={'center'}>
                {/* Subtitle */}
                <Stack
                  spacing={'1rem'}
                  width={'100%'}
                  direction={'row'}
                  alignItems={'center'}
                >
                  <DotIcon sx={{ fontSize: '8px' }} />

                  <SubtitleTypography>
                    Use the Public Transport
                  </SubtitleTypography>
                </Stack>

                {/* Content */}
                <Box width={'95%'}>
                  <Typography variant="subtitle1">
                    Check and travel with Public Transport to the nearest stop to your GP.
                  </Typography>
                </Box>
              </Box>

              {/* Point 2 */}
              <Box display={'flex'} flexDirection={'column'} width={'95%'} gap={'0.5rem'} alignItems={'center'}>
                {/* Subtitle */}
                <Stack
                  spacing={'1rem'}
                  width={'100%'}
                  direction={'row'}
                  alignItems={'center'}
                >
                  <DotIcon sx={{ fontSize: '8px' }} />

                  <SubtitleTypography>
                    Claim for your Hospital Transport Costs
                  </SubtitleTypography>
                </Stack>

                {/* Content */}
                <Box width={'95%'}>
                  <Typography variant="subtitle1">
                    You may be able to claim for the cost of transport to hospital through the Healthcare Travel Costs Scheme (HTCS) if you're referred for specialist NHS treatment or tests. <br /><br />

                    Read more about the <BodyLink href="https://www.nhs.uk/nhs-services/help-with-health-costs/healthcare-travel-costs-scheme-htcs/">Healthcare Travel Costs Scheme (HTCS)</BodyLink>, including who's eligible, what the conditions are and how to make a claim.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Content 3 */}
            <Box display={'flex'} flexDirection={'column'} gap={'2rem'} alignItems={'center'}>

              {/* Title */}
              <Box width={'100%'} textAlign={'left'}>
                <TitleTypography>
                  Still NOT sure if you are eligible ?
                </TitleTypography>
              </Box>

              {/* Point 1 */}
              <Box display={'flex'} flexDirection={'column'} width={'95%'} gap={'1rem'}>
                {/* Subtitle */}
                <SubtitleTypography>
                  Give us a call and we will help you out !
                </SubtitleTypography>

                {/* Content */}
                <Stack
                  mx={'auto'}
                  spacing={'1rem'}
                  width={'92%'}
                  direction={'column'}
                  justifyContent={'center'}
                >
                  {/* Sub Point 1 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      +44 123456789
                    </Typography>
                  </Stack>

                  {/* Sub Point 2 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      9.00 AM - 4.00 PM (Monday to Saturday)
                    </Typography>
                  </Stack>

                  {/* Sub Point 3 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      9.00 AM - 1.00 PM (Sunday)
                    </Typography>
                  </Stack>

                </Stack>
              </Box>

              {/* Point 2 */}
              <Box display={'flex'} flexDirection={'column'} width={'90%'} gap={'1rem'}>
                {/* Subtitle */}
                <SubtitleTypography>
                  Create an account with us and we will reply to you within 2 working days.
                </SubtitleTypography>

                {/* Content */}
                <Stack
                  mx={'auto'}
                  spacing={'1rem'}
                  width={'92%'}
                  direction={'column'}
                  justifyContent={'center'}
                >
                  {/* Sub Point 1 */}
                  <Stack
                    spacing={'1rem'}
                    width={'100%'}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <DotIcon sx={{ fontSize: '8px' }} />

                    <Typography variant="subtitle1">
                      Create account in our <BodyLink href="#patient-zone" fontStyle="normal">Patient Zone</BodyLink>
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Box>

        </Container>
        <Footer />
      </div>
    )
  }
}