/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Checkbox,
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
  const [termsChecked, setTermsChecked] = useState(true);

  const [activeStep, setActiveStep] = React.useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const handleTermsChange = (event) => {
    setTermsChecked(event.target.checked);
    if (event.target.checked == false) {
      setIsNextDisabled(true);
    }
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
  const [tollCost, setTollCost] = useState();
  const [selectedTaxiType, setSelectedTaxiType] = useState({});
  const [noOfPassengers, setNoOfPassengers] = useState(1);
  //
  const handleSourceLocationChange = (event) => {
    const a = sourcseLocation.filter((item) => item.name == event.target.value);
    setSelectedSourceLocation(a[0]);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);

    const landingLocationList = LocationData.filter((item) => item._id == event.target.value);
    setSelectedDestinationName(landingLocationList[0].locationName);
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
    setNoOfPassengers(1);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/admin/location`
        );
        setLocationData(responseData.data);

        const locationNames = responseData.data
          .filter((location) => (!checked ? location.type === "taxi" : location.type === "package"))
          .map((item) => {
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

  const [formateDate, setFormateDate] = useState("");
  //Values
  const [dateOfTraveling, setDateOfTraveling] = useState(null);
  const [departureTime, setDepartureTime] = useState("");
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
  const [formattedTime, setFormattedTime] = useState("");

  const timeHandler = (e) => {
    setDepartureTime(e.target.value);
    const inputTime = e.target.value;

    const [hours, minutes] = inputTime.split(":");

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formatted = date.toLocaleTimeString(undefined, options);

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
  const handlePassengerChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (selectedTaxiType.typeName === "Innova") {
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 9) {
        setNoOfPassengers(newValue);
      }
    } else if (selectedTaxiType.typeName === "3+1") {
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 4) {
        setNoOfPassengers(newValue);
      }
    } else if (selectedTaxiType.typeName === "6+1") {
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 9) {
        setNoOfPassengers(newValue);
      }
    } else {
      setNoOfPassengers(newValue);
    }
  };

  //Packages Code
  const [packageData, setPackageData] = useState();
  const [PackagesList, setPackagesList] = useState();
  const [dropLocationList, setDropLocationList] = useState();
  const [packageTaxiList, setPackageTaxiList] = useState();
  const [selectedPackageData, setSelectedPackageData] = useState();
  //Values
  const [checked, setChecked] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = useState();
  const [selectedPackageID, setselectedPackageID] = useState();
  const [pickupLocation, setPickupLocation] = useState();
  const [destinationId, setDestinationId] = useState();
  const [selectedPackageSourceLocation, setSelectedPackageSourceLocation] = useState("");
  const handlePackageSourceLocationChange = (e) => {
    const a = sourcseLocation.filter((item) => item.name == e.target.value);
    setSelectedPackageSourceLocation(a[0]);
  };
  console.log(
    "🚀 ~ file: TaxiBookingForm.js:252 ~ selectedPackageSourceLocation:",
    selectedPackageSourceLocation
  );

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setSelectedPackageSourceLocation("");
    setSelectedSourceLocation("");
  };
  const handlePackageChange = (e) => {
    setSelectedPackage(e.target.value.name);
    setselectedPackageID(e.target.value._id);
    const selectedPackage = packageData.filter((item) => item._id == e.target.value._id);
    setSelectedPackageData(selectedPackage);
  };

  useEffect(() => {
    if (selectedPackageData && selectedPackage) {
      setPickupLocation(selectedPackageData[0].location.locationName);
      setTollCost(selectedPackageData[0]?.location?.tollCost);
      setDestinationId(selectedPackageData[0].location._id);
      const landingLocationList = selectedPackageData[0].location?.landingLocations?.map((item) => {
        return { name: item.place, id: item._id };
      });
      setDropLocationList(landingLocationList);
      const taxiList = selectedPackageData[0]?.location?.landingLocations[0]?.taxiFares;
      const taxiTypes = taxiTypeList.filter((item1) =>
        taxiList.some((item2) => item1._id === item2.vehicleType)
      );
      taxiTypes.forEach((taxiType) => {
        const fairData = taxiList.find((item) => item.vehicleType === taxiType._id);
        if (fairData) {
          taxiType.fair = fairData.fare; // Assuming "fair" is the property you want to add
        }
      });
      setPackageTaxiList(taxiTypes);
      // setTollCost(0);
    }
  }, [selectedPackage, selectedPackageData]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const responseData = await sendRequest(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_BACKEND_URL}/admin/package`
        );
        if (responseData) {
          setPackageData(responseData.data);
          const packagesData = responseData.data.map((item) => {
            return { name: item.packageName, _id: item._id };
          });
          setPackagesList(packagesData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (checked) {
      fetchPackages();
    }
  }, [checked]);

  useEffect(() => {
    if (
      (activeStep == 0 &&
        termsChecked &&
        tollCost &&
        selectedLocation &&
        selectedLandingLocation &&
        selectedTaxiType.fair) ||
      (checked && selectedPackage && pickupLocation && selectedTaxiType.fair && termsChecked)
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
  }, [
    activeStep,
    tollCost,
    selectedLocation,
    selectedTaxiType,
    dateOfTraveling,
    departureTime,
    fullName,
    mobileNo,
    checked,
    selectedPackage,
    pickupLocation,
    termsChecked,
  ]);
  //
  const submitHandler = async () => {
    let formData = {
      firstName: firstName,
      lastName: lastName || " ",
      phoneNumber: mobileNo,
      travelDate: dateOfTraveling,
      travelTime: formattedTime,
      source: selectedSourceLocation.id,
      destination: selectedLocation,
      noOfPassengers: noOfPassengers,
      texiType: selectedTaxiType._id,
      fare: selectedTaxiType.fair + tollCost,
      paymentMode: "online",
      additionalCharges: tollCost,
      confirmed: false,
      bookingStatus: "pending",
      paymentAccepted: false,
      landingLocationId: selectedLandingLocation,
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
  const packageSubmitHandler = async () => {
    let formData = {
      firstName: firstName,
      lastName: lastName || " ",
      phoneNumber: mobileNo,
      travelDate: dateOfTraveling,
      travelTime: formattedTime,
      source: selectedSourceLocation.id,
      destination: destinationId,
      noOfPassengers: noOfPassengers,
      texiType: selectedTaxiType._id,
      fare: selectedTaxiType.fair + tollCost,
      paymentMode: "online",
      additionalCharges: tollCost,
      confirmed: false,
      bookingStatus: "pending",
      paymentAccepted: false,
      landingLocationId: selectedPackage?.location?._id,
      bookingType: "package",
      packageId: selectedPackageID,
    };
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
      console.log(error, "here");
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
        {!checked && (
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
                        id="source"
                        value={selectedSourceLocation.name || ""}
                        onChange={handleSourceLocationChange}
                        sx={{ minHeight: 45, minWidth: 270 }}
                      >
                        {sourcseLocation &&
                          sourcseLocation.map((item, idx) => (
                            <MenuItem key={idx} value={item.name}>
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
          </Grid>
        )}
        {checked && (
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
                      <InputLabel id="packageSource">Pick Up</InputLabel>
                      <Select
                        name="packageSource"
                        labelId="source"
                        id="packageSource"
                        value={
                          selectedPackageSourceLocation ? selectedPackageSourceLocation.name : ""
                        }
                        onChange={handlePackageSourceLocationChange}
                        sx={{ minHeight: 45, minWidth: 270 }}
                      >
                        {sourcseLocation &&
                          sourcseLocation.map((item, idx) => (
                            <MenuItem key={idx} value={item.name}>
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
                      <InputLabel id="Package">Select Package</InputLabel>
                      <Select
                        name="Package"
                        labelId="Package"
                        id="Package"
                        value={selectedPackage}
                        onChange={handlePackageChange}
                        sx={{ minHeight: 45, minWidth: 270 }}
                      >
                        {PackagesList &&
                          PackagesList.map((item, idx) => (
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
                    <MKInput
                      name="source"
                      type="text"
                      label="Location"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={pickupLocation}
                      default
                      disabled
                      required
                    />
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
                        {packageTaxiList &&
                          packageTaxiList.map((item, idx) => (
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
          </Grid>
        )}
        {!checked && (
          <Grid container spacing={2}>
            {activeStep === 1 || activeStep === 0 ? (
              <Grid container>
                {activeStep === 0 && (
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2} sx={{ mx: 1, mt: 0.5 }}>
                      <Grid item xs={12} sm={12} md={3}>
                        <MKBox>
                          <MKInput
                            variant="standard"
                            type="number"
                            label="No of Passengers"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            name="noOfPassengers"
                            value={noOfPassengers}
                            onChange={handlePassengerChange}
                            required
                          />
                        </MKBox>
                      </Grid>
                      <Grid item xs={12} sm={12} md={3}>
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
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  md={3}
                  mt={2}
                  display={"flex"}
                  gap={2}
                  justifyContent={"end"}
                  alignItems={"center"}
                >
                  {/* Total Cost and fair */}
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
                          bgColor="success"
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
                          bgColor="success"
                        ></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Fare: NA
                        </MKTypography>
                      </MKBox>
                    )}
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
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={6}>
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
                <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      variant="standard"
                      label="From"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={selectedSourceLocation.name}
                      disabled
                    />
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      variant="standard"
                      label="To"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={selectedDestinationName}
                      disabled
                    />
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      variant="standard"
                      label="Date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={formateDate}
                      disabled
                    />
                  </MKBox>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      variant="standard"
                      label="Time"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={formattedTime}
                      disabled
                    />
                  </MKBox>
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
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
                  <MKButton
                    onClick={submitHandler}
                    disabled={!termsChecked}
                    variant="gradient"
                    color="info"
                  >
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
        )}
        {checked && (
          <Grid container spacing={2}>
            {/* {activeStep === 0 ? ( */}
            {activeStep === 1 || activeStep === 0 ? (
              <Grid container>
                {activeStep === 0 ? (
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2} sx={{ mx: 1, mt: 0.5 }}>
                      <Grid item xs={12} sm={12} md={3}>
                        <MKBox>
                          <MKInput
                            variant="standard"
                            type="number"
                            label="No of Passengers"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            name="noOfPassengers"
                            value={noOfPassengers}
                            onChange={handlePassengerChange}
                            required
                          />
                        </MKBox>
                      </Grid>
                      <Grid item xs={12} sm={12} md={3}>
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
                  </Grid>
                ) : (
                  <Grid item xs={12} md={9}></Grid>
                )}
                <Grid
                  item
                  xs={12}
                  md={3}
                  mt={2}
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
                          bgColor="success"
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
                          bgColor="success"
                        ></MKBox>
                        <MKTypography variant="caption" color="text" fontWeight="medium">
                          Fare: NA
                        </MKTypography>
                      </MKBox>
                    )}
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
                <Grid item xs={12} sm={12} md={3}>
                  <MKBox mb={2}>
                    <MKInput
                      variant="standard"
                      type="text"
                      label="From"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={selectedPackageSourceLocation.name}
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
                      value={pickupLocation}
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
                  <MKButton
                    onClick={packageSubmitHandler}
                    disabled={!termsChecked}
                    variant="gradient"
                    color="info"
                  >
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
        )}
      </MKBox>
    </MKBox>
  );
};

export default TaxiBookingForm;
