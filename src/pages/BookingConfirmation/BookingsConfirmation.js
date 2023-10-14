/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import Image from "../Form/Components/Image";

import image from "assets/images/bookingImage.jpg";
import taxi from "assets/images/3644592.jpg";
import packageImage from "assets/images/11291.jpg";

import { useEffect, useState } from "react";
import SearchBooking from "pages/Form/Components/SearchBooking";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { useHttpClient } from "hooks/http-hook";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import { Card } from "@mui/material";
import ColorToggleButton from "pages/Form/Components/ColorToggleButton";
import BookingConfirmationForm from "./Component/BookingConfirmationForm";
import { useParams } from "react-router-dom";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import bgImage2 from "assets/images/Background image/bg-2.jpg";
import MDBox from "components/MDBox";

const BookingsConfirmation = () => {
  let { token } = useParams();
  return (
    <>
      {/* <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      /> */}
      <MKBox
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        minHeight="100vh"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* <Grid container justifyContent="center" alignItems="center"> */}
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ width: { xs: "90vw", lg: 1200 } }}
          py={5}
        >
          <BookingConfirmationForm bookingId={token} />
        </MDBox>
        {/* </Grid> */}
      </MKBox>
    </>
  );
};

export default BookingsConfirmation;
