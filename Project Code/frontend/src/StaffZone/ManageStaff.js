import React, { Component } from "react";
import ZoneHeader from "../components/StaffZoneHeader";
import Typography from '@mui/material/Typography'
import { Box, Button, Container, Divider, FormControl, IconButton, Input, InputAdornment, InputLabel, MenuItem, Paper, Select, Slide, Stack, TextField } from "@mui/material";
import styled from "@emotion/styled";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from '@mui/x-data-grid';

// Custom Button
const PageButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  textAlign: 'center',
  fontWeight: 'bold',
  textTransform: 'none',
  width: '135px',
  height: '40px',
  color: theme.palette.text.secondary,
  '&:hover': {
    opacity: '50%',
    backgroundColor: '#D9EAFF',
  }
}));

export default class ManageStaff extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      pageClicked: 'addStaff',
      showPass: false,
    })

    this.handlePageBtnClick = this.handlePageBtnClick.bind(this);
    this.handleShowPass = this.handleShowPass.bind(this);
    this.handleMouseDownPass = this.handleMouseDownPass.bind(this);
  }

  // Handle mouse click target
  handlePageBtnClick(btnID) {
    if (btnID == 'services') {
      this.setState({ pageClicked: 'addStaff' })
    } else {
      this.setState({ pageClicked: 'viewStaff' })
    }
  }

  // Handle show / hide password
  handleShowPass() {
    this.setState({
      showPass: !(this.state.showPass)
    })
  };

  // Prevent browser default css
  handleMouseDownPass(event) {
    event.preventDefault();
  }

  // Table Column Data
  columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'fullName',
      headerName: 'Full name',
      width: 350,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'dob', headerName: 'DOB', width: 150 },
    { field: 'age', headerName: 'Age', width: 100, type: 'number' },
  ];

  // Table Row Data
  rows = [
    { id: 1001, lastName: 'Snow', firstName: 'Jon', age: 35, gender: 'Male', dob: '10/01/2001' },
    { id: 1002, lastName: 'Lannister', firstName: 'Cersei', age: 42, gender: 'Male', dob: '10/01/2001' },
    { id: 1003, lastName: 'Lannister', firstName: 'Jaime', age: 45, gender: 'Male', dob: '10/01/2001' },
    { id: 1004, lastName: 'Stark', firstName: 'Arya', age: 16, gender: 'Male', dob: '10/01/2001' },
    { id: 1005, lastName: 'Targaryen', firstName: 'Daenerys', age: 50, gender: 'Male', dob: '10/01/2001' },
    { id: 1006, lastName: 'Melisandre', firstName: 'Asd', age: 50, gender: 'Male', dob: '10/01/2001' },
    { id: 1007, lastName: 'Clifford', firstName: 'Ferrara', age: 44, gender: 'Male', dob: '10/01/2001' },
    { id: 1008, lastName: 'Frances', firstName: 'Rossini', age: 36, gender: 'Male', dob: '10/01/2001' },
    { id: 1009, lastName: 'Roxie', firstName: 'Harvey', age: 65, gender: 'Male', dob: '10/01/2001' },
  ];

  render() {
    return (
      <div>
        {/* Page Header */}
        <ZoneHeader />

        {/* Page Background Img */}
        <Box
          sx={{
            backgroundImage: "url('/static/images/background-img.png')",
            minHeight: '100vh',
            maxHeight: '200vh',
            maxWidth: '100vw',
          }}>

          {/* Page Body */}
          <Container
            sx={{
              width: '100%',
              pt: '4rem',
              pb: '15rem'
            }}
          >
            {/* Title - Manage Staff */}
            <Typography
              variant="h4"
              color="text.secondary"
              width='100%'
              textAlign={'left'}
              fontWeight={'bold'}
            >
              Manage Staff
            </Typography>

            {/* Add Staff / View Staff */}
            <Stack
              direction={'row'}
              spacing={'2rem'}
              justifyContent={'center'}
              mx={'auto'}
              mt={'3rem'}
            >
              {/* Add Staff */}
              <PageButton onClick={() => this.handlePageBtnClick('services')}
                sx={{ bgcolor: this.state.pageClicked === 'addStaff' ? '#BAD9FF' : '#D9EAFF' }}>
                Add Staff
              </PageButton>

              <Typography variant="h4">/</Typography>

              {/* View Staff */}
              <PageButton onClick={() => this.handlePageBtnClick('others')}
                sx={{ bgcolor: this.state.pageClicked === 'viewStaff' ? '#BAD9FF' : '#D9EAFF' }}>
                View Staff
              </PageButton>

            </Stack>

            {/* Add Staff */}
            <Slide
              direction={"right"}
              in={this.state.pageClicked === 'addStaff'}
              timeout={500}
            >
              <Paper
                elevation={2}
                sx={{
                  display: this.state.pageClicked === 'addStaff' ? 'flex' : 'none',
                  borderRadius: '5px',
                  width: 'fit-content',
                  mt: '3.5rem',
                  mx: 'auto',
                  px: '40px',
                  py: '20px'
                }}
              >
                <Box
                  mx={'auto'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  gap={'1.5rem'}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Staff Name */}
                  <TextField
                    variant="standard"
                    required={true}
                    id="staff-name"
                    label="Staff Name"
                    placeholder="Enter Staff Name"
                    sx={{
                      width: '300px'
                    }}
                  />

                  {/* Gender */}
                  <FormControl variant="standard" required fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      error={false}
                      required
                      id="staff-gender"
                      label="Gender"
                      fullWidth
                      defaultValue=""
                      sx={{
                        "& .MuiSelect-icon": {
                          fontSize: '2.5rem'
                        }
                      }}
                    >
                      <MenuItem value={'1'}>Male</MenuItem>
                      <MenuItem value={'2'}>Female</MenuItem>
                      <MenuItem value={'3'}>Prefer Not to Say</MenuItem>
                    </Select>
                  </FormControl>

                  {/* DOB */}
                  <Box width={'100%'}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        components={['DatePicker']}
                        sx={{
                          overflow: 'visible', p: 0,
                          '& .css-11a8txn-MuiStack-root': {
                            width: '100%'
                          }
                        }}
                      >
                        <DemoItem>
                          <DatePicker
                            label="Date of Birth"
                            slotProps={{
                              textField: {
                                required: true,
                                variant: 'standard',
                                id: 'staff-dob',
                              },
                              openPickerButton: {
                                sx: { mr: '0px' },
                              }
                            }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>

                  {/* Admin Password */}
                  <FormControl fullWidth variant="standard" required>
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                      placeholder="Enter Admin Password"
                      id="admin-password"
                      type={this.state.showPass ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleShowPass}
                            onMouseDown={this.handleMouseDownPass}
                          >
                            {this.state.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>

                  {/* Add Staff Button */}
                  <PageButton
                    sx={{ bgcolor: '#BAD9FF', my: '0.5rem' }}
                    onClick={() => { alert('Feature is coming up !') }}
                  >
                    Add Staff
                  </PageButton>

                </Box>
              </Paper>
            </Slide>

            {/* View Staff */}
            <Slide
              direction={'left'}
              in={this.state.pageClicked === 'viewStaff'}
              timeout={500}
            >
              <DataGrid
                sx={{
                  mx: 'auto',
                  width: '85%',
                  mt: '3rem'
                }}
                rows={this.rows}
                columns={this.columns}

                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            </Slide>

          </Container>
        </Box>
      </div >
    )
  }
}