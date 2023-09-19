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

const BookingsConfirmation = () => {
  let { token } = useParams();
  return (
    <>
      <MKBox
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
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <BookingConfirmationForm bookingId={token} />
        </Grid>
      </MKBox>
    </>
  );
};

export default BookingsConfirmation;
