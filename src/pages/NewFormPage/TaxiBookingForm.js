/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from "@mui/material";
import {
  CalendarIcon,
  DateField,
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
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
import PropTypes from "prop-types";
import {
  AccountCircle,
  CarRentalOutlined,
  ChevronLeftOutlined,
  ExpandMoreOutlined,
  Info,
  LocationCityOutlined,
  MapOutlined,
  MapsHomeWorkOutlined,
  Person2Outlined,
  PhoneCallbackOutlined,
  Remove,
  TaxiAlertOutlined,
  TextDecreaseOutlined,
} from "@mui/icons-material";
import TextField from "assets/theme/components/form/textField";
import MDBox from "components/MDBox";
import TandC from "./TandC";
import moment from "moment/moment";
import toast from "react-hot-toast";
const TaxiBookingForm = ({ setHideButton }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [remark, setRemark] = useState("");
  const navigate = useNavigate();
  const [termsChecked, setTermsChecked] = useState(true);

  const [activeStep, setActiveStep] = React.useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [carrier, setCarrier] = useState(false);

  const handleTermsChange = (event) => {
    setTermsChecked(event.target.checked);
    // if (event.target.checked == false) {
    //   setIsNextDisabled(true);
    // }
  };
  const handleNext = () => {
    setIsNextDisabled(true);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsNextDisabled(false);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const [sourcseLocation, setSourceLocation] = useState([]);
  const [sourcseLocationData, setSourceLocationData] = useState();

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
  const [Locations, setLocations] = useState();
  const [Locations2, setLocations2] = useState();
  const [LocationData, setLocationData] = useState();
  const [landingLocationList, setLandingLocationList] = useState();
  const [taxiTypeList, setTaxiTypeList] = useState();
  const [landingLocationsData, setLandingLocationsData] = useState();
  const [filteredTaxiTypeList, setFilteredTaxiTypeList] = useState();
  const [selectedDestinationName, setSelectedDestinationName] = useState();

  //Values
  const [selectedLocation, setLocation] = useState("");
  const [selectedSourceLocation, setSelectedSourceLocation] = useState("");
  const [selectedLandingLocation, setSelectedLandingLocation] = useState("");
  const [tollCost, setTollCost] = useState(0);
  const [selectedTaxiType, setSelectedTaxiType] = useState({});
  const [noOfPassengers, setNoOfPassengers] = useState(0);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  //
  const handleSourceLocationChange = (event) => {
    const a = sourcseLocation.filter((item) => item.name == event.target.value);
    setSelectedSourceLocation(a[0]);
  };

  useEffect(() => {
    console.log("ALL", Locations2, selectedSourceLocation);
    const filtered = Locations2?.filter((l) => l.source === selectedSourceLocation?.id);
    setLocations(filtered);
  }, [selectedSourceLocation]);

  const [type, setType] = useState("");

  const handleLocationChange = (event) => {
    setLocation(event.target.value);

    console.log("location change", event.target.value);
    const selectedLocation = Locations?.find((location) => location.id === event.target.value);

    setTollCost(selectedLocation?.toll);
    console.log("Taxis", taxiTypeList);
    setAdditionalCharges(
      selectedLocation?.additionalCharge ? selectedLocation.additionalCharge : null
    );

    const taxiTypes = taxiTypeList.filter((item1) =>
      selectedLocation?.fareList?.some((item2) => item1._id === item2.vehicleType)
    );
    taxiTypes.forEach((taxiType) => {
      const fairData = selectedLocation?.fareList?.find(
        (item) => item.vehicleType === taxiType._id
      );
      if (fairData) {
        taxiType.fair = fairData.fare; // Assuming "fair" is the property you want to add
      }
    });
    setFilteredTaxiTypeList(taxiTypes);

    console.log("selected", selectedLocation);
    setType("taxi");
  };

  // useEffect(() => {
  //   const selectedLocation = Locations?.filter((location) => location.id === location);

  //   setType(selectedLocation?.type);
  // }, [location]);

  console.log("locations", Locations);
  console.log("type", type);

  const handleTaxiChange = (e) => {
    const value = e.target.value;
    setSelectedTaxiType(value);
    setNoOfPassengers(0);
    setCarrier(false);
  };

  console.log("selected Landing", selectedLandingLocation);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/admin/location2`
        );
        setLocationData(responseData);

        console.log("Locations244", responseData);

        const locationNames = responseData
          .filter((location) => location.enabled)
          .map((item) => {
            return {
              name: item.locationName,
              id: item._id,
              source: item?.source?._id,
              toll: item?.tollCost,
              fareList: item?.fareList,
            };
          });

        setLocations(locationNames);
        setLocations2(locationNames);
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

  const [formateDate, setFormateDate] = useState("");
  //Values
  const [dateOfTraveling, setDateOfTraveling] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  // const [departureTime, setDepartureTime] = useState(dayjs().set("hour", 12).set("minute", 0));
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
  const [formattedTime, setFormattedTime] = useState(
    dayjs().set("hour", 12).set("minute", 0).format("hh:mm A")
  );
  // const [formattedTime, setFormattedTime] = useState("");

  const timeHandler = (e) => {
    setDepartureTime(e);
    console.log("time", e);
    const formatted = e?.format("hh:mm A");
    console.log("time 2", formatted);

    setFormattedTime(formatted);
  };
  const mobileNOHandler = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, "");
    if (inputValue.length <= 10) {
      setMobileNo(inputValue);
    }
  };

  const handleDateChange = (newValue) => {
    setDateOfTraveling(newValue);
    const day = newValue.$d.getDate().toString().padStart(2, "0");
    const month = (newValue.$d.getMonth() + 1).toString().padStart(2, "0"); // Note: Months are 0-based, so we add 1.
    const year = newValue.$d.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setFormateDate(formattedDate);
  };

  useEffect(() => {
    if (
      activeStep == 0 &&
      // termsChecked &&
      // tollCost &&
      selectedLocation &&
      // selectedLandingLocation &&
      selectedTaxiType.fair
    ) {
      setIsNextDisabled(false);
    }
    if (
      activeStep == 1 &&
      dateOfTraveling &&
      departureTime &&
      fullName &&
      mobileNo &&
      mobileNo.length > 9
    ) {
      setIsNextDisabled(false);
    }
    if (mobileNo && mobileNo.length < 10) {
      setIsNextDisabled(true);
    }
    if (!termsChecked) {
      setIsNextDisabled(true);
    }
    if (noOfPassengers <= 0) {
      setIsNextDisabled(true);
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
    termsChecked,
    noOfPassengers,
  ]);
  //
  const submitHandler = async () => {
    console.log("Date2", dateOfTraveling);
    const dynamicDate = new Date(dateOfTraveling); // Replace this with your dynamically generated date

    if (!/^\d{10}$/.test(mobileNo)) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    const year = dynamicDate.getFullYear();
    const month = dynamicDate.getMonth() + 1; // Months are zero-based, so we add 1
    const day = dynamicDate.getDate();

    const adjustedDynamicDateISO = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString();

    console.log("Adjusted Dynamic Date ISO", adjustedDynamicDateISO);
    let formData = {
      firstName: firstName,
      lastName: lastName || " ",
      phoneNumber: mobileNo,
      travelDate: adjustedDynamicDateISO,
      travelTime: formattedTime,
      source: selectedSourceLocation.id,
      destination: selectedLocation,
      noOfPassengers: noOfPassengers,
      texiType: selectedTaxiType._id,
      fare: selectedTaxiType.fair,
      carrier: carrier,
      // paymentMode: "online",
      additionalCharges: additionalCharges,
      confirmed: false,
      toll: tollCost,
      // bookingStatus: "pending",
      paymentAccepted: false,
      landingLocationId: null,
      remark,
    };
    // if (checked) {
    //   formData.bookingType = "package";
    // }
    try {
      const responseData = await sendRequest(
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_BACKEND_URL}/user/bookTaxi`,
        "POST",
        JSON.stringify(formData),
        { "Content-Type": "application/json" }
      );
      if (responseData) {
        toast.success("Booking request confirmed");
        navigate(`/booking/${responseData?.data?.token}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (activeStep === 2) {
      setHideButton(true);
    } else {
      setHideButton(false);
    }
  }, [activeStep]);

  const [show, setShow] = useState(false);

  return (
    <MKBox p={3}>
      <MKBox
        width="100%"
        minHeight="36vh"
        component="form"
        method="post"
        autoComplete="off"
        // onSubmit={submitHandler}
      >
        <Grid container spacing={1}>
          {activeStep == 0 && (
            <Grid
              container
              // spacing={2}
              display="flex"
              justifyContent="start"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }}>
                  <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                    <InputLabel id="destination">Select Pickup Location</InputLabel>
                    <Select
                      name="source"
                      id="source"
                      value={selectedSourceLocation.name || "Pickup Location"}
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
                    >
                      {sourcseLocation &&
                        sourcseLocation.map((item, idx) => (
                          <MenuItem key={idx} value={item.name} display="flex">
                            <MKTypography variant="p">{item.name}</MKTypography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                    <InputLabel id="destination">Select Destination</InputLabel>
                    <Select
                      name="destination"
                      labelId="destination"
                      id="destination"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      sx={{ minHeight: 45, minWidth: 270 }}
                      startAdornment={
                        <InputAdornment position="start">
                          <MapOutlined fontSize="medium" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="start">
                          <ExpandMoreOutlined />
                        </InputAdornment>
                      }
                    >
                      {Locations &&
                        Locations.map((item, idx) => (
                          <MenuItem key={idx} value={item.id}>
                            <MKTypography variant="p">{item.name}</MKTypography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
              {/* <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={{ xs: 0.5, md: 2 }}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                      <InputLabel id="landingLocation"> Select Drop Point</InputLabel>
                      <Select
                        style={{ backgroundColor: type === "package" ? "#f0f0f0" : "inherit" }}
                        disabled={type === "package"}
                        labelId="landingLocation"
                        id="landingLocation"
                        value={selectedLandingLocation}
                        label="landingLocation"
                        onChange={handleLandingLocationChange}
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
                        {landingLocationList &&
                          landingLocationList.map((item, idx) => (
                            <MenuItem key={idx} value={item.id}>
                              <MKTypography variant="p">{item.landingLocation}</MKTypography>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid> */}
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                    <InputLabel id="taxiType">Select Vehicle</InputLabel>
                    <Select
                      labelId="taxiType"
                      id="taxiType"
                      value={selectedTaxiType?._id ? selectedTaxiType : ""}
                      label="taxiType"
                      onChange={handleTaxiChange}
                      sx={{ minHeight: 45, minWidth: 270 }}
                      startAdornment={
                        <InputAdornment position="start">
                          <TaxiAlertOutlined fontSize="medium" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="start">
                          <ExpandMoreOutlined />
                        </InputAdornment>
                      }
                    >
                      {filteredTaxiTypeList &&
                        filteredTaxiTypeList.map((item, idx) => (
                          // <MenuItem key={idx} value={item}>
                          //   {item.typeName} {item.hasAc == true ? "Ac" : "Non - Ac"}
                          // </MenuItem>
                          <MenuItem key={idx} value={item} display="flex">
                            <MKTypography variant="p">
                              {item.typeName} ({item.hasAc == true ? "Ac" : "Non - Ac"})
                            </MKTypography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
              {selectedTaxiType?._id && selectedTaxiType?.carrier ? (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {/* <FormGroup>  */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        // disabled={!selectedTaxiType?.carrier}
                        defaultChecked={carrier}
                        onChange={(e) => {
                          console.log(e.target.checked);
                          setCarrier(e.target.checked);
                        }}
                      />
                    }
                    label="Include Carrier"
                  />
                  {/* </FormGroup> */}
                </Grid>
              ) : null}
            </Grid>
          )}
          {activeStep === 1 && (
            <Grid container spacing={2} display="flex" justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={6} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }} fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                    <DemoContainer variant="standard" components={["DatePicker"]}>
                      <DatePicker
                        fullWidth
                        sx={{ width: "100%" }}
                        label="Date of Traveling"
                        name="dateOfTraveling"
                        value={dateOfTraveling}
                        disablePast
                        onChange={handleDateChange}
                        format="DD/MM/YYYY"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }} fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                    <DemoContainer variant="standard" components={["MobileTimePicker"]} fullWidth>
                      {/* <DemoItem label="Departue Time"> */}
                      <MobileTimePicker
                        value={departureTime}
                        onChange={(value) => timeHandler(value)}
                        // disablePast
                        fullWidth
                        label="Select Time"
                        sx={{ width: "100%" }}
                        ampmInClock
                      />
                      {/* </DemoItem> */}
                    </DemoContainer>
                  </LocalizationProvider>
                </MKBox>
              </Grid>
              {/* <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={{ xs: 0.5, md: 2 }}>
                    <MKInput
                      type="time"
                      label="Departure Time"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="departureTime"
                      value={departureTime}
                      onChange={timeHandler}
                      sx={{ pointer: "cursor" }}
                    />
                  </MKBox>
                </Grid> */}
              {/* <Grid item xs={12} sm={6} md={3}>
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
                </Grid> */}

              <Grid item xs={12} sm={6} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="input-with-icon-adornment">Enter Full Name</InputLabel>
                    <Input
                      type="text"
                      id="input-with-icon-adornment"
                      required
                      value={fullName}
                      onChange={handleFullName}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountCircle fontSize="medium" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="input-with-icon-adornment">Enter Phone Number</InputLabel>
                    <Input
                      type="tell"
                      id="input-with-icon-adornment"
                      required
                      value={mobileNo}
                      onChange={mobileNOHandler}
                      startAdornment={
                        <InputAdornment position="start">
                          <PhoneCallbackOutlined fontSize="medium" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} mt={3}>
                <MDBox>
                  <MKBox mb={{ xs: 0.5, md: 2 }}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel htmlFor="input-with-icon-adornment">
                        Enter Remark (optional)
                      </InputLabel>
                      <Input
                        type="tex"
                        multiline
                        maxRows={3}
                        id="input-with-icon-adornment"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <Info fontSize="medium" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </MKBox>
                </MDBox>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={2}>
          {activeStep === 1 || activeStep === 0 ? (
            <Grid container>
              {activeStep === 0 && (
                <Grid item xs={12} md={12}>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} md={3}>
                      <MKBox
                        display="flex"
                        pl={1}
                        // flexDirection={{ xs: "column", md: "row" }}
                        // alignItems={{ xs: "start", md: "center" }}
                        alignItems={"center"}
                        justifyContent="start"
                      >
                        <MKBox display="flex" alignItems="center" mr={1} mb={{ xs: 0.5, md: 0 }}>
                          <Person2Outlined fontSize="medium" />
                          <MKTypography variant="h6">Passengers:</MKTypography>
                        </MKBox>

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
                              if (noOfPassengers <= 0) {
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
                              userSelect: "none",
                              ":hover": {
                                backgroundColor: "lightgrey",
                              },
                            }}
                            // sx={{ borderRadius: "0 25px 25px 0" }}
                            onClick={() => {
                              // if (selectedTaxiType.typeName === "Innova") {
                              //   if (!isNaN(noOfPassengers) && noOfPassengers >= 9) {
                              //     return;
                              //   }
                              // } else if (selectedTaxiType.typeName === "3P + 1D car") {
                              //   if (!isNaN(noOfPassengers) && noOfPassengers >= 4) {
                              //     return;
                              //   }
                              // } else if (selectedTaxiType.typeName === "6P + 1D car") {
                              //   if (!isNaN(noOfPassengers) && noOfPassengers >= 9) {
                              //     return;
                              //   }
                              // } else {
                              //   if (!isNaN(noOfPassengers) && noOfPassengers >= 2) {
                              //     return;
                              //   }
                              // }
                              if (
                                !isNaN(noOfPassengers) &&
                                noOfPassengers >= selectedTaxiType?.capacity
                              ) {
                                return;
                              }
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
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  mt={3}
                  mb={2}
                  display={"flex"}
                  // gap={2}
                  justifyContent={"start"}
                  alignItems={"center"}
                  pl={3}
                >
                  <MKBox display="flex" justifyContent="center" alignItems="center">
                    <FormControlLabel
                      required
                      control={<Checkbox label="" />}
                      label="Accept terms and conditions"
                      sx={{ display: "flex" }}
                      checked={termsChecked}
                      onChange={handleTermsChange}
                    />
                  </MKBox>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  mt={3}
                  // mb={2}
                  display={"flex"}
                  gap={2}
                  justifyContent={"end"}
                  alignItems={"center"}
                  pl={3}
                >
                  <MKBox display="flex" justifyContent="end" alignItems="center">
                    <MKBox>
                      <MKTypography
                        variant="h6"
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={handleOpen}
                        // fontWeight="medium"
                        color="warning"
                        // sx={{ textDecoration: "underline" }}
                      >
                        Terms and conditions
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>
              )}
              {/* <Grid
                  item
                  xs={12}
                  md={12}
                  mt={3}
                  display={"flex"}
                  gap={2}
                  justifyContent={"end"}
                  alignItems={"center"}
                >
         
                  <MKBox>
                    {tollCost ? (
                      <MKBox display="flex" alignItems="center" gap={1}>
                        <MKBox height="10px" width="10px" borderRadius="50%" bgColor="info"></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Toll Cost: &#8377; {tollCost}
                        </MKTypography>
                      </MKBox>
                    ) : (
                      <MKBox display="flex" alignItems="center" gap={1}>
                        <MKBox height="10px" width="10px" borderRadius="50%" bgColor="info"></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Toll Cost: NA
                        </MKTypography>
                      </MKBox>
                    )}
                  </MKBox>
                  <MKBox>
                    {selectedTaxiType?.fair ? (
                      <MKBox display="flex" alignItems="center" gap={1}>
                        <MKBox
                          height="10px"
                          width="10px"
                          borderRadius="50%"
                          bgColor="warning"
                        ></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Fare: &#8377; {selectedTaxiType?.fair}
                        </MKTypography>
                      </MKBox>
                    ) : (
                      <MKBox display="flex" alignItems="center" gap={1}>
                        <MKBox
                          height="10px"
                          width="10px"
                          borderRadius="50%"
                          bgColor="warning"
                        ></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Fare: NA
                        </MKTypography>
                      </MKBox>
                    )}
                  </MKBox>
                  <MKBox>
                    {selectedTaxiType?.fair ? (
                      <MKBox display="flex" alignItems="center" gap={1}>
                        <MKBox
                          height="10px"
                          width="10px"
                          borderRadius="50%"
                          bgColor="success"
                        ></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Total Cost: &#8377; {selectedTaxiType?.fair + tollCost} + Additional
                          Charges
                        </MKTypography>
                      </MKBox>
                    ) : (
                      <MKBox display="flex" alignItems="center" gap={1}>
                        <MKBox
                          height="10px"
                          width="10px"
                          borderRadius="50%"
                          bgColor="success"
                        ></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Total Cost : NA (includes additional charges)
                        </MKTypography>
                      </MKBox>
                    )}
                  </MKBox>
                </Grid> */}
              <Grid
                item
                xs={12}
                md={12}
                mt={activeStep === 0 ? 11.5 : 3}
                sx={{ marginLeft: { xs: 0, md: 2 } }}
                // flexDirection={"column"}
                gap={1}
                mb={3}

                // alignItems={"center"}
              >
                <MKBox display={"flex"} justifyContent={"center"}>
                  <table
                    style={{
                      width: "50%",
                      borderCollapse: "collapse",
                      border: "1px solid black",
                    }}
                  >
                    <tbody style={{ fontSize: "7px" }}>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="info"
                            ></MKBox>
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              Fare
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td style={{ width: "50%" }}>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              &#8377; {selectedTaxiType?.fair || 0}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="warning"
                            ></MKBox>
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              Toll
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              &#8377; {tollCost || 0}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="warning"
                            ></MKBox>
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              Additional Charges
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              &#8377; {additionalCharges}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="success"
                            ></MKBox>
                            <MKTypography fontWeight="medium" style={{ fontSize: "12px" }}>
                              Total
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography fontWeight="medium" style={{ fontSize: "12px" }}>
                              &#8377; {selectedTaxiType?.fair + tollCost || 0 + additionalCharges}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </MKBox>
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={1}>
                  <MKTypography variant="caption">Additional Charges may Apply *</MKTypography>
                </MDBox>
              </Grid>
            </Grid>
          ) : null}
          {activeStep == 2 && (
            <Grid
              container
              spacing={1}
              display="flex"
              // justifyContent="flex-start"
              // alignItems="self-start"
              sx={{ mx: 1, mt: 0.5 }}
              // mb={4}
            >
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 1 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="input-with-icon-adornment">Full Name</InputLabel>
                    <Input
                      type="text"
                      id="input-with-icon-adornment"
                      required
                      value={fullName}
                      onChange={handleFullName}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountCircle fontSize="medium" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 1 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="input-with-icon-adornment">Phone Number</InputLabel>
                    <Input
                      type="tell"
                      id="input-with-icon-adornment"
                      required
                      value={mobileNo}
                      onChange={mobileNOHandler}
                      startAdornment={
                        <InputAdornment position="start">
                          <PhoneCallbackOutlined fontSize="medium" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </MKBox>
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 1 }}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                    <InputLabel id="taxiType">Vehicle</InputLabel>
                    <Select
                      labelId="taxiType"
                      id="taxiType"
                      value={selectedTaxiType?._id ? selectedTaxiType : ""}
                      label="taxiType"
                      onChange={handleTaxiChange}
                      sx={{ minHeight: 45, minWidth: 270 }}
                      startAdornment={
                        <InputAdornment position="start">
                          <TaxiAlertOutlined fontSize="medium" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="start">
                          <ExpandMoreOutlined />
                        </InputAdornment>
                      }
                    >
                      {filteredTaxiTypeList &&
                        filteredTaxiTypeList.map((item, idx) => (
                          // <MenuItem key={idx} value={item}>
                          //   {item.typeName} {item.hasAc == true ? "Ac" : "Non - Ac"}
                          // </MenuItem>
                          <MenuItem key={idx} value={item} display="flex">
                            <MKTypography variant="p">
                              {item.typeName} ({item.hasAc == true ? "Ac" : "Non - Ac"})
                            </MKTypography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 1 }}>
                  <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                    <InputLabel id="destination"> Pickup Location</InputLabel>
                    <Select
                      name="source"
                      id="source"
                      value={selectedSourceLocation.name || "Pickup Location"}
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
                    >
                      {sourcseLocation &&
                        sourcseLocation.map((item, idx) => (
                          <MenuItem key={idx} value={item.name} display="flex">
                            <MKTypography variant="p">{item.name}</MKTypography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 1 }}>
                  <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                    <InputLabel id="destination">Destination</InputLabel>
                    <Select
                      name="destination"
                      labelId="destination"
                      id="destination"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      sx={{ minHeight: 45, minWidth: 270 }}
                      startAdornment={
                        <InputAdornment position="start">
                          <MapOutlined fontSize="medium" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="start">
                          <ExpandMoreOutlined />
                        </InputAdornment>
                      }
                    >
                      {Locations &&
                        Locations.map((item, idx) => (
                          <MenuItem key={idx} value={item.id}>
                            <MKTypography variant="p">{item.name}</MKTypography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>

              {/* <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={{ xs: 0.5, md: 1 }}>
                    <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                      <InputLabel id="landingLocation"> Drop Point</InputLabel>
                      <Select
                        style={{ backgroundColor: type === "package" ? "#f0f0f0" : "inherit" }}
                        disabled={type === "package"}
                        labelId="landingLocation"
                        id="landingLocation"
                        value={selectedLandingLocation}
                        label="landingLocation"
                        onChange={handleLandingLocationChange}
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
                        {landingLocationList &&
                          landingLocationList.map((item, idx) => (
                            <MenuItem key={idx} value={item.id}>
                              <MKTypography variant="p">{item.landingLocation}</MKTypography>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </MKBox>
                </Grid> */}
              <Grid item xs={12} md={6} lg={3} mt={{ xs: 0, md: 4 }}>
                <MKBox
                  display="flex"
                  pl={1}
                  // flexDirection={{ xs: "column", md: "row" }}
                  // alignItems={{ xs: "start", md: "center" }}
                  alignItems={"center"}
                  justifyContent="start"
                >
                  <MKBox display="flex" alignItems="center" mr={1} mt={1} mb={{ xs: 0.5, md: 0 }}>
                    <Person2Outlined fontSize="small" />
                    <MKTypography variant="caption">Passengers:</MKTypography>
                  </MKBox>

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
                        if (noOfPassengers <= 0) {
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
                        userSelect: "none",
                        ":hover": {
                          backgroundColor: "lightgrey",
                        },
                      }}
                      // sx={{ borderRadius: "0 25px 25px 0" }}
                      onClick={() => {
                        // if (selectedTaxiType.typeName === "Innova") {
                        //   if (!isNaN(noOfPassengers) && noOfPassengers >= 9) {
                        //     return;
                        //   }
                        // } else if (selectedTaxiType.typeName === "3P + 1D car") {
                        //   if (!isNaN(noOfPassengers) && noOfPassengers >= 4) {
                        //     return;
                        //   }
                        // } else if (selectedTaxiType.typeName === "6P + 1D car") {
                        //   if (!isNaN(noOfPassengers) && noOfPassengers >= 9) {
                        //     return;
                        //   }
                        // } else {
                        //   if (!isNaN(noOfPassengers) && noOfPassengers >= 2) {
                        //     return;
                        //   }
                        // }

                        if (
                          !isNaN(noOfPassengers) &&
                          noOfPassengers >= selectedTaxiType?.capacity
                        ) {
                          return;
                        }
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
              <Grid item xs={12} sm={12} md={6}>
                <MKBox mb={{ xs: 0.5, md: 1 }} fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                    <DemoContainer variant="standard" components={["DatePicker"]}>
                      <DatePicker
                        fullWidth
                        sx={{ width: "100%" }}
                        label="Date of Traveling"
                        name="dateOfTraveling"
                        value={dateOfTraveling}
                        disablePast
                        onChange={handleDateChange}
                        format="DD/MM/YYYY"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </MKBox>
              </Grid>
              {/* <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={{ xs: 0.5 }} mt={1}>
                    <MKInput
                      type="time"
                      label="Departure Time"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="departureTime"
                      value={departureTime}
                      onChange={timeHandler}
                      sx={{ pointer: "cursor" }}
                    />
                  </MKBox>
                </Grid> */}
              <Grid item xs={12} sm={6} md={6}>
                <MKBox mb={{ xs: 0.5, md: 2 }} fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                    <DemoContainer variant="standard" components={["MobileTimePicker"]} fullWidth>
                      {/* <DemoItem label="Departue Time"> */}
                      <MobileTimePicker
                        value={departureTime}
                        onChange={(value) => timeHandler(value)}
                        // disablePast
                        fullWidth
                        label="Select Time"
                        sx={{ width: "100%" }}
                        ampmInClock
                      />
                      {/* </DemoItem> */}
                    </DemoContainer>
                  </LocalizationProvider>
                </MKBox>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                style={{ display: "flex", justifyContent: "start" }}
              >
                {selectedTaxiType?._id && selectedTaxiType?.carrier ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        // disabled={!selectedTaxiType?.carrier}
                        defaultChecked={carrier}
                        onChange={(e) => {
                          console.log(e.target.checked);
                          setCarrier(e.target.checked);
                        }}
                      />
                    }
                    label="Include Carrier"
                  />
                ) : null}
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                mt={2}
                // display={"flex"}
                // flexDirection={"column"}
                gap={1}
                // mb={1}
                // justifyContent={"space"}
                // alignItems={"center"}
              >
                <MKBox display={"flex"} justifyContent={"center"}>
                  <table
                    style={{
                      width: "50%",
                      borderCollapse: "collapse",
                      border: "1px solid black",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="info"
                            ></MKBox>
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              Fare
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              &#8377; {selectedTaxiType?.fair || 0}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="warning"
                            ></MKBox>
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              Toll
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              &#8377; {tollCost || 0}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="warning"
                            ></MKBox>
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              Additional Charges
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography variant="body2" style={{ fontSize: "12px" }}>
                              &#8377; {additionalCharges || 0}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <td style={{ borderRight: "1px solid black", padding: "5px" }}>
                          <MKBox display="flex" alignItems="center" gap={1}>
                            <MKBox
                              height="8px"
                              width="8px"
                              borderRadius="50%"
                              bgColor="success"
                            ></MKBox>
                            <MKTypography
                              variant="body2"
                              fontWeight="medium"
                              style={{ fontSize: "12px" }}
                            >
                              Total
                            </MKTypography>
                          </MKBox>
                        </td>
                        <td>
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            gap={1}
                            pr={1}
                          >
                            <MKTypography
                              variant="body2"
                              fontWeight="medium"
                              style={{ fontSize: "12px" }}
                            >
                              &#8377; {selectedTaxiType?.fair + tollCost + additionalCharges}
                            </MKTypography>
                          </MDBox>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </MKBox>
                <MDBox display="flex" justifyContent="center" alignItems="center">
                  <MKTypography variant="caption">Additional Charges may Apply *</MKTypography>
                </MDBox>
              </Grid>
            </Grid>
          )}
          <Grid
            container
            item
            justifyContent="center"
            xs={12}
            mt={4}
            pt={4}
            mb={1}
            sx={{ position: { md: "absolute" } }}
            bottom={10}
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
      <TandC handleClose={handleClose} open={open} />
    </MKBox>
  );
};

TaxiBookingForm.propTypes = {
  setHideButton: PropTypes.func,
};

export default TaxiBookingForm;
