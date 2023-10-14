/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";
import taxi from "assets/images/3644592.jpg";

// Material Kit 2 React routes
import routes from "routes";
import Form from "pages/Form";
import Navbar from "pages/Navbar/Navbar";
import { Grid } from "@mui/material";
import { FormContext } from "pages/Form/Components/FormContext";

export default function App() {
  const { pathname } = useLocation();
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.name} />;
      }
      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <Grid container spacing={9} alignItems="center" justifyContent="center"> */}
      {/* <Navbar changeTypeHandler={changeTypeHandler} /> */}
      <Routes>
        {getRoutes(routes)}
        <Route path="/taxi" element={<Form />} />
        <Route path="*" element={<Navigate to="/BookingPage" />} />
      </Routes>
      {/* </Grid> */}
    </ThemeProvider>
  );
}
