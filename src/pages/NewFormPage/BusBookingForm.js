/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { useHttpClient } from "hooks/http-hook";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BusBookingForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [termsChecked, setTermsChecked] = useState(true);
  const handleTermsChange = (event) => {
    setTermsChecked(event.target.checked);
    if (event.target.checked == false) {
      setIsNextDisabled(true);
    }
  };
  // eslint-disable-next-line no-unused-vars
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const handleNext = () => {
    setIsNextDisabled(true);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsNextDisabled(false);
  };
  const [Locations, setLocations] = useState();
  const [LocationData, setLocationData] = useState();
  const [selectedLocationName, setSelectedLocationName] = useState();
  //Active Step == 0
  const [startingLocation, setStartingLocation] = useState("Delhi");
  const [selectedLocation, setLocation] = useState("");
  const [selectedBusType, setSelectedBusType] = useState("Book Complete Bus");
  const [noOfPassengers, setNoOfPassengers] = useState(0);
  const [dateOfTraveling, setDateOfTraveling] = useState(null);
  // const [departureTime, setDepartureTime] = useState("00:00");
  const [departureTime, setDepartureTime] = useState("");
  const [fullName, setFullName] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState();
  const [mobileNo, setMobileNo] = useState();

  const [selectedSourceLocation, setSelectedSourceLocation] = React.useState("");

  const handleSourceLocationChange = (event) => {
    setSelectedSourceLocation(event.target.value);
  };

  const [sourcseLocation, setSourceLocation] = useState([]);
  const [sourcseLocationData, setSourceLocationData] = useState();
  const [formateDate, setFormateDate] = useState();
  useEffect(() => {
    const fetchSourceLocation = async () => {
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/admin/source`
        );
        setSourceLocationData(responseData.data);

        const locationNames = responseData.data?.map((item) => {
          return { name: item.sourceName, id: item._id };
        });

        setSourceLocation(locationNames);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSourceLocation();
  }, []);

  const selectedSeatHandler = (e) => {
    setNoOfPassengers(e.target.value);
  };
  const handleLocationChange = (event) => {
    setSelectedLocationName(event.target.value.name);
    setLocation(event.target.value.id);
  };
  const handleDateChange = (newValue) => {
    setDateOfTraveling(newValue);
    const day = newValue.$d.getDate().toString().padStart(2, "0");
    const month = (newValue.$d.getMonth() + 1).toString().padStart(2, "0"); // Note: Months are 0-based, so we add 1.
    const year = newValue.$d.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setFormateDate(formattedDate);
  };

  const [formattedTime, setFormattedTime] = useState("");

  const timeHandler = (e) => {
    console.log("time", e.target.value);
    setDepartureTime(e.target.value);
    const inputTime = e.target.value; // Assuming e.target.value contains the time in 24-hour format (e.g., "15:30")

    // Split the input time into hours and minutes
    const [hours, minutes] = inputTime.split(":");

    // Create a Date object with the input time
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    // Format the time in 12-hour format with AM/PM
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formatted = date.toLocaleTimeString(undefined, options);

    // Set the formatted time in state
    setFormattedTime(formatted);
    console.log("formatted", formattedTime);
  };

  const handleFullName = (e) => {
    const a = e.target.value.split(" ");
    setFullName(e.target.value);
    setFirstName(a[0]);
    setLastName(a[1]);
  };
  const mobileNOHandler = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, "");
    setMobileNo(inputValue);
  };
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/admin/location`
        );
        setLocationData(responseData.data);
        const locationNames = responseData.data.map((item) => {
          return { name: item.locationName, id: item._id };
        });
        setLocations(locationNames);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocation();
  }, []);
  useEffect(() => {
    if (
      activeStep == 0 &&
      startingLocation &&
      selectedLocation &&
      selectedBusType &&
      noOfPassengers &&
      termsChecked
    ) {
      setIsNextDisabled(false);
    }

    if (
      activeStep == 1 &&
      dateOfTraveling &&
      departureTime &&
      fullName &&
      mobileNo &&
      mobileNo.length > 9 &&
      termsChecked
    ) {
      setIsNextDisabled(false);
    }
    if (mobileNo && mobileNo.length < 10) {
      setIsNextDisabled(true);
    }
  }, [
    startingLocation,
    selectedLocation,
    selectedBusType,
    noOfPassengers,
    dateOfTraveling,
    departureTime,
    firstName,
    mobileNo,
    termsChecked,
  ]);
  const submitHandler = async () => {
    const formData = {
      firstName: firstName,
      lastName: lastName || " ",
      phoneNumber: mobileNo,
      travelDate: dateOfTraveling,
      // travelTime: departureTime,
      travelTime: formattedTime,
      startingLocation: selectedSourceLocation,
      destination: selectedLocationName,
      noOfPassengers: Number(noOfPassengers),
      fare: 2000,
    };
    try {
      const responseData = await sendRequest(
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_BACKEND_URL}/user/bookBus`,
        "POST",
        JSON.stringify(formData),
        { "Content-Type": "application/json" }
      );
      if (responseData) {
        navigate(`/booking/${responseData?.data?.token}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MKBox p={3}>
      <MKTypography variant="body2" color="text" mb={3}>
        <MKBox
          width="100%"
          component="form"
          method="post"
          autoComplete="off"
          // onSubmit={submitHandler}
        >
          <Grid container spacing={1}>
            {activeStep == 0 && (
              <Grid
                container
                spacing={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={12} md={3}>
                  <MKBox mb={2}>
                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="destination">From</InputLabel>
                      <Select
                        name="source"
                        labelId="source"
                        id="source"
                        value={selectedSourceLocation}
                        onChange={handleSourceLocationChange}
                        sx={{ minHeight: 45, minWidth: 270 }}
                      >
                        {sourcseLocation &&
                          sourcseLocation.map((item, idx) => (
                            <MenuItem key={idx} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <MKBox mb={2}>
                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="destination">To</InputLabel>
                      <Select
                        name="destination"
                        labelId="destination"
                        id="destination"
                        value={selectedLocation.name}
                        onChange={handleLocationChange}
                        sx={{ minHeight: 45, minWidth: 270 }}
                      >
                        {Locations &&
                          Locations.map((item, idx) => (
                            <MenuItem key={idx} value={item}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <MKBox mb={2}>
                    <FormControl required sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="busType">Bus Type</InputLabel>
                      <Select
                        name="busType"
                        labelId="busType"
                        id="busType"
                        value={selectedBusType}
                        onChange={(e) => setSelectedBusType(e.target.value)}
                        sx={{ minHeight: 45, minWidth: 270 }}
                      >
                        <MenuItem value="Book Complete Bus">BookCompleteBus</MenuItem>
                        <MenuItem value="Book Seats">Book Seats</MenuItem>
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid>
                {selectedBusType == "Book Complete Bus" && (
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <FormControl required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="busSeats">Select Seats</InputLabel>
                        <Select
                          name="busSeats"
                          labelId="busSeats"
                          id="busSeats"
                          value={noOfPassengers}
                          onChange={selectedSeatHandler}
                          sx={{ minHeight: 45, minWidth: 270 }}
                        >
                          <MenuItem value={0}>0 Seats</MenuItem>
                          <MenuItem value={35}>35 Seater Bus</MenuItem>
                          <MenuItem value={40}>40 Seater Bus</MenuItem>
                          <MenuItem value={45}>45 Seater Bus</MenuItem>{" "}
                          <MenuItem value={50}>50 Seater Bus</MenuItem>
                        </Select>
                      </FormControl>
                    </MKBox>
                  </Grid>
                )}
                {selectedBusType == "Book Seats" && (
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        type="number"
                        label="No of Passengers"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        name="noOfPassengers"
                        value={noOfPassengers || 0}
                        onChange={(e) => setNoOfPassengers(e.target.value)}
                        required
                      />
                    </MKBox>
                  </Grid>
                )}
              </Grid>
            )}
            {activeStep == 1 && (
              <Grid
                container
                spacing={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={6} md={3}>
                  <MKBox mb={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "100%" }}
                          label="Date of Traveling"
                          name="dateOfTraveling"
                          value={dateOfTraveling}
                          onChange={handleDateChange}
                          required
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <MKBox mb={2}>
                    <MKInput
                      type="time"
                      label="Departure Time"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="departureTime"
                      value={departureTime}
                      onChange={timeHandler}
                      required
                      sx={{ pointer: "cursor" }}
                    />
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      label="Full Name"
                      fullWidth
                      name="firstName"
                      required
                      value={fullName}
                      onChange={handleFullName}
                    />
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <MKBox mb={2}>
                    <MKInput
                      type="tel"
                      label="Mobile no"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="mobileNo"
                      required
                      value={mobileNo}
                      onChange={mobileNOHandler}
                    />
                  </MKBox>
                </Grid>
              </Grid>
            )}
            <Grid container spacing={2}>
              {activeStep === 1 || activeStep === 0 ? (
                <Grid
                  container
                  spacing={2}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="self-start"
                  sx={{ mx: 1, mt: 0.5 }}
                >
                  <Grid item xs={12} sm={12} md={2}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="bookingType"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={selectedBusType}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="number"
                        label="No of Seats Booked"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={noOfPassengers}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <MKBox>
                      <FormControlLabel
                        required
                        control={<Checkbox />}
                        sx={{ display: "flex" }}
                        label="Accept terms and conditions"
                        checked={termsChecked}
                        onChange={handleTermsChange}
                      />
                    </MKBox>
                  </Grid>
                </Grid>
              ) : null}
              {activeStep == 2 && (
                <Grid
                  container
                  spacing={2}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="self-start"
                  sx={{ mx: 1, mt: 0.5 }}
                >
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Name"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={fullName}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Mobile No"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={mobileNo}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Booking Type"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={selectedBusType}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="number"
                        label="No of Seats Booked"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={noOfPassengers}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="From"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={startingLocation}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="To"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={selectedLocationName}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formateDate}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formattedTime}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                </Grid>
              )}
              <Grid container item justifyContent="center" xs={12} mt={0} mb={2}>
                {activeStep === 2 ? (
                  <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 0 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>{" "}
                    <MKButton onClick={submitHandler} variant="gradient" color="info">
                      Confirm Booking{" "}
                    </MKButton>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {/* <Button onClick={handleReset}>Reset</Button> */}
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 0 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Button onClick={handleNext} disabled={isNextDisabled}>
                        Next
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          </Grid>
        </MKBox>
      </MKTypography>
    </MKBox>
  );
};

export default BusBookingForm;
