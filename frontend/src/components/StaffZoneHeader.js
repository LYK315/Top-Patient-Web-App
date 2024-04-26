import React, { Component, useCallback } from "react";
import { Paper, Stack, Link, AppBar, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Drawer, Box, Zoom, Fab, Button, Menu, MenuItem, CssBaseline } from "@mui/material";
import { styled } from "@mui/styles";
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from "../components/AuthContext";

// Custom Menu Item
const StyledMenuItem = styled((props) => (
  <MenuItem
    component={Link}
    const {...props}
  />))
  (({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.hover,
    }
  }));

export default class ZoneHeader extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      anchorEl: null,
      openMenu: false,
      cursorInMenuList: false,
      hoverLogOut: null,
    });

    this.enterMenu = this.enterMenu.bind(this);
    this.outMenu = this.outMenu.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.enterMenuList = this.enterMenuList.bind(this);
    this.hoverBtnTarget = this.hoverBtnTarget.bind(this);
  }

  // Hover into Profile Icon
  enterMenu(event) {
    this.setState({
      anchorEl: event.currentTarget,
      openMenu: true,
    })
  }

  // Hover into Menu List
  enterMenuList() {
    this.setState({
      cursorInMenuList: true,
    })
  }

  // Hover out Profile Icon
  outMenu() {
    this.setState({
      cursorInMenuList: false,
    })
    setTimeout(() => {
      if (this.state.cursorInMenuList === false) {
        this.setState({
          anchorEl: null,
          openMenu: false,
        })
      }
    }, 100)
  };

  // Handle Menu Close
  onMenuClose() {
    this.setState({
      openMenu: false,
    })
  }

  // Get Hover Target
  hoverBtnTarget(target) {
    this.setState({
      hoverLogOut: target,
    })
  }

  // Declare Context Type
  static contextType = AuthContext
  render() {
    // Access Context Data
    let userContext = this.context
    let logoutUser = userContext.logoutUser

    return (
      <Paper elevation={0}>
       {/* Prevent browser default CSS */}
        <CssBaseline />

        <AppBar
          position='static'
          variant='none'
          sx={{
            display: 'flex',
            bgcolor: '#b0d4ff',
          }}
        >
          <Box
            mx={'auto'}
            display={'flex'}
            alignItems={'center'}
            textAlign={'center'}
            justifyContent={'space-between'}
            width={'90%'}
            p={'10px'}
          >
            {/* TPT Logo */}
            <Link href="/staff-zone/staffDashboard" mt={'auto'}>
              <img
                src="/static/images/tpt.png"
                alt="logo"
                width='230px'
                height='auto'
              />
            </Link>

            <Stack
              color={'black'}
              direction={'row'}
              alignItems={"center"}
              textAlign={"center"}
              width={'fit-content'}
              justifyContent={"space-between"}
              gap={'1.5rem'}
            >
              {/* Profile Icon */}
              <IconButton
                href="#staffZone"
                disableRipple={true}
                onMouseEnter={this.enterMenu}
                onMouseLeave={this.outMenu}
                sx={{
                  p: 0,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.hover'
                  }
                }}>

                <ProfileIcon sx={{ fontSize: 40 }} />

                {/* Buttons on Hover */}
                <Menu
                  anchorEl={this.state.anchorEl}
                  open={this.state.openMenu}
                  onClose={this.onMenuClose}
                  MenuListProps={{
                    onMouseEnter: this.enterMenuList,
                    onMouseLeave: this.outMenu,
                    style: { pointerEvents: 'auto' }
                  }}
                  sx={{
                    mt: '0.5rem',
                    ml: '0.5rem',
                    pointerEvents: this.state.cursorInMenuList ? 'auto' : 'none',
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  elevation={3}
                  autoFocus={false}
                >
                  {/* Log Out Button */}
                  <StyledMenuItem
                    onClick={() => logoutUser('staff')}
                    onMouseEnter={() => this.hoverBtnTarget('logOut')}
                    onMouseLeave={() => this.hoverBtnTarget('')}
                  >
                    <ListItemIcon>
                      <LogoutIcon
                        fontSize="small"
                        sx={{
                          color: this.state.hoverLogOut === 'logOut' ? 'text.hover' : 'text.secondary',
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText>Log Out</ListItemText>
                  </StyledMenuItem>
                </Menu>

              </IconButton>

            </Stack>
          </Box>

        </AppBar>
      </Paper>
    )
  }
}