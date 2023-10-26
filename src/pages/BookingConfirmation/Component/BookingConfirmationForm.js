/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { Box, Grid, TextField } from "@mui/material";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { useHttpClient } from "hooks/http-hook";
import Animations from "pages/NewFormPage/Animations";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AddBox, Person2Outlined } from "@mui/icons-material";
import MDBox from "components/MDBox";

const BookingConfirmationForm = ({ bookingId }) => {
  const [todaysDate, setTodaysDate] = useState();
  const [ladningId, setLandingId] = useState(null);
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const [BookingData, setBookingData] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [buttonStatus, setButtonStatus] = useState();
  const [_id, set_id] = useState();
  const [landingLocations, setLandingLocations] = useState([]);
  const getLandingName = (data) => {
    console.log("Landings", landingLocations);
    const selected = data?.destination?.landingLocations?.find(
      (location) => location._id === data?.landingLocationId
    );
    return selected?.place;
  };
  useEffect(() => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setTodaysDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/messages`);
        if (responseData) {
          setMessages(responseData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, []);

  const [booking, setBooking] = useState({});

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/counter/bookingByToken?token=${bookingId}`
        );
        if (responseData.data) {
          set_id(responseData.data[0]._id);
          setBooking(responseData.data[0]);
          setLandingLocations(responseData.data[0]?.destination);
          setLandingId(responseData[0]?.landingLocationId);
        }
        console.log("🚀 ~~ responseData:", responseData.data[0]);
        const formattedTravelDate = dayjs(responseData?.data[0]?.travelDate).format("DD-MM-YYYY");
        if (formattedTravelDate == todaysDate) {
          setMessage(messages?.m1 || "Please make payment in the counter to confirm the booking");
        } else {
          setMessage(messages?.m2 || "Please make payment in the counter to confirm the booking");
        }

        if (responseData?.data.bookingMode == "PK") {
          const fields = [
            {
              label: "First Name",
              key: responseData?.data[0]?.firstName + " " + responseData.data[0]?.lastName,
            },
            { label: "Phone Number", key: responseData.data[0]?.phoneNumber },
            { label: "Date of Travelling", key: formattedTravelDate },
            { label: "Departure Time", key: responseData.data[0]?.travelTime },
            { label: "Pickup Location", key: responseData.data[0]?.source?.sourceName },
            { label: "Destination", key: responseData.data[0]?.destination?.locationName },
            {
              label: "Vehicle",
              key: `${responseData.data[0]?.texiType?.typeName}(
                ${responseData.data[0]?.texiType?.hasAc ? "Ac" : "Non Ac"}
              )`,
            },
            { label: "Passengers", key: responseData.data[0]?.noOfPassengers },
            { label: "Token", key: responseData.data[0]?.token },
            // { label: "Travel Date", key: responseData.data[0]?.travelDate },
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
            { label: "Date of Travelling", key: formattedTravelDate },
            { label: "Departure Time", key: responseData.data[0]?.travelTime },
            { label: "Pickup Location", key: responseData.data[0]?.source?.sourceName },
            { label: "Destination", key: responseData.data[0]?.destination?.locationName },
            { label: "Drop Point", key: getLandingName(responseData?.data[0]) },
            {
              label: "Vehicle",
              key: `${responseData.data[0]?.texiType?.typeName}(
                ${responseData.data[0]?.texiType?.hasAc ? "Ac" : "Non Ac"}
              )`,
            },
            { label: "Passengers", key: responseData.data[0]?.noOfPassengers },
            { label: "Token", key: responseData.data[0]?.token },
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
            { label: "Date of Travelling", key: formattedTravelDate },
            { label: "Departure Time", key: responseData.data[0]?.travelTime },
            { label: "Pickup Location", key: responseData.data[0]?.startingLocation?.sourceName },
            { label: "Destination", key: responseData.data[0]?.destination?.standName },
            { label: "Passengers", key: responseData.data[0]?.noOfPassengers },
            { label: "Token", key: responseData.data[0]?.token },
            // { label: "Destination", key: responseData.data[0]?.destination },
          ];
          setBookingData(fields);
          setButtonStatus(responseData?.data[0]?.bookingStatus);
        }
      } catch (error) {
        console.log("🚀 ~ file: BookingStatus.js:118 ~ fetchBooking ~ error:", error);
      }
    };
    fetchBooking();
  }, [bookingId, messages, submitted]);
  const handleNewBookingClick = () => {
    navigate("/BookingPage");
  };

  const [feedback, setFeedback] = useState();
  const submitHandler = async () => {
    if (feedback == "") {
      console.log("worked1");
      return;
    } else {
      console.log("worked");
      const formData = { _id: _id, remark: feedback };
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/user/update-remark`,
          "PUT",
          JSON.stringify(formData),
          { "Content-Type": "application/json" }
        );
        if (responseData) {
          navigate(`/booking/${responseData?.data?.token}`);
          setSubmitted(!submitted);
        }
      } catch (error) {
        console.log(error, "here");
      }
      setFeedback("");
      return;
    }
  };
  useEffect(() => {
    setFeedback(booking?.remark);
  }, [booking._id]);
  return (
    <MDBox
      // minHeight="100vh"
      // width={{ lg: 1200, xs: "100vw" }}
      sx={{ width: { xs: "90vw", lg: 800 } }}
    >
      {(isLoading || !BookingData) && <Animations />}
      {!isLoading && BookingData && (
        <MKBox
          bgColor="white"
          borderRadius="xl"
          shadow="lg"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          mt={{ xs: 0, sm: 0, md: 0 }}
          mb={{ xs: 5, sm: 10, md: 2 }}
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
            <MKTypography variant="h5" color="white">
              Booking Request
            </MKTypography>
          </MKBox>
          <MKBox pt={2} pb={1} px={3} position="relative">
            <MKBox component="form" role="form">
              <Grid container spacing={1}>
                {BookingData &&
                  BookingData.map((field, index) => {
                    return (
                      <Grid item xs={12} md={6} key={index}>
                        <MKBox
                          mb={2}
                          bgColor="white"
                          display="flex"
                          alignItems="center"
                          sx={{ border: "1px solid black" }}
                          // color="white"
                          px={2}
                          borderRadius="lg"
                          style={{ position: "relative" }}
                        >
                          <MKBox width="100%" pb={1} pt={2}>
                            <MKTypography
                              style={{ position: "absolute", top: 5, left: 5 }}
                              // style={{ textAlign: "center" }}
                              variant="caption"
                              fontWeight="medium"
                              color="black"
                              width="50%"
                            >
                              {field.label}
                            </MKTypography>
                            <MKTypography
                              style={{ textAlign: "center" }}
                              variant="body2"
                              fontWeight="medium"
                              color="black"
                            >
                              {field.key}
                            </MKTypography>
                          </MKBox>
                        </MKBox>
                      </Grid>
                    );
                  })}
              </Grid>
            </MKBox>
            <MKBox mb={1}>
              {message && (
                <MKTypography
                  color="primary"
                  variant="body2"
                  style={{ textAlign: "center", textDecoration: "underline" }}
                  fontWeight="medium"
                >
                  Note: **{message}
                </MKTypography>
              )}
            </MKBox>
            {!booking?.remark ? (
              <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={12}>
                  <MKTypography variant="body2" color="text">
                    Do you have any special instruction for the ride?
                  </MKTypography>
                  <MKBox mb={1}>
                    {/* <textarea
                  rows="2"
                  style={{
                    width: "100%",
                    padding: "10px",
                    overflowY: "auto",
                    resize: "none",
                  }}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                /> */}
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Enter your remarks"
                      multiline
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      maxRows={8}
                      fullWidth
                    />
                  </MKBox>
                  <MKBox
                    mb={1}
                    mt={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={3}
                    sx={{ flexDirection: { xs: "column", md: "row" } }}
                  >
                    <MKButton variant="gradient" color="info" onClick={submitHandler}>
                      Submit Remark
                    </MKButton>
                    <MKButton
                      variant="gradient"
                      color="info"
                      onClick={handleNewBookingClick}
                      // sx={{ ml: {xs:} }}
                    >
                      <AddBox /> Create a new Booking{" "}
                    </MKButton>
                  </MKBox>
                </Grid>
                {/* <Grid item xs={12} md={4}>
              <MKBox mb={2} mt={2}></MKBox>
            </Grid> */}
              </Grid>
            ) : (
              <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={12}>
                  <MKTypography variant="body2" color="text" mb={1}>
                    Special instruction for the ride
                  </MKTypography>
                  <MKBox mb={2}>
                    {/* <textarea
                    rows="2"
                    style={{
                      width: "100%",
                      padding: "10px",
                      overflowY: "auto",
                      resize: "none",
                    }}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  /> */}
                    {/* <TextField
                      id="outlined-multiline-flexible"
                      label="Enter your remarks"
                      multiline
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      maxRows={8}
                      fullWidth
                    /> */}
                    <MKTypography variant="caption" color="text">
                      {booking?.remark}
                    </MKTypography>
                  </MKBox>
                  <MKBox mb={2} mt={2} display="flex" justifyContent="center">
                    {/* <MKButton variant="gradient" color="info" onClick={submitHandler}>
                      Change Remark
                    </MKButton> */}
                    <MKButton
                      variant="gradient"
                      color="info"
                      onClick={handleNewBookingClick}
                      sx={{ ml: 5 }}
                    >
                      <AddBox /> Create a new Booking{" "}
                    </MKButton>
                  </MKBox>
                </Grid>
                {/* <Grid item xs={12} md={4}>
                <MKBox mb={2} mt={2}></MKBox>
              </Grid> */}
              </Grid>
            )}
            <MKBox
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              {booking?.token?.startsWith("BS") && booking?.isShared && messages?.note ? (
                <MKTypography
                  variant="body2"
                  // component={"i"}
                  style={{ textAlign: "center" }}
                  fontWeight="medium"
                  display="block"
                  mb={1}
                >
                  {messages?.note}
                </MKTypography>
              ) : null}
              <MKTypography
                variant="body2"
                component={"i"}
                style={{ textAlign: "center" }}
                fontWeight="medium"
              >
                Please note that this is just a booking request, not confirmation. Booking will be
                confirmed only after making payment in the counter
              </MKTypography>
            </MKBox>
          </MKBox>
        </MKBox>
      )}
    </MDBox>
  );
};

export default BookingConfirmationForm;
