import React, { Component } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Typography, Box, Link, Button, Stack, Breadcrumbs, Slide } from "@mui/material";
import { styled } from "@mui/styles";
import { Image } from 'mui-image'
import NavIcon from '@mui/icons-material/NavigateNext';
import DotIcon from '@mui/icons-material/Circle';

// Custom Link Components
const NavLink = styled((props) => (
  <Link
    underline={'none'}
    color={'white'}
    fontSize={'13px'}
    fontWeight={'regular'}
    borderRadius={15}
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
    fontStyle='normal'
    const {...props}
  />))
  (({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.hover
    }
  }));

// Custom Button Component
const NavButton = styled((props) => (
  <Button
    variant="contained"
    const {...props}
  />))
  (({ theme }) => ({
    textAlign: 'center',
    fontWeight: 'bold',
    width: 'fit-content%',
    height: 'auto',
    padding: '8px 20px',
    borderRadius: 10,
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: '#B0D4FF',
      opacity: '70%',
    }
  }));

// Custom Typogrphy Component
const TitleTypography = styled((props) => (
  <Typography
    fontWeight={'bold'}
    variant="h5"
    color={'text.secondary'}
    const {...props}
  />))
  (({ theme }) => ({
  }));

export default class Nepts_How2Book extends Component {
  constructor(props) {
    super(props);

    this.state = {
      BookOnline: true,
      BookCall: false,
    };

    this.handleBookOpt = this.handleBookOpt.bind(this);
  }

  // Handle user mouse click target
  handleBookOpt(ref) {
    if (ref === 'online') {
      if (this.state.BookOnline === false) {
        this.setState({
          BookOnline: true,
          BookCall: false,
        })
      }
    } else if (ref === 'call') {
      if (this.state.BookCall === false) {
        this.setState({
          BookOnline: false,
          BookCall: true,
        })
      }
    }
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
            How to Book NEPTS
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
            <NavLink >How to Book</NavLink>
          </Breadcrumbs>

          {/* Page Content */}
          <Box
            width='68%'
            height='auto'
            direction='column'
            mx='auto'
            mt='90px'
          >

            {/* Change View Button */}
            <Stack
              spacing={'3.5rem'}
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              textAlign={'center'}
              mt={'50px'}
            >
              {/* Book Online */}
              <NavButton
                onClick={() => this.handleBookOpt('online')}
                sx={{
                  bgcolor: this.state.BookOnline ? '#B0D4FF' : '#D9EAFF'
                }}
              >
                Book Online
              </NavButton>

              <Typography variant="h6">/</Typography>

              {/* Call to Book */}
              <NavButton
                onClick={() => this.handleBookOpt('call')}
                sx={{
                  bgcolor: this.state.BookCall ? '#B0D4FF' : '#D9EAFF'
                }}
              >
                Call Us to Book
              </NavButton>
            </Stack>

            {/* Book Online */}
            <Slide direction="right" in={this.state.BookOnline} timeout={600}>
              <Stack
                spacing={'3.5rem'}
                direction={'column'}
                justifyContent={'left'}
                textAlign={'left'}
                mt={'85px'}
                display={this.state.BookOnline ? 'flex' : 'none'}
              >
                {/* Step 1 */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                  width={'100%'}
                >
                  {/* Title */}
                  <TitleTypography>
                    Step 1 :
                  </TitleTypography>

                  {/* Content */}
                  <Stack
                    mx={'auto'}
                    spacing={'1rem'}
                    width={'92%'}
                    direction={'column'}
                    justifyContent={'center'}
                  >
                    <Stack
                      spacing={'1rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        Create an account in our <BodyLink href="#patient-zone">Patient Zone</BodyLink>
                      </Typography>
                    </Stack>

                    <Stack
                      spacing={'1.5rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        Fill In all required field / Submit a letter from doctor (this step is important as we will check if you are eligible for NEPTS based on the details you submit.
                      </Typography>
                    </Stack>

                  </Stack>
                </Box>

                {/* Step 2 */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                >
                  {/* Title */}
                  <TitleTypography>
                    Step 2 :
                  </TitleTypography>

                  {/* Content */}
                  <Stack
                    mx={'auto'}
                    spacing={'1rem'}
                    width={'92%'}
                    direction={'column'}
                  >
                    <Stack
                      spacing={'1rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        Wait at most two (2) working days and we will reply to you and let you know if you are eligible for NEPTS.
                      </Typography>
                    </Stack>
                  </Stack>

                </Box>

                {/* Step 3 */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                >
                  {/* Title */}
                  <TitleTypography>
                    Step 3 :
                  </TitleTypography>

                  {/* Content */}
                  <Stack
                    mx={'auto'}
                    spacing={'1rem'}
                    width={'92%'}
                    direction={'column'}
                  >
                    <Stack
                      spacing={'1rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        Finally, Log In to <BodyLink href="#patient-zone">Patient Zone</BodyLink> and book now on our website !
                      </Typography>
                    </Stack>
                  </Stack>

                </Box>

                {/* Bonus */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                >
                  {/* Title */}
                  <TitleTypography>
                    Bonus :
                  </TitleTypography>

                  {/* Content */}
                  <Stack
                    mx={'auto'}
                    spacing={'1rem'}
                    width={'92%'}
                    direction={'column'}
                  >
                    <Stack
                      spacing={'1rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        If you ever need to book the NEPTS again in the future, just log in to your account and book on our website. Its the modern way, Its easier than ever.
                      </Typography>
                    </Stack>
                  </Stack>

                </Box>
              </Stack>
            </Slide>

            {/* Call to Book */}
            <Slide direction="left" in={this.state.BookCall} timeout={600}>
              <Stack
                spacing={'3.5rem'}
                direction={'column'}
                justifyContent={'left'}
                textAlign={'left'}
                mt={'85px'}
                display={this.state.BookCall ? 'flex' : 'none'}
              >
                {/* Dial Our Call Centre */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                  width={'100%'}
                >
                  {/* Title */}
                  <TitleTypography>
                    Dial our Call Centre
                  </TitleTypography>

                  {/* Content */}
                  <Stack
                    mx={'auto'}
                    spacing={'1rem'}
                    width={'92%'}
                    direction={'column'}
                    justifyContent={'center'}
                  >
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

                    <Stack
                      spacing={'1.5rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        9.00 AM - 4.00 PM (Monday to Saturday)
                      </Typography>
                    </Stack>

                    <Stack
                      spacing={'1.5rem'}
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

                {/* Important Notes */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                  width={'100%'}
                >
                  {/* Title */}
                  <TitleTypography>
                    Important Notes
                  </TitleTypography>

                  {/* Content */}
                  <Stack
                    mx={'auto'}
                    spacing={'1rem'}
                    width={'92%'}
                    direction={'column'}
                    justifyContent={'center'}
                  >
                    <Stack
                      spacing={'1rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        Please be expected to provide your information during the call. (eg. NHS Number, Date of Birth ..)
                      </Typography>
                    </Stack>

                    <Stack
                      spacing={'1.5rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        It is important for us to acquire your information on your first booking with us, to check if you are eligible for the service, please be PATIENT.
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {/* Not your first booking ? */}
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'1rem'}
                  width={'100%'}
                >
                  {/* Title */}
                  <TitleTypography>
                    Not your first booking NEPTS with us ?
                  </TitleTypography>

                  {/* Content */}
                  <Stack
                    mx={'auto'}
                    spacing={'1rem'}
                    width={'92%'}
                    direction={'column'}
                    justifyContent={'center'}
                  >
                    <Stack
                      spacing={'1rem'}
                      width={'100%'}
                      direction={'row'}
                      alignItems={'center'}
                    >
                      <DotIcon sx={{ fontSize: '8px' }} />

                      <Typography variant="subtitle1">
                        Great !  Now you don’t have to go through the dully “answering process” again. Just give us your NHS Number and Date of Birth, and begin to book !
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Slide>

          </Box>
        </Container>

        {/* Page Footer */}
        <Footer />
      </div>
    )
  }
}