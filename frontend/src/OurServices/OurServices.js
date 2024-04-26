import React, { Component } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Typography, Box, Link, Card, Button, Stack, Breadcrumbs, Fade } from "@mui/material";
import { styled } from "@mui/styles";
import { Image } from 'mui-image'
import NavIcon from '@mui/icons-material/NavigateNext';

// Custom Link Components
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

// Custom Typography Comopnent
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

export default class OurServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ImgHover: false,
      HoverRef: '',
    };

    this.handleImgHover = this.handleImgHover.bind(this);
  }

  // Handle mouse hover into image, display button
  handleImgHover(imgRef) {
    this.setState({
      ImgHover: !(this.state.ImgHover),
      HoverRef: imgRef,
    })
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
            Our Services
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
            <NavLink >Our Services</NavLink>
          </Breadcrumbs>

          {/* Page Title */}
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'center'}
          >
            <Box
              mt='130px'
              width={'70%'}
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
                <BlackTypography variant="h5" >Our</BlackTypography>
                <BlueTypography variant="h5">Services</BlueTypography>
                <BlackTypography variant="h5">Our</BlackTypography>
                <BlueTypography variant="h5">Goal</BlueTypography>
              </Box>

              {/* Detail */}
              <Typography variant="subtitle1">
                We are committed to serving our patients with compassion and high quality care, offering a comprehensive range of medical services, which include world-class facilities and advanced medical technologies.
              </Typography>
            </Box>
          </Box>

          {/* Page Content */}
          <Stack
            mt='90px'
            width='68%'
            height='auto'
            direction='column'
            spacing='4rem'
            mx='auto'
          >
            {/* NEPTS */}
            <Card
              variant='elevation'
              elevation={3}
              sx={{
                bgcolor: '#edf8ff',
                borderRadius: '10px',
                display: 'flex',
                height: '250px'
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
                  <Typography fontWeight='bold' variant="h6">
                    Non-emergency Patient Transport Service (NEPTS)
                  </Typography>

                  <Typography variant="subtitle1">
                    Get more info on our NEPTS where we provide the top most services.
                  </Typography>
                </Box>
              </Box>

              {/* Image Button */}
              <Button
                sx={{
                  width: '50%',
                  display: 'block',
                  p: '0'
                }}
                href='/nepts'
                onMouseEnter={() => this.handleImgHover('nepts')}
                onMouseLeave={() => this.handleImgHover('')}
              >
                <Image
                  src="/static/images/img-7.jpeg"
                  width={'100%'}
                  shift='right'
                  duration={1000}
                  style={{
                    opacity: this.state.ImgHover && this.state.HoverRef === 'nepts' ? '30%' : '100%'
                  }}
                />
                <Fade
                  in={this.state.ImgHover && this.state.HoverRef === 'nepts'}
                  timeout={1100}
                >
                  <Box
                    position={'relative'}
                    mt={-18}
                    mx={'auto'}
                    width={'fit-content'}
                    px={1}
                    py={0.5}
                    borderRadius={1}
                    bgcolor={'white'}
                    display={this.state.ImgHover && this.state.HoverRef === 'nepts' ? 'block' : 'none'}
                  >
                    <Box sx={{ opacity: '75%' }}>
                      <Typography variant="subtitle2" fontWeight={'bold'}>
                        Find Out More
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              </Button>

            </Card>

            {/* LDPTS */}
            <Card
              variant='elevation'
              elevation={3}
              sx={{
                bgcolor: '#F7FCFF',
                borderRadius: '10px',
                display: 'flex',
                height: '250px'
              }}
            >

              {/* Image Button */}
              <Button
                sx={{
                  width: '50%',
                  display: 'block',
                  p: '0'
                }}
                href='#ldpts'
                onMouseEnter={() => this.handleImgHover('ldpts')}
                onMouseLeave={() => this.handleImgHover('')}
              >
                <Image
                  src="/static/images/img-15.jpg"
                  width={'100%'}
                  shift='left'
                  duration={1000}
                  style={{
                    opacity: this.state.ImgHover && this.state.HoverRef === 'ldpts' ? '30%' : '100%'
                  }}
                />
                <Fade
                  in={this.state.ImgHover && this.state.HoverRef === 'ldpts'}
                  timeout={1100}
                >
                  <Box
                    position={'relative'}
                    mt={-18}
                    mx={'auto'}
                    width={'fit-content'}
                    px={1}
                    py={0.5}
                    borderRadius={1}
                    bgcolor={'white'}
                    display={this.state.ImgHover && this.state.HoverRef === 'ldpts' ? 'block' : 'none'}
                  >
                    <Box sx={{ opacity: '75%' }}>
                      <Typography variant="subtitle2" fontWeight={'bold'}>
                        Find Out More
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              </Button>

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
                  <Typography fontWeight='bold' variant="h6">
                    Long Distance Patient Transport Service (LDPTS)
                  </Typography>

                  <Typography variant="subtitle1">
                    Get more info on our LDPTS where we provide the top most services.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Stack>

        </Container>

        {/* Page Footer */}
        <Footer />
      </div>
    )
  }
}