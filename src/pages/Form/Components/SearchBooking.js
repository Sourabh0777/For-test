/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Grid } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { useHttpClient } from "hooks/http-hook";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBooking = () => {
  const [input, setInput] = useState("");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();

  const searchHandler = async () => {
    const fetchBooking = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/counter/bookingByToken?token=${input}`
        );
        if (responseData?.data) {
          navigate(`/booking/${responseData?.data[0].token}`);
        }
      } catch (error) {
        console.log("🚀 ~ file: BookingStatus.js:29 ~ fetchBooking ~ error:", error);
      }
    };
    fetchBooking();
    setInput("");
  };
  return (
    <Grid
      item
      xs={12}
      lg={5}
      mt={5}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <MKBox mb={0} mr={0}>
        <MKTypography variant="h6" fontWeight="medium" pb={1} mt={0}>
          Search Booking
        </MKTypography>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={14}>
            <MKInput
              label="Enter Token or Phone Number"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <MKButton variant="gradient" color="info" onClick={searchHandler}>
              Search
            </MKButton>
          </Grid>
        </Grid>
      </MKBox>
    </Grid>
  );
};

export default SearchBooking;
