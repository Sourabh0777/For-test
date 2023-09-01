import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Image
import taxi from "assets/images/taxi.avif";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { useState } from "react";
import MKAlert from "components/MKAlert";
// eslint-disable-next-line react/prop-types
function PackageForm() {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) < 12 ? "AM" : "PM";
    const formattedMinutes = minutes ? minutes.padStart(2, "0") : "00";

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };
  const [showAlert, setShowAlert] = useState(false);
  const [userName, setUserName] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [dateOfTraveling, setDateOfTraveling] = useState(dayjs());
  const [departureTime, setDepartureTime] = useState("00:00");
  const [destinationFrom, setDestinationFrom] = useState();
  const [destinationTo, setDestinationTo] = useState();
  const [noOfPassengers, setNoOfPassengers] = useState();
  console.log("🚀 ~ file: index.js:51 ~ Form ~ departureTime:", formatTime(departureTime));
  const closeAlert = () => {
    console.log("Close Working");
    setShowAlert(false);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("working");
    setShowAlert(true);
  };
  return (
    <>
      <MKBox position="fixed" top="0.5rem" width="100%">
        <DefaultNavbar
          routes={routes}
          action={{
            type: "external",
            route: "https://www.creative-tim.com/product/material-kit-react",
            label: "free download",
            color: "info",
          }}
        />
      </MKBox>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} lg={6}>
          <MKBox
            display={{ xs: "none", lg: "flex" }}
            width="calc(90% - 1rem)"
            height="calc(80vh - 1rem)"
            minHeight="calc(80vh - 1rem)"
            borderRadius="lg"
            ml={5}
            mt={10}
            sx={{
              backgroundImage: `url(${taxi})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={10}
          md={7}
          lg={6}
          xl={5}
          ml={{ xs: "auto", lg: 6 }}
          mr={{ xs: "auto", lg: 6 }}
        >
          {showAlert && (
            <MKAlert dismissible={showAlert} closeAlert={closeAlert} color="info">
              Form was submitted
            </MKAlert>
          )}

          <MKBox
            bgColor="white"
            borderRadius="xl"
            shadow="lg"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={{ xs: 20, sm: 18, md: 20 }}
            mb={{ xs: 20, sm: 18, md: 20 }}
            mx={3}
          >
            <MKBox
              variant="gradient"
              bgColor="info"
              coloredShadow="info"
              borderRadius="lg"
              p={2}
              mx={2}
              mt={-3}
            >
              <MKTypography variant="h3" color="white">
                Package Booking Token
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
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      label="First Name"
                      fullWidth
                      name="firstName"
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
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
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                  </Grid>
                  {userName && mobileNo && (
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
                          onChange={(e) => setDepartureTime(e.target.value)}
                        />
                      </Grid>
                    </>
                  )}
                  {departureTime && mobileNo && (
                    <>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          type="text"
                          variant="standard"
                          label="From"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          name="destinationFrom"
                          value={destinationFrom}
                          onChange={(e) => setDestinationFrom(e.target.value)}
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
                          value={destinationTo}
                          onChange={(e) => setDestinationTo(e.target.value)}
                        />
                      </Grid>
                    </>
                  )}
                  {destinationFrom && destinationTo && (
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="number"
                        variant="standard"
                        label="No of Passengers"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        name="noOfPassengers"
                        value={noOfPassengers}
                        onChange={(e) => setNoOfPassengers(e.target.value)}
                      />
                    </Grid>
                  )}
                  {/* {noOfPassengers && destinationFrom && (
                    <Grid item xs={12}>
                      <MKBox mb={2} display="flex">
                        <RadioGroup
                          name="SelectAc"
                          value={selectedAc}
                          onChange={(event) => setSelectedAc(event.target.value)}
                        >
                          <FormControlLabel value="ac" control={<Radio />} label="AC" />
                          <FormControlLabel value="nonAc" control={<Radio />} label="Non-AC" />
                        </RadioGroup>
                        <RadioGroup
                          name="SelectSeater"
                          value={selectedSeater}
                          onChange={(event) => setSelectedSeater(event.target.value)}
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
                  )} */}
                </Grid>
                <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                  <MKButton type="submit" variant="gradient" color="info">
                    Confirm Booking{" "}
                  </MKButton>
                </Grid>
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default PackageForm;
