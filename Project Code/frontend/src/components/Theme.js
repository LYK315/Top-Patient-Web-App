import { createTheme } from "@mui/material";
import {responsiveFontSizes} from "@mui/material";

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 350,
      md: 600,
      lg: 1000,
      xl: 1200,
    }
  },
  palette: {
    common: { 
      black: "#000",
      white: "#FFF",
    },
    primary: {
      main: "#0056BD", // Mid Blue
      light: "#B0D4FF", // Skyblue
      dark: "#001C48", // Midnight Dark BLue
      contrastText: "#FFF" // White
    },
    secondary: {
      main: "#1E5288", // Mid Blue
      light: "#81D3EB", // Skyblue
      dark: "#001C48", // Midnight Dark BLue
      contrastText: "#FFF" // White
    },
    background: {
      main: "#F3F6F4", // Light beiege
      light: "#EEE", // Very light grey
      dark: "#999999", // Grey
    },
    error: {
      main: "#D32F2F", // Red
      light: "#EF5350", // Light Red
      dark: "#C62828", // Dark Red
    },
    success: {
      main: "#2E7D32", // Green
      light: "#4CAF50", // Light Green
      dark: "#1B5E20", // Dark Green
    },
    text: {
      primary: "#000000", // Black
      secondary: "#0056BD", // Blue
      disabled: "#999", // Grey
      hover: "#D9E8FA", // Sky Blue
      hoverDark: "#1E5288",
    },
  },
})

theme = responsiveFontSizes(theme);

export default theme;