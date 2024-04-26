import React, { Component, useCallback } from "react";
import { Typography, Grid, Paper, Stack, Divider, Link, useScrollTrigger, AppBar, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Drawer, Box, Zoom, Fab, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/styles";
import HomeIcon from '@mui/icons-material/CottageRounded';
import PhoneIcon from '@mui/icons-material/PhoneAndroidRounded';
import AlertIcon from '@mui/icons-material/CrisisAlertRounded';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import MenuIcon from '@mui/icons-material/MenuRounded';
import ScrollUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import StaffIcon from '@mui/icons-material/AdminPanelSettings';
import PatientIcon from '@mui/icons-material/Accessible';
import AuthContext from "../components/AuthContext";

// Custom Link component for app bar
const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    color: theme.palette.text.hover
  }
}));

// Custom Menu Item
const StyledMenuItem = styled((props) => (
  <MenuItem
    component={Link}
    target="_blank"
    const {...props}
  />))
  (({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.hover,
    }
  }));

// App Bar Elevation Effect on Scroll
function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

// Scroll to top button
function ScrollToTopFab() {
  const trigger = useScrollTrigger({
    // Number of pixels needed to scroll to toggle `trigger` to `true`.
    threshold: 100,
  })

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <Zoom in={trigger}>
      <Box
        role="presentation"
        // Place the button in the bottom right corner.
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1,
        }}
      >
        <Fab
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          sx={{
            height: '40px',
            width: '40px',
            bgcolor: "background.main"
          }}
        >
          <ScrollUpIcon
            sx={{
              fontSize: '30px',
              color: "common.black"
            }}
          />
        </Fab>
      </Box>
    </Zoom>
  )
};

// Item lists in page drawer
const pageDrawer = (
  <Box>
    {/* Home */}
    <ListItem key='text' disablePadding>
      <ListItemButton
        href='/'
        sx={{
          color: 'text.primary',
          '&:hover': { color: 'text.hover' }
        }}
      >
        <HomeIcon
          sx={{ fontSize: '20px' }}
        />
      </ListItemButton>
    </ListItem>

    <Divider variant="middle" />

    {/* Health Hub */}
    <ListItem key='text' disablePadding>
      <ListItemButton
        href='#healt-hub'
        sx={{
          color: 'text.primary',
          '&:hover': { color: 'text.hover' }
        }}
      >
        <ListItemText primary="HEALTH HUB" primaryTypographyProps={{ fontSize: '13px' }} />
      </ListItemButton>
    </ListItem>

    <Divider variant="middle" />

    {/* About Us */}
    <ListItem key='text' disablePadding>
      <ListItemButton
        href='/about-us'
        sx={{
          color: 'text.primary',
          '&:hover': { color: 'text.hover' }
        }}
      >
        <ListItemText primary="ABOUT US" primaryTypographyProps={{ fontSize: '13px' }} />
      </ListItemButton>
    </ListItem>

    <Divider variant="middle" />

    {/* Our Services */}
    <ListItem key='text' disablePadding>
      <ListItemButton
        href='/our-services'
        sx={{
          color: 'text.primary',
          '&:hover': { color: 'text.hover' }
        }}
      >
        <ListItemText primary="OUR SERVICES" primaryTypographyProps={{ fontSize: '13px' }} />
      </ListItemButton>
    </ListItem>

  </Box>
);

// Item lists in page drawer
const loginDrawer = (
  < Box >
    {/* Patient */}
    <ListItem key='text' disablePadding >
      <ListItemButton
        href="patient-zone"
        sx={{
          color: 'text.primary',
          '&:hover': { color: 'text.hover' }
        }}
      >
        <ListItemText primary="PATIENT ZONE" primaryTypographyProps={{ fontSize: '13px' }} />
      </ListItemButton>
    </ListItem >

    <Divider variant="middle" />

    {/* Staff */}
    <ListItem key='text' disablePadding>
      <ListItemButton
        href="staff-zone"
        sx={{
          color: 'text.primary',
          '&:hover': { color: 'text.hover' }
        }}
      >
        <ListItemText primary="STAFF ZONE" primaryTypographyProps={{ fontSize: '13px' }} />
      </ListItemButton>
    </ListItem>

  </Box >
);


export default class Header extends Component {
  // Initialize useStates, useRef, and some event hooks
  constructor(props) {
    super(props);
    this.state = {
      sticky: false,
      scrollPos: 0,
      overImage: false,
      pageDrawerOpen: false,
      loginDrawerOpen: false,
      hoverProfile: false,
      anchorEl: null,
      openMenu: false,
      cursorInMenu: false,
      targetID: '',
      navigateUrl: ' ',
    };

    this.ref = React.createRef();
    this.InitializeScroll = this.InitializeScroll.bind(this);
    this.handleSticky = this.handleSticky.bind(this);
    this.handlePageScroll = this.handlePageScroll.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleHoverEnter = this.handleHoverEnter.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleHoverItem = this.handleHoverItem.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
  }

  // Get & initial app bar height on page load
  InitializeScroll() {
    if (!this.ref.current)
      return;
    else {
      this.setState({
        scrollPos: (this.ref.current.getBoundingClientRect().top + window.scrollY),
      })
    }
  };

  // Sticky pages app bar
  handleSticky() {
    if (window.scrollY >= this.state.scrollPos) {
      this.setState({
        sticky: true,
      })
    } else {
      this.setState({
        sticky: false,
      })
    }
  };

  // Track page height on scrolling
  handlePageScroll() {
    if (window.scrollY > 300) {
      this.setState({
        overImage: true,
      })
    } else {
      this.setState({
        overImage: false,
      })
    }
  };

  // Trigger drawer open
  handleDrawerToggle(id) {
    if (id == 'page') {
      this.setState({
        pageDrawerOpen: !(this.state.pageDrawerOpen),
      })
    } else {
      this.setState({
        loginDrawerOpen: !(this.state.loginDrawerOpen),
      })
    }
  };

  // When mouse hover inside button
  handleHoverEnter(event) {
    this.setState({
      anchorEl: event.currentTarget,
      openMenu: true,
      hoverProfile: true,
    })
  };

  // When mouse hover out button
  handleHoverOut() {
    this.setState({
      cursorInMenu: false,
    })
    setTimeout(() => {
      if (this.state.cursorInMenu === false) {
        this.setState({
          anchorEl: null,
          openMenu: false,
          hoverProfile: false,
        })
      }
    }, 100)
  };

  // When mouse hover into menu lists
  handleHover() {
    this.setState({
      cursorInMenu: true
    })
  }

  // When menu list close
  handleClose() {
    this.setState({
      anchorEl: null,
      openMenu: false,
      hoverProfile: false,
    })
  }

  // When mouse hover to menu items
  handleHoverItem(id) {
    this.setState({
      targetID: id
    })
  }

  // Handle Log In Button (patient / staff)
  handleLogIn(userType, userContext) {
    if (userType == "patient") {

      if (userContext.user != null) {
        if (userContext.user.userType == 3) {
          this.setState({
            navigateUrl: "patient-zone/patientDashboard"
          })
        } else {
          this.setState({
            navigateUrl: "patient-zone"
          })
        }
      } else {
        this.setState({
          navigateUrl: "patient-zone"
        })
      }
    } else if (userType == "staff") {
      if (userContext.user != null) {
        if (userContext.user.userType != 3) {
          this.setState({
            navigateUrl: "staff-zone/staffDashboard"
          })
        } else {
          this.setState({
            navigateUrl: "staff-zone"
          })
        }
      } else {
        this.setState({
          navigateUrl: "staff-zone"
        })
      }
    }
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Access Context Data
    let userContext = this.context
    window.addEventListener('load', this.InitializeScroll);
    window.addEventListener('scroll', this.handleSticky);
    window.addEventListener('scroll', this.handlePageScroll);

    return (
      // Wrap header
      <Paper elevation={0}>

        {/* Header content */}
        <Grid
          container
          direction={'column'}
          mb={'-50px'}
          sx={{
            pb: { lg: this.state.sticky ? '50px' : '0px' }
          }}>

          {/* Help Line */}
          <AppBar
            position='static'
            variant='none'
            sx={{
              display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
              bgcolor: '#b0d4ff',
            }}
          >
            <Grid container direction='row' justifyContent='space-between'>

              {/* TPT Logo */}
              <Grid item xs={'auto'} textAlign={'center'} my={'auto'} pl={'50px'}>
                <Link href="/">
                  <img
                    src="/static/images/tpt.png"
                    alt="logo"
                    width='250px'
                    height='auto'
                  />
                </Link>
              </Grid>

              {/* Help Line Info */}
              <Grid item xs={'auto'}>
                <Stack
                  sx={{ fontSize: "13px" }}
                  color={'black'}
                  direction={'row'}
                  alignItems={"center"}
                  textAlign={"start"}
                  divider={<Divider orientation="vertical" flexItem sx={{ py: "35px", px: '0px' }} />}
                >

                  {/* General Line */}
                  <Grid container direction={'row'} justifyContent={"center"} alignItems={'center'} width={'230px'}>
                    <Grid item>
                      <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Grid>

                    <Grid item pl={'10px'}>
                      <Stack direction={'column'}>
                        <Typography fontSize={'13px'}>GENERAL LINE</Typography>
                        <StyledLink onClick={() => alert('Dial the number using your phone !')} underline="none" sx={{ cursor: 'pointer' }}>+44 0791 7891344</StyledLink>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Emergency Help */}
                  <Grid container direction={'row'} justifyContent={"center"} alignItems={'center'} width={'230px'}>
                    <Grid item>
                      <AlertIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Grid>

                    <Grid item pl={'10px'}>
                      <Stack direction={'column'}>
                        <Typography fontSize={'13px'}>EMERGENCY HELP</Typography>
                        <StyledLink onClick={() => alert('Dial the number using your phone !')} underline="none" sx={{ cursor: 'pointer' }}>+44 0791 782688</StyledLink>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Contact Us */}
                  <Grid container direction={'row'} justifyContent={"center"} alignItems={'center'} width={'230px'}>
                    <Grid item textAlign={"center"}>
                      <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Grid>

                    <Grid item pl={'10px'}>
                      <Stack direction={'column'}>
                        <Typography fontSize={'13px'}>CONTACT US</Typography>
                        <StyledLink onClick={() => alert('Email feature coming up !')} underline="none" sx={{ cursor: 'pointer' }}>CARE@TPTGROUP.COM</StyledLink>
                      </Stack>
                    </Grid>
                  </Grid>

                </Stack>
              </Grid>
            </Grid>
          </AppBar>

          {/* Pages */}
          <ElevationScroll >
            <AppBar
              position={this.state.sticky ? 'fixed' : 'static'}
              ref={this.ref}
              sx={{
                pt: '1.5px',
                bgcolor: 'white',
                opacity: this.state.overImage ? '97%' : '75%',
                zIndex: 1201,
                display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' }
              }}
            >
              <Grid container direction={'row'}>
                <Grid item xs={12}>
                  <Stack
                    sx={{ fontSize: "14px", p: '10px' }}
                    direction={'row'}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    textAlign={"center"}
                  >

                    <Link href='/'>
                      <HomeIcon
                        sx={{
                          mt: '5px',
                          fontSize: '18px',
                          color: 'text.primary',
                          '&:hover': {
                            color: 'text.hover'
                          }
                        }}
                      />
                    </Link>

                    <StyledLink onClick={() => alert('Health Hub will be updated in future !')} underline="none" sx={{ cursor: 'pointer' }}>
                      HEALTH HUB
                    </StyledLink>
                    <StyledLink href="/about-us" underline="none">
                      ABOUT US
                    </StyledLink>
                    <StyledLink href="/our-services" underline="none">
                      OUR SERVICES
                    </StyledLink>

                    {/* Log In Button */}
                    <Box
                      display={'flex'}
                      flexDirection={'row'}
                      alignItems={'center'}
                      gap={'0.5rem'}
                      component={'button'}
                      border={0}
                      bgcolor={'transparent'}
                      onMouseEnter={this.handleHoverEnter}
                      onMouseLeave={this.handleHoverOut}
                      sx={{ cursor: 'pointer' }}
                    >
                      {/* Log In Button */}
                      <ProfileIcon
                        sx={{
                          fontSize: '23px',
                          color: this.state.hoverProfile ? 'text.hover' : 'text.primary',
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight={'normal'}
                        color={this.state.hoverProfile ? 'text.hover' : 'text.primary'}
                      >
                        LOG IN
                      </Typography>

                      {/* Menu - Patient Zone / Staff Zone */}
                      <Menu
                        anchorEl={this.state.anchorEl}
                        open={this.state.openMenu}
                        onClose={this.handleClose}
                        MenuListProps={{
                          onMouseEnter: this.handleHover,
                          onMouseLeave: this.handleHoverOut,
                          style: { pointerEvents: 'auto' }
                        }}
                        sx={{
                          mt: '0.5rem',
                          pointerEvents: this.state.cursorInMenu ? 'auto' : 'none',
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        elevation={3}
                        autoFocus={false}
                      >
                        {/* Patient Zone */}
                        <StyledMenuItem
                          onClick={() => this.handleLogIn("patient", userContext)}
                          href={this.state.navigateUrl}
                          onMouseEnter={() => this.handleHoverItem('patientIcon')}
                          onMouseLeave={() => this.handleHoverItem('')}
                        >
                          <ListItemIcon>
                            <PatientIcon
                              fontSize="small"
                              sx={{
                                color: this.state.targetID === 'patientIcon' ? 'text.hover' : 'text.secondary',
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText>Patient Zone</ListItemText>
                        </StyledMenuItem>

                        {/* Staff Zone */}
                        <StyledMenuItem
                          onClick={() => this.handleLogIn("staff", userContext)}
                          href={this.state.navigateUrl}
                          onMouseEnter={() => this.handleHoverItem('staffIcon')}
                          onMouseLeave={() => this.handleHoverItem('')}
                        >
                          <ListItemIcon>
                            <StaffIcon
                              fontSize="small"
                              sx={{
                                color: this.state.targetID === 'staffIcon' ? 'text.hover' : 'text.secondary',
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText>Staff Zone</ListItemText>
                        </StyledMenuItem>
                      </Menu>
                    </Box>

                  </Stack>

                </Grid>
              </Grid>
            </AppBar>
          </ElevationScroll>

          {/* Responsive Pages small */}
          <AppBar
            position='static'
            variant="none"
            color='default'
            sx={{
              display: { md: 'flex', lg: 'none' },
              zIndex: 1201
            }}
            style={{ background: "#FFFFFF" }}
          >

            <Stack
              sx={{ fontSize: "15px", p: '20px' }}
              direction={'row'}
              justifyContent={"space-between"}
              alignItems={"center"}
              textAlign={"center"}
            >

              {/* Menu Icon */}
              <Link>
                <IconButton
                  aria-label="open-drawer"
                  onClick={() => this.handleDrawerToggle('page')}
                >
                  <MenuIcon
                    sx={{
                      fontSize: '20px',
                      color: 'text.primary',
                      '&:hover': {
                        color: 'text.hover'
                      }
                    }}
                  />
                </IconButton>
              </Link>

              {/* Logo */}
              <Grid item xs={'auto'} textAlign={'center'} mt={'5px'}>
                <Link href="/">
                  <img
                    src="/static/images/tpt.png"
                    alt="logo"
                    width='250px'
                    height='auto'
                  />
                </Link>
              </Grid>

              {/* Profile Icon */}
              <Link>
                <IconButton
                  sx={{ padding: '0' }}
                  onClick={() => this.handleDrawerToggle('login')}
                >
                  <ProfileIcon
                    sx={{
                      fontSize: '30px',
                      color: 'text.primary',
                      '&:hover': {
                        color: 'text.hover'
                      }
                    }}
                  />
                </IconButton>
              </Link>

            </Stack>
          </AppBar>

          {/* Login Drawer only appears on trigger */}
          <Drawer
            PaperProps={{
              elevation: 0
            }}
            hideBackdrop={true}
            anchor={'top'}
            open={this.state.loginDrawerOpen}
            onClose={() => this.handleDrawerToggle('login')}
            sx={{
              '&.MuiDrawer-root .MuiDrawer-paper': { marginTop: '81px' },
              display: { md: 'flex', lg: 'none' },
            }}
          >
            {loginDrawer}
          </Drawer>

          {/* Page Drawer only appears on trigger */}
          <Drawer
            PaperProps={{
              elevation: 0
            }}
            hideBackdrop={true}
            anchor={'top'}
            open={this.state.pageDrawerOpen}
            onClose={() => this.handleDrawerToggle('page')}
            sx={{
              '&.MuiDrawer-root .MuiDrawer-paper': { marginTop: '81px' },
              display: { md: 'flex', lg: 'none' },
            }}
          >
            {pageDrawer}
          </Drawer>

          {/* Scroll to top button only appear on specific event */}
          <ScrollToTopFab />

        </Grid>
      </Paper>
    );
  }
}