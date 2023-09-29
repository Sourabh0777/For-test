/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { Box, Grid } from "@mui/material";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { useHttpClient } from "hooks/http-hook";
import Animations from "pages/NewFormPage/Animations";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const BookingConfirmationForm = ({ bookingId }) => {
  const navigate = useNavigate();

  const [BookingData, setBookingData] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [buttonStatus, setButtonStatus] = useState();
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/counter/bookingByToken?token=${bookingId}`
        );
        console.log(
          "🚀 ~ file: BookingConfirmationForm.js:25 ~ fetchBooking ~ responseData:",
          responseData
        );
        const formattedTravelDate = dayjs(responseData?.data?.travelDate).format("DD MMM, YYYY");
        if (responseData?.data.bookingMode == "PK") {
          const fields = [
            {
              label: "First Name",
              key: responseData?.data[0]?.firstName + " " + responseData.data[0]?.lastName,
            },
            { label: "Phone Number", key: responseData.data[0]?.phoneNumber },
            { label: "From", key: responseData.data[0]?.source?.sourceName },
            { label: "Token", key: responseData.data[0]?.token },
            // { label: "Travel Date", key: responseData.data[0]?.travelDate },
            { label: "Travel Date", key: formattedTravelDate },
            { label: "Travel Time", key: responseData.data[0]?.travelTime },
            // { label: "Payment Mode", key: responseData.data[0]?.paymentMode },
            // { label: "Booking Status", key: responseData.data[0]?.bookingStatus },
          ];

          setBookingData(fields);
          setButtonStatus(responseData?.data[0]?.bookingStatus);
        }

        if (responseData?.data.bookingMode == "TX") {
          const fields = [
            {
              label: "First Name",
              key: responseData?.data[0]?.firstName + " " + responseData.data[0]?.lastName,
            },
            { label: "Phone Number", key: responseData.data[0]?.phoneNumber },
            { label: "From", key: responseData.data[0]?.source?.sourceName },
            { label: "Token", key: responseData.data[0]?.token },
            { label: "Travel Date", key: formattedTravelDate },
            { label: "Travel Time", key: responseData.data[0]?.travelTime },
            // { label: "Payment Mode", key: responseData.data[0]?.paymentMode },
            // { label: "Booking Status", key: responseData.data[0]?.bookingStatus },
          ];
          setBookingData(fields);
          setButtonStatus(responseData?.data[0]?.bookingStatus);
        }
        if (responseData?.data.bookingMode == "bus") {
          const fields = [
            {
              label: "First Name",
              key: responseData?.data[0]?.firstName + " " + responseData.data[0]?.lastName,
            },
            { label: "Phone Number", key: responseData.data[0]?.phoneNumber },
            { label: "token", key: responseData.data[0]?.token },
            { label: "From", key: responseData.data[0]?.startingLocation?.sourceName },
            { label: "Destination", key: responseData.data[0]?.destination },
            { label: "Travel Date", key: formattedTravelDate },
            { label: "Travel Time", key: responseData.data[0]?.travelTime },
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
  const handleNewBookingClick = () => {
    navigate("/BookingPage");
  };
  return (
    <Grid item xs={8} lg={8} mt={0}>
      {isLoading && <Animations />}
      {!isLoading && (
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
              Booking Request
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
                          disabled
                        />
                      </MKBox>
                    </Grid>
                  ))}
              </Grid>
              <MKTypography variant="h6">
                Please mention your token number at the counter. This is a tentative fare and final
                fare will be decided at the counter. This is a booking request and not a
                confirmation of the booking.
              </MKTypography>
            </MKBox>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 3 }}>
              {" "}
              <MKButton variant="gradient" color="info" onClick={handleNewBookingClick}>
                New Booking{" "}
              </MKButton>
            </Box>
          </MKBox>
        </MKBox>
      )}
    </Grid>
  );
};

export default BookingConfirmationForm;
