/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { Grid } from "@mui/material";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import image from "assets/images/bookingImage.jpg";
import Image from "pages/Form/Components/Image";

const BusBookingConfirmation = () => {
  const [BookingData, setBookingData] = useState();
  useEffect(() => {
    const responseData = JSON.parse(localStorage.getItem("BusConfirmationInfo"));
    console.log("🚀 ~ file: BusBookingConfirmation.js:14 ~ useEffect ~ response:", responseData);
    const fields = [
      { label: "First Name", key: responseData?.data?.firstName },
      { label: "Last Name", key: responseData.data?.lastName },
      { label: "Phone Number", key: responseData.data?.phoneNumber },
      { label: "From", key: responseData.data?.startingLocation },
      { label: "Destination", key: responseData.data?.destination },
      { label: "Travel Date", key: responseData.data?.travelDate },
      { label: "Travel Time", key: responseData.data?.travelTime },
      { label: "token", key: responseData.data?.token },
    ];
    setBookingData(fields);
  }, []);
  console.log(
    "🚀 ~ file: BusBookingConfirmation.js:13 ~ BusBookingConfirmation ~ BookingData:",
    BookingData
  );

  return (
    <Grid container spacing={8} alignItems="center" mx={2}>
      <Grid item xs={6} lg={12} p={0} sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Image image={image} />
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
                Bus Booking Confirmed
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
                    {/* <MKBox mb={1}>
                      <>
                        <MKTypography variant="h6">Payment status is completed.</MKTypography>

                        <MKButton variant="gradient" color="info" fullWidth>
                          Working
                        </MKButton>
                      </>
                    </MKBox> */}
                  </Grid>
                </Grid>
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BusBookingConfirmation;
