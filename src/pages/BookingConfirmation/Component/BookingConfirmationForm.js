/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { Grid } from "@mui/material";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { useHttpClient } from "hooks/http-hook";

const BookingConfirmationForm = ({ bookingId }) => {
  const [BookingData, setBookingData] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [buttonStatus, setButtonStatus] = useState();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/counter/bookingByToken?token=${bookingId}`
        );
        if (responseData?.data.bookingMode == "taxi") {
          const fields = [
            { label: "First Name", key: responseData?.data[0]?.firstName },
            { label: "Last Name", key: responseData.data[0]?.lastName },
            { label: "Phone Number", key: responseData.data[0]?.phoneNumber },
            { label: "From", key: responseData.data[0]?.source },
            { label: "Destination", key: responseData.data[0]?.destination },
            { label: "Travel Date", key: responseData.data[0]?.travelDate },
            { label: "Travel Time", key: responseData.data[0]?.travelTime },
            { label: "Fare", key: responseData.data[0]?.fare },
            { label: "Additional Charges", key: responseData.data[0]?.additionalCharges },
            { label: "Payment Mode", key: responseData.data[0]?.paymentMode },
            { label: "Booking Status", key: responseData.data[0]?.bookingStatus },
            { label: "Confirmed", key: responseData.data[0]?.confirmed },
            { label: "token", key: responseData.data[0]?.token },
            { label: "Payment Accepted", key: responseData.data[0]?.paymentAccepted },
          ];
          setBookingData(fields);
          setButtonStatus(responseData?.data[0]?.bookingStatus);
        }
        if (responseData?.data.bookingMode == "bus") {
          const fields = [
            { label: "First Name", key: responseData?.data[0]?.firstName },
            { label: "Last Name", key: responseData.data[0]?.lastName },
            { label: "Phone Number", key: responseData.data[0]?.phoneNumber },
            { label: "From", key: responseData.data[0]?.startingLocation },
            { label: "Destination", key: responseData.data[0]?.destination },
            { label: "Travel Date", key: responseData.data[0]?.travelDate },
            { label: "Travel Time", key: responseData.data[0]?.travelTime },
            { label: "token", key: responseData.data[0]?.token },
          ];
          setBookingData(fields);
          setButtonStatus(responseData?.data[0]?.bookingStatus);
        }
      } catch (error) {
        console.log("🚀 ~ file: BookingStatus.js:29 ~ fetchBooking ~ error:", error);
      }
    };
    fetchBooking();
  }, [bookingId]);
  return (
    <Grid item xs={12} lg={10} mt={0}>
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
              {BookingData &&
                BookingData.map((field, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <MKBox mb={2}>
                      <MKInput
                        type="text"
                        label={field.label}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={field.key || ""}
                        readOnly // To make the input fields read-only
                        disabled
                      />
                    </MKBox>
                  </Grid>
                ))}
              <Grid item xs={12} md={6}>
                <MKBox mb={1}>
                  {BookingData && buttonStatus == "pending" ? (
                    <>
                      {/* <MKTypography variant="h6">
                        Wait for the payment status get changed.
                      </MKTypography> */}

                      <MKButton variant="gradient" color="info" fullWidth>
                        {buttonStatus}
                      </MKButton>
                    </>
                  ) : (
                    <>
                      <MKTypography variant="h6">Payment status is completed.</MKTypography>

                      <MKButton variant="gradient" color="Success" fullWidth>
                        {buttonStatus}
                      </MKButton>
                    </>
                  )}
                </MKBox>
              </Grid>
            </Grid>
          </MKBox>
        </MKBox>
      </MKBox>
    </Grid>
  );
};

export default BookingConfirmationForm;
