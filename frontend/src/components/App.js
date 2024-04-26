import React, { Component } from "react";
import { render } from "react-dom";
import RoutePage from "./RoutePage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./Theme";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // Use BrowserRouter to wrap and use "useNavigate" in RoutePage
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <RoutePage />
        </BrowserRouter>
      </ThemeProvider>
    )
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);