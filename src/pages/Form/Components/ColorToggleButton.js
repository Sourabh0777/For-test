/* eslint-disable react/prop-types */
import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MKBox from "components/MKBox";
import { Icon } from "@mui/material";
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

  return (
    <MKBox variant="gradient" bgColor="light" borderRadius="lg" mt={10}>
      <ToggleButtonGroup
        color="dark"
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
              sx={{ border: "none", px: 5, background: "#3089EC", borderRadius: "5px" }}
              key={idx}
            >
              <MKBox display="flex">
                <MKBox
                  variant="gradient"
                  bgColor={"dark"}
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
                      color: ({ palette: { info } }) => info.main,
                    }}
                  >
                    {option.icon}
                  </Icon>
                </MKBox>
                <MKBox ml={2} m={2}>
                  <MKTypography variant="h4" gutterBottom>
                    {option.name}
                  </MKTypography>
                </MKBox>
              </MKBox>
            </ToggleButton>
          );
        })}
        {/* <ToggleButton value="web">Web</ToggleButton>
        <ToggleButton value="android">Android</ToggleButton>
        <ToggleButton value="ios">iOS</ToggleButton> */}
      </ToggleButtonGroup>
    </MKBox>
  );
}
// coloredShadow="info"
