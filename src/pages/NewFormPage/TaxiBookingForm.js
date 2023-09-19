/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from "@mui/material";
import { DateField, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import MKInput from "components/MKInput";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import { useHttpClient } from "hooks/http-hook";
import { useFormik } from "formik";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const TaxiBookingForm = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const handleNext = () => {
    setIsNextDisabled(true);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const [Locations, setLocations] = useState();
  const [LocationData, setLocationData] = useState();
  const [landingLocationList, setLandingLocationList] = useState();
  const [taxiTypeList, setTaxiTypeList] = useState();
  const [landingLocationsData, setLandingLocationsData] = useState();
  const [filteredTaxiTypeList, setFilteredTaxiTypeList] = useState();

  //Values
  const [selectedLocation, setLocation] = React.useState("");
  const [selectedLandingLocation, setSelectedLandingLocation] = useState("");
  const [tollCost, setTollCost] = useState();
  const [selectedTaxiType, setSelectedTaxiType] = useState({});
  //
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    const landingLocationList = LocationData.filter((item) => item._id == event.target.value);
    setTollCost(landingLocationList[0].tollCost);
    setLandingLocationsData(landingLocationList[0].landingLocations);
    const landList = landingLocationList[0].landingLocations.map((item) => {
      return { landingLocation: item.place, id: item._id };
    });
    setLandingLocationList(landList);
  };
  const handleLandingLocationChange = (e) => {
    setSelectedLandingLocation(e.target.value);
    const dataOfLandingLocation = landingLocationsData
      .filter((item) => e.target.value == item._id)
      .map((filteredItem) => filteredItem.taxiFares);
    const taxiTypes = taxiTypeList.filter((item1) =>
      dataOfLandingLocation[0].some((item2) => item1._id === item2.vehicleType)
    );
    taxiTypes.forEach((taxiType) => {
      const fairData = dataOfLandingLocation[0].find((item) => item.vehicleType === taxiType._id);
      if (fairData) {
        taxiType.fair = fairData.fare; // Assuming "fair" is the property you want to add
      }
    });
    setFilteredTaxiTypeList(taxiTypes);
  };
  const handleTaxiChange = (e) => {
    const value = e.target.value;
    setSelectedTaxiType(value);
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
    const fetchTaxiType = async () => {
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/admin/taxi-types`
        );
        setTaxiTypeList(responseData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTaxiType();
  }, []);
  const [dateOfTraveling, setDateOfTraveling] = useState(null);
  const [departureTime, setDepartureTime] = useState("00:00");
  const [fullName, setFullName] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState();
  const [mobileNo, setMobileNo] = useState();
  const handleFullName = (e) => {
    const a = e.target.value.split(" ");
    setFullName(e.target.value);
    setFirstName(a[0]);
    setLastName(a[1]);
  };
  const timeHandler = (e) => {
    setDepartureTime(e.target.value);
  };
  const mobileNOHandler = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, "");
    setMobileNo(inputValue);
  };

  const handleDateChange = (newValue) => {
    setDateOfTraveling(newValue);
  };
  const [noOfPassengers, setNoOfPassengers] = useState(0);
  useEffect(() => {
    if (
      activeStep == 0 &&
      tollCost &&
      selectedLocation &&
      selectedLandingLocation &&
      selectedTaxiType.fair
    ) {
      setIsNextDisabled(false);
    }
    if (activeStep == 1 && dateOfTraveling && departureTime && fullName && mobileNo) {
      setIsNextDisabled(false);
    }
  }, [
    activeStep,
    tollCost,
    selectedLocation,
    selectedTaxiType,
    dateOfTraveling,
    departureTime,
    fullName,
    mobileNo,
  ]);
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const submitHandler = async () => {
    let formData = {
      firstName: firstName,
      lastName: lastName || " ",
      phoneNumber: mobileNo,
      travelDate: dateOfTraveling,
      travelTime: departureTime,
      source: "Delhi",
      destination: selectedLocation,
      noOfPassengers: noOfPassengers,
      texiType: selectedTaxiType._id,
      fare: selectedTaxiType.fair + tollCost,
      paymentMode: "online",
      additionalCharges: tollCost,
      confirmed: false,
      bookingStatus: "pending",
    };
    if (checked) {
      formData.bookingType = "package";
    }
    try {
      const responseData = await sendRequest(
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_BACKEND_URL}/user/bookTaxi`,
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
      <MKTypography variant="body2" color="text" mb={3}></MKTypography>
      <MKBox
        width="100%"
        component="form"
        method="post"
        autoComplete="off"
        // onSubmit={submitHandler}
      >
        <Grid container spacing={1}>
          {activeStep == 0 && (
            <Grid container spacing={2} display="flex" justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
                  <MKInput
                    name="source"
                    type="text"
                    label="From"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value="Delhi"
                    default
                    disabled
                    required
                  />
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
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      sx={{ minHeight: 45, minWidth: 270 }}
                    >
                      {Locations &&
                        Locations.map((item, idx) => (
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
                    <InputLabel id="landingLocation">Landing Location</InputLabel>
                    <Select
                      labelId="landingLocation"
                      id="landingLocation"
                      value={selectedLandingLocation.typeName}
                      label="landingLocation"
                      onChange={handleLandingLocationChange}
                      sx={{ minHeight: 45, minWidth: 270 }}
                    >
                      {landingLocationList &&
                        landingLocationList.map((item, idx) => (
                          <MenuItem key={idx} value={item.id}>
                            {item.landingLocation}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
                  <FormControl required sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="taxiType">Taxi Type</InputLabel>
                    <Select
                      labelId="taxiType"
                      id="taxiType"
                      value={selectedTaxiType}
                      label="taxiType"
                      onChange={handleTaxiChange}
                      sx={{ minHeight: 45, minWidth: 270 }}
                    >
                      {filteredTaxiTypeList &&
                        filteredTaxiTypeList.map((item, idx) => (
                          <MenuItem key={idx} value={item}>
                            {item.typeName} {item.hasAc == true ? "Ac" : "Non - Ac"}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
            </Grid>
          )}
          {activeStep === 1 && (
            <Grid container spacing={2} display="flex" justifyContent="center" alignItems="center">
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
        </Grid>
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
              <Grid item xs={12} sm={12} md={1}>
                <MKBox mb={2}>
                  <MKInput
                    variant="standard"
                    type="text"
                    label="Toll"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={tollCost || 0}
                    disabled
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={1}>
                <MKBox mb={2}>
                  <MKInput
                    variant="standard"
                    type="text"
                    label="Fair"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={selectedTaxiType.fair || 0}
                    disabled
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={1}>
                <MKBox mb={2}>
                  <MKInput
                    variant="standard"
                    type="text"
                    label="Total Fair"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={selectedTaxiType.fair + tollCost || 0}
                    disabled
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
                  <MKInput
                    variant="standard"
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
              {/* <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
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
                    label="Toll"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={tollCost || 0}
                    disabled
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
                  <MKInput
                    variant="standard"
                    type="text"
                    label="Fair"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={selectedTaxiType.fair || 0}
                    disabled
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
                  <MKInput
                    variant="standard"
                    type="text"
                    label="Total Fair"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={selectedTaxiType.fair + tollCost || 0}
                    disabled
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
                  <MKInput
                    type="text"
                    variant="standard"
                    label="Selected Taxi Type"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={
                      selectedTaxiType.typeName +
                      (selectedTaxiType.hasAc === true ? " - Ac" : " - Non - Ac")
                    }
                    disabled
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <MKBox mb={2}>
                  <MKInput
                    variant="standard"
                    type="number"
                    label="No of Passengers"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    name="noOfPassengers"
                    value={noOfPassengers || 0}
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
      </MKBox>
    </MKBox>
  );
};

export default TaxiBookingForm;
