/* eslint-disable no-unused-vars */
/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Material Kit 2 React example components
import SimpleFooter from "examples/Footers/SimpleFooter";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import bgImage2 from "assets/images/Background image/3619437.jpg";
import { ButtonGroup, useMediaQuery } from "@mui/material";
import GroupButton from "./Components/GroupButton";
import TaxiBookingForm from "./NewFormPage/TaxiBookingForm";
import BusBookingForm from "./NewFormPage/BusBookingForm";

function BookingPage() {
  const [selectedButton, setSelectedButton] = useState();
  const selectedButtonHandleer = (value) => {
    setSelectedButton(value);
  };
  const isMobile = useMediaQuery("(max-width:600px)");
  const [hideButton, setHideButton] = useState(false);

  return (
    <>
      <MKBox
        // position="absolute"
        // top={0}
        // left={0}
        // zIndex={1}
        // width="100%"
        // minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          paddingTop: { xs: 5, md: 3 },
          paddingBottom: { xs: 8, md: 0 },
        }}
        height="auto"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            // mb: 10,
            // ml: 9,
            width: { md: "40vw", xs: "90vw" },
            // maxWidth: { xs: "90vw" },
            minHeight: { md: "97vh", xs: "94vh" },
          }}
        >
          <MKBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
          >
            <MKTypography variant="h5" fontWeight="medium" color="white" mt={1}>
              Book Your Ride
            </MKTypography>
          </MKBox>
          {!hideButton && <GroupButton onClick={selectedButtonHandleer} />}
          {selectedButton == "Taxi" && <TaxiBookingForm setHideButton={setHideButton} />}
          {selectedButton == "Bus" && <BusBookingForm setHideButton={setHideButton} />}
        </Card>
      </MKBox>
    </>
  );
}

export default BookingPage;
