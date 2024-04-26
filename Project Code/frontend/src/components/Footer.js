import React, { Component, useContext } from "react";
import { Divider, Grid, Stack, Typography, Box, CssBaseline, Link } from "@mui/material";

// Display Current Year for Copyright
function Copyright() {
  return (
    <Typography variant="body2" color="text.primary" textAlign={"center"}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {' Top Patient Transport. All Right Reserved.'}
    </Typography>
  );
};

export default class Footer extends Component {
  render() {
    return (
      // Wrap Footer
      <Box sx={{ width: '100%', pt: '150px' }}>

        {/* Prevent browser CSS default settings */}
        <CssBaseline />

        {/* Footer content */}
        <Box
          sx={{
            py: 3, px: 2, mt: 'auto',
            bgcolor: 'background.light',
          }}
        >
          <Grid container direction={"column"} rowSpacing={3}>
            {/* Navigation links footer */}
            <Grid item xs={12}>
              <Stack
                sx={{ fontSize: "12px" }}
                divider={<Divider orientation="vertical" flexItem />}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 3 }}
                justifyContent={"center"}
                alignItems={"center"}
                textAlign={"center"}
              >
                <Link color={"text.secondary"} underline="hover" onClick={()=>alert('Privacy Policy')} sx={{cursor: 'pointer'}}>
                  Privacy Policy
                </Link>
                <Link color={"text.secondary"} underline="hover" onClick={()=>alert('T&C')} sx={{cursor: 'pointer'}}>
                  Terms & Condition
                </Link>
                <Link color={"text.secondary"} underline="hover" onClick={()=>alert('More Info')} sx={{cursor: 'pointer'}}>
                  More Info
                </Link>
              </Stack>
            </Grid>

            {/* Copyright statement */}
            <Grid item xs={12}>
              <Copyright />
            </Grid>

          </Grid>
        </Box>
      </Box>
    );
  }
}