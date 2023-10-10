/* eslint-disable no-unused-vars */
import {
  AccountCircle,
  BusAlertOutlined,
  ExpandMoreOutlined,
  LocationCityOutlined,
  MapsHomeWorkOutlined,
  Person2Outlined,
  PhoneCallbackOutlined,
  Remove,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { ClockIcon, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Input from "assets/theme/components/form/input";
import MDInput from "components/MDInput";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import dayjs from "dayjs";
import { useHttpClient } from "hooks/http-hook";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BusBookingForm = ({ setHideButton }) => {
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
  const [selectedBusType, setSelectedBusType] = useState("seats");
  const [noOfPassengers, setNoOfPassengers] = useState(1);
  const [dateOfTraveling, setDateOfTraveling] = useState(dayjs());
  // const [departureTime, setDepartureTime] = useState("00:00");
  const [departureTime, setDepartureTime] = useState("");
  const [fullName, setFullName] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState();
  const [mobileNo, setMobileNo] = useState();

  const [selectedSourceLocation, setSelectedSourceLocation] = React.useState("");
  const [matchedLocations, setMatchedLocations] = useState([]);

  const handleSourceLocationChange = (event) => {
    const newValue = event.target.value;
    setSelectedSourceLocation(newValue);
    setMatchedLocations([]);

    const newMatchedLocations = [];

    console.log("Locations", LocationData);

    LocationData.forEach((location) => {
      location?.list?.forEach((item) => {
        if (item.source._id === newValue) {
          // Found a match! Do something with the item.
          console.log("Found a match:", item);
          newMatchedLocations.push(location);
        }
      });
    });

    setMatchedLocations(newMatchedLocations);
  };

  console.log("Matched", matchedLocations);

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
  const [perSeatFare, setPerSeatFare] = useState("");
  const [fare35, setFare35] = useState("");
  const [fare40, setFare40] = useState("");
  const [fare45, setFare45] = useState("");
  const [fare50, setFare50] = useState("");

  const [sharedSlots, setSharedSlots] = useState([]);

  const handleLocationChange = (event) => {
    setSelectedLocationName(event.target.value.standName);
    setLocation(event.target.value._id);
    const selected = LocationData?.find((location) => location._id === event.target.value._id);
    // console.log("Selected", selected?.slots);

    const fareList = selected?.list?.find((l) => l?.source._id === selectedSourceLocation);
    console.log("fareList", fareList);
    setSharedSlots(fareList?.slots);
    setPerSeatFare(fareList?.perSeatFair);
    setFare35(fareList?.seater35Fair);
    setFare40(fareList?.seater40Fair);
    setFare45(fareList?.seater45Fair);
    setFare50(fareList?.seater50Fair);
  };
  console.log("Slots", sharedSlots);
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
    if (inputValue.length <= 10) {
      setMobileNo(inputValue);
    }
  };

  const format12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    const period = hours < 12 ? "AM" : "PM";
    return `${formattedHours}:${minutes} ${period}`;
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/admin/bus-stand`
        );
        setLocationData(responseData.data);
        const locationNames = responseData.data.map((item) => {
          return { name: item.standName, id: item._id };
        });
        setLocations(locationNames);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocation();
  }, []);
  console.log("Departuree time", departureTime);
  useEffect(() => {
    if (
      activeStep == 0 &&
      startingLocation &&
      selectedLocation &&
      // selectedBusType &&
      noOfPassengers
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

  useEffect(() => {
    if (activeStep === 2) {
      setHideButton(true);
    } else {
      setHideButton(false);
    }
  }, [activeStep]);
  const submitHandler = async () => {
    console.log(
      "fate",
      selectedBusType !== "full_bus"
        ? perSeatFare * noOfPassengers
        : noOfPassengers === 35
        ? fare35
        : noOfPassengers === 40
        ? fare40
        : noOfPassengers === 45
        ? fare45
        : fare50
    );
    const formData = {
      firstName: firstName,
      lastName: lastName || " ",
      phoneNumber: mobileNo,
      travelDate: dateOfTraveling,
      travelTime: selectedBusType === "full_bus" ? formattedTime : format12Hour(departureTime),
      // travelTime: formattedTime,
      startingLocation: selectedSourceLocation,
      destination: selectedLocation,
      noOfPassengers: Number(noOfPassengers),
      fare:
        selectedBusType !== "full_bus"
          ? perSeatFare * noOfPassengers
          : noOfPassengers === 35
          ? fare35
          : noOfPassengers === 40
          ? fare40
          : noOfPassengers === 45
          ? fare45
          : fare50,
      isShared: selectedBusType === "full_bus" ? false : true,
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
          minHeight="33vh"
          method="post"
          autoComplete="off"
          // onSubmit={submitHandler}
        >
          <Grid container spacing={1}>
            {activeStep == 0 && (
              <Grid
                container
                spacing={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} md={12} display={"flex"} justifyContent={"end"}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          size="large"
                          onChange={() => {
                            // Toggle the state based on its current value
                            setSelectedBusType((prevType) =>
                              prevType === "full_bus" ? "seats" : "full_bus"
                            );
                          }}
                          checked={selectedBusType === "full_bus"}
                        />
                      }
                      label="Reserve Full Bus"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <MKBox mb={2}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                      <InputLabel id="destination">Select Starting Location</InputLabel>
                      <Select
                        name="source"
                        id="source"
                        value={selectedSourceLocation}
                        placeholder="Pickup Location"
                        onChange={handleSourceLocationChange}
                        // sx={{ minHeight: 45, minWidth: 270 }}
                        sx={{ minHeight: 45, minWidth: 270 }}
                        startAdornment={
                          <InputAdornment position="start">
                            <MapsHomeWorkOutlined fontSize="medium" />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="start">
                            <ExpandMoreOutlined />
                          </InputAdornment>
                        }
                        fullWidth
                      >
                        {sourcseLocation &&
                          sourcseLocation.map((item, idx) => (
                            <MenuItem key={idx} value={item.id} display="flex">
                              <MKTypography variant="p">{item.name}</MKTypography>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <MKBox mb={2}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                      <InputLabel id="destination">Destination</InputLabel>
                      <Select
                        name="destination"
                        labelId="destination"
                        id="destination"
                        value={selectedLocation.standName}
                        onChange={handleLocationChange}
                        sx={{ minHeight: 45, minWidth: 270 }}
                        startAdornment={
                          <InputAdornment position="start">
                            <LocationCityOutlined fontSize="medium" />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="start">
                            <ExpandMoreOutlined />
                          </InputAdornment>
                        }
                      >
                        {matchedLocations &&
                          matchedLocations.map((item, idx) => (
                            <MenuItem key={idx} value={item}>
                              {item.standName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid>
                {/* <Grid item xs={12} sm={12} md={4}>
                  <MKBox mb={2}>
                    <FormControl variant="standard" required sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="busType">Bus Type</InputLabel>
                      <Select
                        name="busType"
                        labelId="busType"
                        id="busType"
                        value={selectedBusType}
                        onChange={(e) => setSelectedBusType(e.target.value)}
                        sx={{ minHeight: 45, minWidth: 270 }}
                        startAdornment={
                          <InputAdornment position="start">
                            <BusAlertOutlined color="info" fontSize="medium" />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="start">
                            <ExpandMoreOutlined />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="Book Complete Bus">BookCompleteBus</MenuItem>
                        <MenuItem value="Book Seats">Book Seats</MenuItem>
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid> */}
                {/* {selectedBusType === "full_bus" ? (
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <FormControl variant="standard" required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="busSeats">Select Seats</InputLabel>
                        <Select
                          name="busSeats"
                          labelId="busSeats"
                          id="busSeats"
                          // value={noOfPassengers}
                          onChange={selectedSeatHandler}
                          sx={{ minHeight: 45, minWidth: 270 }}
                          startAdornment={
                            <InputAdornment position="start">
                              <BusAlertOutlined color="info" fontSize="medium" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="start">
                              <ExpandMoreOutlined />
                            </InputAdornment>
                          }
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
                ) : (
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
                )} */}
                {/* {selectedBusType === "full_bus" && (
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <FormControl variant="standard" required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="busSeats">Select Bus Size</InputLabel>
                        <Select
                          name="busSeats"
                          labelId="busSeats"
                          id="busSeats"
                          value={noOfPassengers}
                          onChange={selectedSeatHandler}
                          sx={{ minHeight: 45, minWidth: 270 }}
                          startAdornment={
                            <InputAdornment position="start">
                              <BusAlertOutlined color="info" fontSize="medium" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="start">
                              <ExpandMoreOutlined />
                            </InputAdornment>
                          }
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
                )} */}
                {selectedBusType === "full_bus" && (
                  <Grid item xs={12} sm={12} md={4}>
                    <MKBox mb={2}>
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                        <InputLabel id="destination">Select Bus Size</InputLabel>
                        <Select
                          name="destination"
                          labelId="destination"
                          id="destination"
                          value={noOfPassengers}
                          onChange={(e) => {
                            setNoOfPassengers(e.target.value);
                          }}
                          sx={{ minHeight: 45, minWidth: 270 }}
                          startAdornment={
                            <InputAdornment position="start">
                              <BusAlertOutlined fontSize="medium" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="start">
                              <ExpandMoreOutlined />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value={35}>35 Seater Bus</MenuItem>
                          <MenuItem value={40}>40 Seater Bus</MenuItem>
                          <MenuItem value={45}>45 Seater Bus</MenuItem>
                          <MenuItem value={50}>50 Seater Bus</MenuItem>
                        </Select>
                      </FormControl>
                    </MKBox>
                  </Grid>
                )}
                {selectedBusType !== "full_bus" && (
                  <Grid item xs={12} md={4}>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={12} md={3}>
                        <MKBox
                          display="flex"
                          // flexDirection={{ xs: "column", md: "row" }}
                          // alignItems={{ xs: "start", md: "center" }}
                          alignItems={"center"}
                          justifyContent="start"
                        >
                          <MKBox display="flex" alignItems="center" mr={1} mb={{ xs: 0.5, md: 0 }}>
                            <Person2Outlined fontSize="medium" />
                            <MKTypography variant="h6">Passengers:</MKTypography>
                          </MKBox>
                          {/* <MKInput
                           variant="standard"
                           type="number"
                           // label="Number of Passengers"
                           InputLabelProps={{ shrink: true }}
                           fullWidth
                           name="noOfPassengers"
                           value={noOfPassengers}
                           onChange={handlePassengerChange}
                           sx={{ textAlign: "center" }}
                           // required
                         /> */}
                          <MKBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            ml={1}
                            // sx={{ border: "1px solid grey" }}
                            // px={1}
                            py={0}
                            borderRadius="lg"
                          >
                            <MKBox
                              // size="small"
                              // variant="gradient"
                              // color="info"
                              display="flex"
                              // bgColor="info"
                              justifyContent="center"
                              width="30px"
                              px={3}
                              // sx={{ borderRadius: "25px 0 0 25px " }}
                              onClick={() => {
                                if (noOfPassengers === 1) {
                                  return;
                                }
                                setNoOfPassengers(noOfPassengers - 1);
                              }}
                              sx={{
                                cursor: "pointer",
                                border: "1px solid grey",
                                borderRadius: "15px 0 0 15px",
                                ":hover": {
                                  backgroundColor: "lightgrey",
                                },
                              }}
                              py={1}
                            >
                              {/* <MKBox height="2px" width="14px" bgColor="dark"></MKBox>
                               */}
                              <Remove fontSize="medium" />
                            </MKBox>
                            <MKBox
                              width="60px"
                              display="flex"
                              justifyContent="center"
                              sx={{ borderTop: "1px solid grey", borderBottom: "1px solid grey" }}
                              py={0.9}
                            >
                              <MKTypography variant="body2" fontWeight="medium">
                                {noOfPassengers}
                              </MKTypography>
                            </MKBox>
                            <MKBox
                              // sx={{  }}
                              px={3}
                              display="flex"
                              justifyContent="center"
                              // size="small"
                              // variant="gradient"
                              // color="info"
                              fontSize="20px"
                              width="30px"
                              py={0.9}
                              sx={{
                                cursor: "pointer",
                                border: "1px solid grey",
                                borderRadius: "0 15px 15px 0",
                                ":hover": {
                                  backgroundColor: "lightgrey",
                                },
                              }}
                              // sx={{ borderRadius: "0 25px 25px 0" }}
                              onClick={() => {
                                setNoOfPassengers(noOfPassengers + 1);
                              }}
                            >
                              <MKTypography variant="body2" fontWeight="medium">
                                +
                              </MKTypography>
                            </MKBox>
                          </MKBox>
                        </MKBox>
                      </Grid>
                      {/* <Grid item xs={12} sm={12} md={3}>
                       <MKBox>
                         <FormControlLabel
                           control={
                             <Switch
                               checked={checked}
                               onChange={handleChange}
                               inputProps={{ "aria-label": "controlled" }}
                             />
                           }
                           label="Package"
                         />
                       </MKBox>
                     </Grid> */}
                      {/* <Grid item xs={12} sm={12} md={6}>
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
                     </Grid> */}
                    </Grid>
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
                {selectedBusType !== "full_bus" && (
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      {/* <MDInput
                        type="text"
                        variant="standard"
                        label="Departure Time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        name="departureTime"
                        value={departureTime}
                        onChange={timeHandler}
                        required
                        sx={{ pointer: "cursor" }}
                        endAdornment={
                          <InputAdornment position="start">
                            <ExpandMoreOutlined />
                          </InputAdornment>
                        }
                      /> */}

                      <FormControl variant="standard" fullWidth>
                        <InputLabel id="destination">Select Departure Time</InputLabel>
                        <Select
                          name="destination"
                          labelId="destination"
                          id="destination"
                          value={departureTime}
                          onChange={(e) => {
                            const selectedTime = e.target.value;
                            setDepartureTime(selectedTime);
                          }}
                          sx={{ minHeight: 33, minWidth: 270 }}
                          startAdornment={
                            <InputAdornment position="start">
                              <ClockIcon fontSize="medium" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="start">
                              <ExpandMoreOutlined />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="" disabled>
                            Select
                          </MenuItem>
                          {sharedSlots?.map((slot, i) => (
                            <MenuItem key={i} value={slot}>
                              {format12Hour(slot)}
                            </MenuItem>
                          ))}

                          {/* <MenuItem value="09:00">09:00 AM</MenuItem>
                          <MenuItem value="12:00">12:00 PM</MenuItem>
                          <MenuItem value="15:00">03:00 PM</MenuItem>
                          <MenuItem value="18:00">06:00 PM</MenuItem>
                          <MenuItem value="21:00">09:00 PM</MenuItem>
                          <MenuItem value="00:00">12:00 AM</MenuItem>
                          <MenuItem value="03:00">03:00 AM</MenuItem> */}
                        </Select>
                      </FormControl>
                    </MKBox>
                  </Grid>
                )}
                {selectedBusType === "full_bus" && (
                  <Grid item xs={12} sm={12} md={3}>
                    <MKBox mb={2}>
                      <FormControl variant="standard" fullWidth>
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
                      </FormControl>
                    </MKBox>
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={3}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      variant="standard"
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
                      variant="standard"
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
              {activeStep === 1 ? (
                <Grid
                  container
                  spacing={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mx: 1, mt: 0.5 }}
                >
                  <Grid item xs={12} sm={12} md={12}>
                    <MKBox>
                      <FormControlLabel
                        required
                        control={<Checkbox />}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        label="Accept terms and conditions"
                        checked={termsChecked}
                        onChange={handleTermsChange}
                      />
                    </MKBox>
                  </Grid>
                </Grid>
              ) : null}
              <Grid container mt={4} mb={3}>
                <Grid item xs={12} md={9}></Grid>
                <Grid item xs={12} md={3}>
                  {/* <Grid xs={12} md={3}> */}
                  <MKBox display="flex" justifyContent="end" alignItems="center" gap={1}>
                    <MKBox height="10px" width="10px" borderRadius="50%" bgColor="success"></MKBox>
                    {selectedLocation ? (
                      <MKTypography variant="caption" fontWeight="medium">
                        Fare: &#8377;{" "}
                        {selectedBusType !== "full_bus"
                          ? perSeatFare * noOfPassengers
                          : noOfPassengers === 35
                          ? fare35
                          : noOfPassengers === 40
                          ? fare40
                          : noOfPassengers === 45
                          ? fare45
                          : noOfPassengers === 50
                          ? fare50
                          : "NA"}
                      </MKTypography>
                    ) : (
                      <MKTypography variant="caption" fontWeight="medium">
                        Fare: &#8377; NA
                      </MKTypography>
                    )}
                  </MKBox>
                  {/* </Grid> */}
                </Grid>
              </Grid>
              {activeStep == 2 && (
                <Grid
                  container
                  spacing={2}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="self-start"
                  sx={{ mx: 1, mt: 0.5 }}
                >
                  <Grid item xs={12} sm={6} md={3}>
                    <MKBox mb={{ xs: 0.5, md: 2 }}>
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
                  <Grid item xs={12} sm={6} md={3}>
                    <MKBox mb={{ xs: 0.5, md: 2 }}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Phone Number"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={mobileNo}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
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
                  <Grid item xs={12} sm={12} md={6}>
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
                  <Grid item xs={12} sm={12} md={6}>
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
                  <Grid item xs={12} sm={12} md={6}>
                    {/* <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={dateOfTraveling}
                        disabled
                      />
                    </MKBox> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{ width: "100%" }}
                          label="Date of Traveling"
                          name="dateOfTraveling"
                          value={dateOfTraveling}
                          onChange={handleDateChange}
                          disabled
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <MKBox mb={2}>
                      <MKInput
                        variant="standard"
                        type="text"
                        label="Time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={format12Hour(departureTime)}
                        disabled
                      />
                    </MKBox>
                  </Grid>
                </Grid>
              )}
              <Grid
                container
                item
                justifyContent="center"
                xs={12}
                mt={0}
                mb={2}
                position={"absolute"}
                bottom={2}
              >
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

BusBookingForm.propTypes = {
  setHideButton: PropTypes.func,
};

export default BusBookingForm;
