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
const BookingsConfirmation = () => {
  let { token } = useParams();
  return (
    <Grid container spacing={8} alignItems="center" mx={2}>
      <Grid item xs={6} lg={12} p={0} sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Image image={image} />
        <BookingConfirmationForm bookingId={token} />
      </Grid>
    </Grid>
  );
};

export default BookingsConfirmation;
