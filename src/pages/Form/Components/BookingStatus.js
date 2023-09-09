/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import React, { useEffect, useState } from "react";

const BookingStatus = ({ bookingConfirmationData }) => {
  const [BookingData, setBookingData] = useState();
  useEffect(() => {
    if (bookingConfirmationData) {
      console.log(
        "🚀 ~ file: BookingStatus.js:14 ~ useEffect ~ bookingConfirmationData:",
        bookingConfirmationData
      );
      const {
        firstName,
        lastName,
        phoneNumber,
        source,
        destination,
        travelDate,
        travelTime,
        fare,
        additionalCharges,
        paymentMode,
        bookingStatus,
        confirmed,
        paymentAccepted,
      } = bookingConfirmationData;
      console.log(
        "🚀 ~ file: BookingStatus.js:33 ~ useEffect ~",
        firstName,
        lastName,
        phoneNumber,
        source,
        destination,
        travelDate,
        travelTime,
        fare,
        additionalCharges,
        paymentMode,
        bookingStatus,
        confirmed,
        paymentAccepted
      );
      const fields = [
        { label: "First Name", key: firstName },
        { label: "Last Name", key: lastName },
        { label: "Phone Number", key: phoneNumber },
        { label: "From", key: source },
        { label: "Destination", key: destination },
        { label: "Travel Date", key: travelDate },
        { label: "Travel Time", key: travelTime },
        { label: "Fare", key: fare },
        { label: "Additional Charges", key: additionalCharges },
        { label: "Payment Mode", key: paymentMode },
        { label: "Booking Status", key: bookingStatus },
        { label: "Confirmed", key: confirmed },
        { label: "Payment Accepted", key: paymentAccepted },
      ];
      setBookingData(fields);
    }
  }, []);

  // console.log("🚀 ~ file: BookingStatus.js:12 ~ BookingStatus ~ BookingData:", BookingData);

  return (
    <MKBox
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      mt={{ xs: 0, sm: 0, md: 0 }}
      mb={{ xs: 5, sm: 10, md: 5 }}
      mx={0}
    >
      <MKBox
        variant="gradient"
        bgColor="info"
        coloredShadow="info"
        borderRadius="lg"
        p={2}
        mx={2}
        mt={-2}
      >
        <MKTypography variant="h3" color="white">
          Booking Confirmed
        </MKTypography>
      </MKBox>
      <MKBox pt={4} pb={3} px={3}>
        <MKBox component="form" role="form">
          <Grid container spacing={3}>
            {bookingConfirmationData &&
              BookingData &&
              BookingData.map((field, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label={field.label}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={field.key}
                      readOnly // To make the input fields read-only
                      disabled
                    />
                  </MKBox>
                </Grid>
              ))}
            <Grid item xs={12} md={6}>
              <MKBox mb={1}>
                <MKButton variant="gradient" color="info" fullWidth firstName>
                  Wait will payment get Confirmed
                </MKButton>
              </MKBox>
            </Grid>
          </Grid>
        </MKBox>
      </MKBox>
    </MKBox>
  );
};

export default BookingStatus;
