/* eslint-disable react/prop-types */
import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MKBox from "components/MKBox";
import { Grid, Icon } from "@mui/material";
//Icon
import MKTypography from "components/MKTypography";
//Images
import bus from "assets/images/20945950.jpg";
import taxi from "assets/images/3644592.jpg";
import packageImage from "assets/images/11291.jpg";
import { useNavigate } from "react-router-dom";
//Context Related
const options = [
  {
    bgImage: taxi,
    heading: "Taxi",
    name: "Taxi",
    value: "taxi",
    icon: "local_taxi_icon",
  },
  {
    bgImage: bus,
    heading: "Bus",
    name: "Bus",
    value: "bus",
    icon: "directions_bus_icon",
  },
  {
    bgImage: packageImage,
    heading: "Package",
    name: "Package",
    value: "package",
    icon: "widgets_icon",
  },
];
export default function ColorToggleButton({ onclick }) {
  const navigate = useNavigate();

  const [alignment, setAlignment] = React.useState(options[0].value);
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    onclick(newAlignment);
    navigate("/taxi");
  };
  const screenSize = window.innerWidth <= 768 ? "xs" : "lg";

  return (
    <Grid item xs={6} sm={6} md={8} lg={12} mt={4}>
      <MKBox
        variant="gradient"
        bgColor="light"
        borderRadius="lg"
        sx={{
          width: screenSize === "xs" ? "200%" : "100%",
        }}
      >
        <ToggleButtonGroup
          color="light"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          sx={{ color: "black" }}
        >
          {options.map((option, idx) => {
            return (
              <ToggleButton
                value={option.value}
                sx={{ border: "none", borderRadius: "5px" }}
                key={idx}
              >
                <Grid container>
                  <Grid item xs={6} lg={12}>
                    <MKBox display="flex">
                      {screenSize === "lg" && (
                        <MKBox
                          variant="gradient"
                          bgColor={"info"}
                          color={"dark"}
                          coloredShadow="dark"
                          borderRadius="xl"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          width="4rem"
                          height="4rem"
                        >
                          <Icon
                            fontSize="large"
                            color="inherit"
                            sx={{
                              color: "dark",
                            }}
                          >
                            {option.icon}
                          </Icon>
                        </MKBox>
                      )}
                      <MKBox ml={2} m={2}>
                        <MKTypography variant="h4" gutterBottom>
                          {option.name}
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                  </Grid>
                </Grid>
              </ToggleButton>
            );
          })}
          {/* <ToggleButton value="web">Web</ToggleButton>
        <ToggleButton value="android">Android</ToggleButton>
        <ToggleButton value="ios">iOS</ToggleButton> */}
        </ToggleButtonGroup>
      </MKBox>
    </Grid>
  );
}
// coloredShadow="info"
