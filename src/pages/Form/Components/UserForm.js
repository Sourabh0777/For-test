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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
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

const UserForm = () => {
  const formData = useContext(FormContext);
  const [touched, setTouched] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  //Format the time
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) < 12 ? "AM" : "PM";
    const formattedMinutes = minutes ? minutes.padStart(2, "0") : "00";
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };
  //Input field states

  const initialInputState = {
    firstName: "",
    mobileNo: "",
    destinationFrom: "",
    destinationTo: "",
    dateOfTraveling: dayjs(),
    noOfPassengers: 1,
    selectedAc: "nonAc",
    selectedSeater: "",
  };
  const [dateOfTraveling, setDateOfTraveling] = useState(dayjs());
  const [departureTime, setDepartureTime] = useState("00:00");

  const [inputState, setInputState] = useState(initialInputState);
  // console.log("🚀 ~ file: UserForm.js:53 ~ UserForm ~ inputState:", inputState);
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

  const getInputValidationState = (inputName) => {
    if (touched) {
      const inputValue = inputState[inputName].trim();
      if (inputValue === "") {
        return "error";
      } else if (inputName === "mobileNo" && inputValue.length < 10) {
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
    if (inputState.mobileNo !== "" && inputState.firstName !== "" && activeStep === 0) {
      setIsNextDisabled(false);
    }
    if (dateOfTraveling !== "" && departureTime !== "" && activeStep === 1) {
      setIsNextDisabled(false);
    }
    if (inputState.destinationFrom && inputState.destinationTo && activeStep === 2) {
      setIsNextDisabled(false);
    }
    if (inputState.noOfPassengers && activeStep === 3) {
      setIsNextDisabled(false);
    }
    if (inputState.noOfPassengers && activeStep === 4) {
      setIsNextDisabled(false);
    }
  }, [inputState, activeStep]);

  console.log("🚀 ~ file: UserForm.js:80 ~ UserForm ~ isNextDisabled:", isNextDisabled);

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowAlert(true);
  };
  const closeAlert = () => {
    setShowAlert(false);
  };

  //Code for Stepper d'ont Change
  const steps = [
    "User Details",
    "Traveling Time",
    "Traveling Details",
    "Vehicle Details",
    "Confirm Payment",
  ];
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
  return (
    <>
      {showAlert && (
        <MKAlert dismissible={showAlert} closeAlert={closeAlert} color="info">
          Form was submitted
        </MKAlert>
      )}
      {HorizontalLinearStepper()}

      <MKBox
        bgColor="white"
        borderRadius="xl"
        shadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={{ xs: 5, sm: 10, md: 5 }}
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
                  <Grid item xs={12} md={0} mt={-5}>
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
                      type="tel"
                      variant="standard"
                      label="Mobile no"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      name="mobileNo"
                      value={inputState.mobileNo}
                      onChange={handleInputChange}
                      required
                      error={getInputValidationState("mobileNo") === "error"}
                      success={getInputValidationState("mobileNo") === "success"}
                    />
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
                          onChange={(newValue) => setDateOfTraveling(newValue)}
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
                      onChange={(e) => setDepartureTime(formatTime(e.target.value))}
                      required
                    />
                  </Grid>
                </>
              )}
              {dateOfTraveling && departureTime && inputState.mobileNo && activeStep == 2 && (
                <>
                  <Grid item xs={12} md={12}>
                    <FormLabel id="demo-radio-buttons-group-label">Traveling Details</FormLabel>
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
                      onChange={handleInputChange}
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
              {inputState.destinationFrom && inputState.destinationTo && activeStep == 3 && (
                <>
                  <Grid item xs={12} md={12}>
                    <FormLabel id="demo-radio-buttons-group-label">
                      Vehicle & Passanger Details
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                </>
              )}
              <Grid container spacing={2}>
                {inputState.noOfPassengers && inputState.destinationFrom && activeStep == 3 && (
                  <>
                    <Grid item xs={12}>
                      <MKBox mx={2} mb={2} display="flex">
                        <RadioGroup
                          name="SelectAc"
                          value={inputState.selectedAc}
                          onChange={handleInputChange}
                        >
                          <FormControlLabel value="ac" control={<Radio />} label="AC" />
                          <FormControlLabel value="nonAc" control={<Radio />} label="Non-AC" />
                        </RadioGroup>
                        <RadioGroup
                          name="SelectSeater"
                          value={inputState.selectedSeater}
                          onChange={handleInputChange}
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
                      </MKBox>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid container spacing={2}>
                {inputState.noOfPassengers && inputState.destinationFrom && activeStep == 4 && (
                  <>
                    <Grid item xs={12}>
                      <MKBox
                        mx={2}
                        mb={2}
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
                          Toll Charges: $567
                        </FormLabel>
                        <FormLabel
                          id="demo-radio-buttons-group-label"
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          Fair : $250
                        </FormLabel>
                        <FormLabel
                          id="demo-radio-buttons-group-label"
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          Total fair : $250
                        </FormLabel>
                      </MKBox>
                    </Grid>
                  </>
                )}
              </Grid>
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
    </>
  );
};

export default UserForm;
