import React, { Component } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../Main/Home";
import OurServices from "../OurServices/OurServices";
import Nepts from "../OurServices/Nepts";
import AboutUs from "../Main/AboutUs";
import Nepts_Eligibility from "../OurServices/Nepts_Eligiblity";
import Nepts_How2Book from "../OurServices/Nepts_How2Book";
import Patient_LogIn from "../PatientZone/LogIn";
import Patient_Dashboard from "../PatientZone/Dashboard";
import Patient_Nepts from "../PatientZone/Nepts";
import Patient_Profile from "../PatientZone/Profile";
import Patient_MyAppt from "../PatientZone/MyAppt";
import Staff_LogIn from "../StaffZone/LogIn";
import Routing_Schedule from "../StaffZone/RoutingSchedule"
import Schedule_Detail from "../StaffZone/ScheduleDetail"
import Staff_Dashboard from "../StaffZone/Dashboard";
import Staff_ManageStaff from "../StaffZone/ManageStaff";
import Staff_Nepts from "../StaffZone/Nepts";
import Staff_PatientApplication from "../StaffZone/PatientApplication";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

class RoutePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      isStaff: false,
      authToken: {},
      user: {},
      contextData: {},
    }

    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.updateToken = this.updateToken.bind(this);
  }

  // Get user Session Token immediately after page renders
  componentDidMount() {
    // Get Session Token data from browser local storage if available
    this.setState({
      authToken: (localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null),
      user: (localStorage.getItem('authToken') ? jwtDecode(localStorage.getItem('authToken')) : null)
    })
    
    // Refresh Access Token using Refresh Token, every 8 minutes
    let interval = setInterval(() => {
      if (this.state.authToken) {
        this.updateToken();
      }
    }, 480000)
    
    return () => clearInterval(interval)
  }

  // Log In User (email, password)
  loginUser = async (email, pass, userVariant) => {
    try {
      // Data to pass to API
      const data = {
        email: email,
        password: pass
      };

      // API request
      const res = await axios.post('http://127.0.0.1:8000/api/token/', data);
      if (res.status === 200) {
        this.setState({
          authToken: res.data,
          user: jwtDecode(res.data.access)
        }, () => {
          // Store Token to browser local storage
          localStorage.setItem('authToken', JSON.stringify(this.state.authToken))

          // Navigate to dashboard accordingly (patient / staff)
          if (this.state.user.userType == 3 && userVariant == 'patient')
            this.props.navigate("/patient-zone/patientDashboard");
          else if (this.state.user.userType != 3 && userVariant == 'staff')
            this.props.navigate("/staff-zone/staffDashboard");
          else
            alert('Are you a Patient or Staff ?')
        })
      } else {
        alert('Something went wrong, log in failed.')
      }
    } catch (err) {
      console.log(err);
      if (err.response.status == 401)
        alert("Wrong Email or Password.")
    }
  }

  // Log Out User
  logoutUser = async (userType) => {
    this.setState({
      authToken: null,
      user: null,
    })
    // Remove user Access Token from browser local storage
    localStorage.removeItem('authToken');

    // Navigate to log in page accordingly (staff / patient)
    if (userType == 'staff')
      this.props.navigate("/staff-zone");
    else
      this.props.navigate("/patient-zone");
  }

  // Refresh user's Access Token
  updateToken = async () => {
    // Send "refresh token" to get new "access token"
    try {
      let data = {
        refresh: this.state.authToken.refresh,
      };

      // Send API request
      let res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', data);
      if (res.status === 200) {
        this.setState({
          authToken: res.data,
          user: jwtDecode(res.data.access)
        })

        // Update user's Access Token in browser local storage
        localStorage.setItem('authToken', JSON.stringify(res.data));
      } else {
        // Log out user if error refreshing access token
        if (this.state.user.userType == 3)
          this.logoutUser("patient");
        else
          this.logoutUser("staff");
      }
    } catch (err) {
      // Log out user if error refreshing access token
      if (this.state.user.userType == 3)
        this.logoutUser("patient");
      else
        this.logoutUser("staff");
    }
  }

  render() {
    // Declare and assign Context Data Value
    const contextData = {
      user: this.state.user,
      authToken: this.state.authToken,
      loginUser: this.loginUser,
      logoutUser: this.logoutUser
    }

    return (
      // Wrap with Context Provider, pass Context Data to each page
      <AuthContext.Provider value={contextData}>
        <Routes>
          {/* Main Pages */}
          <Route exact path="/" element={<Home />} />
          <Route path='/our-services' element={<OurServices />} />
          <Route path='/nepts' element={<Nepts />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/nepts-how-to-book' element={<Nepts_How2Book />} />
          <Route path='/nepts-eligibility' element={<Nepts_Eligibility />} />

          {/* Patient Zone */}
          <Route path='/patient-zone' element={<Patient_LogIn />} />
          <Route path='/patient-zone/patientDashboard' element={<Patient_Dashboard />} />
          <Route path='/patient-zone/nepts' element={<Patient_Nepts />} />
          <Route path='/patient-zone/profile' element={<Patient_Profile />} />
          <Route path='/patient-zone/appointments' element={<Patient_MyAppt />} />

          {/* Staff Zone */}
          <Route path='/staff-zone' element={<Staff_LogIn />} />
          <Route path='/staff-zone/staffDashboard' element={<Staff_Dashboard />} />
          <Route path='/staff-zone/nepts' element={<Staff_Nepts />} />
          <Route path='/staff-zone/routing-schedule' element={<Routing_Schedule />} />
          <Route path='/staff-zone/routing-schedule/:date' element={<Schedule_Detail />} />
          <Route path='/staff-zone/manage-staff' element={<Staff_ManageStaff />} />
          <Route path='/staff-zone/patient-application' element={<Staff_PatientApplication />} />
        </Routes>
      </AuthContext.Provider>
    );
  }
}

// Wrap class with function to access useNavigate
function Wrapper() {
  return <RoutePage navigate={useNavigate()} />;
}

export default Wrapper;
