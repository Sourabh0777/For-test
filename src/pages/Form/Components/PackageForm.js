/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import dayjs from "dayjs";
import { DateField, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import MKAlert from "components/MKAlert";
import { FormContext } from "./FormContext";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { LegendToggle } from "@mui/icons-material";
import TimePicker from "react-time-picker";
import { useHttpClient } from "hooks/http-hook";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import BookingStatus from "./BookingStatus";
import { useNavigate } from "react-router-dom";
import BookingConfirmed from "pages/BookingConfirmation/BookingConfirmed";
import Navbar from "pages/Navbar/Navbar";
const PackageForm = ({ changeTypeHandler }) => {
  const [openModal, setOpenModal] = useState(false);
  const [BookingToke, setBookingToken] = useState();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const formData = useContext(FormContext);
  const [touched, setTouched] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState();
  // eslint-disable-next-line prettier/prettier
  const [showAlert, setShowAlert] = useState(false);
  const [departureTime, setDepartureTime] = useState("00:00");
  const timeHandler = (e) => {
    setDepartureTime(e.target.value);
  };
  const initialInputState = {
    firstName: "",
    lastName: "",
    mobileNo: "",
    destinationFrom: "Delhi",
    destinationTo: "",
    noOfPassengers: 1,
    texiType: "65055e9012a928bd7509270b",
    selectedAc: "nonAc",
    selectedSeater: "6+1 Car (No Carrier)",
    bookingStatus: "pending",
    bookingType: "package",
    packageId: "650577071ac28d5508697a44",
  };

  const [dateOfTraveling, setDateOfTraveling] = useState(dayjs());
  const dateHandler = (value) => {
    setDateOfTraveling(value);
  };

  const [inputState, setInputState] = useState(initialInputState);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({
      ...inputState,
      [name]: value,
    });
    if (value.trim() !== "") {
      setTouched(true);
    }
  };
  const mobileNOHandler = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, "");
    if (inputValue.length === 10) {
      setIsMobileValid(true);
    } else {
      setIsMobileValid(false);
    }

    setInputState({
      ...inputState,
      mobileNo: inputValue, // Update mobile number in state
    });
  };
  const radioButtonHandler1 = (event) => {
    setInputState({ ...inputState, selectedAc: event.target.value });
  };
  const radioButtonHandler2 = (event) => {
    setInputState({ ...inputState, selectedSeater: event.target.value });
  };

  const getInputValidationState = (inputName) => {
    if (touched) {
      const inputValue = inputState[inputName].trim();
      if (inputValue === "") {
        return "error";
      } else if (inputName === "mobileNo" && inputValue.length < 10) {
        const mobileNoPattern = /^\d{10}$/;

        if (!mobileNoPattern.test(inputValue)) {
          return "error";
        }

        return "error";
      } else {
        return "success";
      }
    }
    return undefined;
  };
  const [activeStep, setActiveStep] = React.useState(0);

  const [isNextDisabled, setIsNextDisabled] = useState(true);
  useEffect(() => {
    // Use this effect to check the conditions and update isNextDisabled.
    if (
      inputState.mobileNo !== "" &&
      inputState.lastName !== "" &&
      inputState.firstName !== "" &&
      activeStep === 0
    ) {
      setIsNextDisabled(false);
    }
    if (
      // dateOfTraveling &&
      departureTime !== "" &&
      inputState.destinationFrom &&
      inputState.destinationTo &&
      activeStep === 1
    ) {
      setIsNextDisabled(false);
    }

    if (inputState.noOfPassengers && activeStep === 2) {
      setIsNextDisabled(false);
    }
    if (inputState.noOfPassengers && activeStep === 4) {
      setIsNextDisabled(false);
    }
  }, [inputState, activeStep, dateOfTraveling, departureTime]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = {
      firstName: inputState.firstName,
      lastName: inputState.lastName,
      phoneNumber: inputState.mobileNo,
      travelDate: dateOfTraveling,
      travelTime: departureTime,
      source: "Delhi",
      destination: "64f3519c0ea234235f735941",
      noOfPassengers: inputState.noOfPassengers,
      texiType: "64f3338d70c79275caab2e0b",
      fare: 2100,
      paymentMode: "online",
      additionalCharges: 250,
      confirmed: "false",
      bookingType: inputState.bookingType,
      bookingStatus: inputState.bookingStatus,
      packageId: inputState.packageId,
    };

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/bookTaxi`,
        "POST",
        JSON.stringify(formData),
        { "Content-Type": "application/json" }
      );
      if (responseData) {
        setOpenModal(true);
        setBookingToken(responseData?.data?.token);

        // setBookingConfirmed(responseData);
        // navigate(`/booking/${responseData?.data?.token}`);
      }
    } catch (error) {}
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  //Code for Stepper d'ont Change
  const [steps, setSteps] = useState([
    "User Details",
    "Traveling Details",
    "Transport Details",
    "Confirm Payment",
  ]);

  const [skipped, setSkipped] = React.useState(new Set());
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    setIsNextDisabled(true);
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setInputState(initialInputState);

    setActiveStep(0);
  };
  function HorizontalLinearStepper() {
    return (
      <Box sx={{ width: "100%" }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ background: "linear-gradient(195deg, #49a3f1, #000000)", p: 2 }}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    );
  }
  const onClose = () => {
    setOpenModal(false);
    setInputState(initialInputState);

    setActiveStep(0);
  };
  return (
    <Grid item xs={12} lg={10} mt={0}>
      {BookingToke && <BookingConfirmed open={openModal} onClose={onClose} data={BookingToke} />}
      {}
      {showAlert && (
        <MKAlert dismissible={showAlert} closeAlert={closeAlert} color="info">
          Form was submitted
        </MKAlert>
      )}

      {HorizontalLinearStepper()}
      <Navbar changeTypeHandler={changeTypeHandler} />
      <MKBox
        bgColor="white"
        borderRadius="xl"
        shadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={{ xs: 10, sm: 10, md: 5 }}
        mb={{ xs: 10, sm: 10, md: 5 }}
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
            {formData.heading + " "} Booking Token
          </MKTypography>
        </MKBox>
        <MKBox p={3}>
          <MKTypography variant="body2" color="text" mb={3}></MKTypography>
          <MKBox
            width="100%"
            component="form"
            method="post"
            autoComplete="off"
            onSubmit={submitHandler}
          >
            <Grid container spacing={3}>
              {activeStep == 0 && (
                <>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      label="First Name"
                      fullWidth
                      name="firstName"
                      value={inputState.firstName}
                      onChange={handleInputChange}
                      required
                      error={getInputValidationState("firstName") === "error"}
                      success={getInputValidationState("firstName") === "success"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      label="Last Name"
                      fullWidth
                      name="lastName"
                      value={inputState.lastName}
                      onChange={handleInputChange}
                      required
                      error={getInputValidationState("lastName") === "error"}
                      success={getInputValidationState("lastName") === "success"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="tel"
                      variant="standard"
                      label="Mobile no"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="mobileNo"
                      value={inputState.mobileNo}
                      onChange={mobileNOHandler}
                      required
                      error={getInputValidationState("mobileNo") === "error"}
                      success={getInputValidationState("mobileNo") === "success"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DateField", "DateField"]}>
                        <DateField
                          variant="standard"
                          label="Booking Date"
                          defaultValue={dayjs()}
                          disabled
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                </>
              )}

              {inputState.firstName && inputState.mobileNo && activeStep == 1 && (
                <>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          variant="standard"
                          label="Date of Traveling"
                          fullWidth
                          name="dateOfTraveling"
                          value={dateOfTraveling}
                          onChange={(newValue) => dateHandler(newValue)}
                          required
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="time"
                      label="Departure Time"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="departureTime"
                      value={departureTime}
                      onChange={timeHandler}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="text"
                      variant="standard"
                      label="From"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="destinationFrom"
                      value={inputState.destinationFrom}
                      default
                      disabled
                      // onChange={handleInputChange}
                      required
                      error={getInputValidationState("destinationFrom") === "error"}
                      success={getInputValidationState("destinationFrom") === "success"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="text"
                      variant="standard"
                      label="To"
                      name="destinationTo"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={inputState.destinationTo}
                      onChange={handleInputChange}
                      required
                      error={getInputValidationState("destinationTo") === "error"}
                      success={getInputValidationState("destinationTo") === "success"}
                    />
                  </Grid>
                </>
              )}
              {activeStep == 2 && (
                <>
                  <Grid item xs={12} md={6} p={1.5}>
                    <MKInput
                      type="number"
                      variant="standard"
                      label="No of Passengers"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="noOfPassengers"
                      value={inputState.noOfPassengers}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RadioGroup
                      name="SelectAc"
                      value={inputState.selectedAc}
                      onChange={radioButtonHandler1}
                      row
                      mt={1}
                    >
                      <FormControlLabel value="ac" control={<Radio />} label="AC" />
                      <FormControlLabel value="nonAc" control={<Radio />} label="Non-AC" />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RadioGroup
                      name="SelectSeater"
                      value={inputState.selectedSeater}
                      onChange={radioButtonHandler2}
                      row
                    >
                      <FormControlLabel
                        value="6+1 Car (No Carrier)"
                        control={<Radio />}
                        label="6+1 Car (No Carrier)"
                      />
                      <FormControlLabel
                        value="3+1 Car (No Carrier)"
                        control={<Radio />}
                        label="3+1 Car (No Carrier)"
                      />
                    </RadioGroup>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid container spacing={2}>
              {inputState.noOfPassengers && inputState.destinationFrom && activeStep == 3 && (
                <>
                  {/* <Grid item xs={12}>
                    <MKBox
                      mx={2}
                      mb={0}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <FormLabel
                        id="demo-radio-buttons-group-label"
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        You wish to confirm booking ?
                      </FormLabel>
                    </MKBox>
                  </Grid> */}
                  <Grid item xs={12} md={4} p={2.7}>
                    <MKInput
                      type="name"
                      label="Name"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={inputState.firstName}
                      disabled
                    />
                  </Grid>{" "}
                  <Grid item xs={12} md={4}>
                    <MKInput
                      type="text"
                      label="Phone no"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={inputState.mobileNo}
                      disabled
                    />
                  </Grid>{" "}
                  <Grid item xs={12} md={4}>
                    <MKInput
                      type="time"
                      label="Departure Time"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={departureTime}
                      disabled
                    />
                  </Grid>{" "}
                  <Grid item xs={12} md={4}>
                    <MKInput
                      type="text"
                      label="From"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={inputState.destinationFrom}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MKInput
                      type="text"
                      label="To"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={inputState.destinationTo}
                      disabled
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Grid container item justifyContent="center" xs={12} mt={3} mb={2}>
              {activeStep === steps.length - 1 ? (
                <React.Fragment>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>{" "}
                  <MKButton type="submit" variant="gradient" color="info">
                    Confirm Booking{" "}
                  </MKButton>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
          </MKBox>
        </MKBox>
      </MKBox>
    </Grid>
  );
};

export default PackageForm;
