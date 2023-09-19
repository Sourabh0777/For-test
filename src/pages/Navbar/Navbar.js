/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import SearchBooking from "pages/Form/Components/SearchBooking";
import ColorToggleButton from "pages/Form/Components/ColorToggleButton";
import bus from "assets/images/20945950.jpg";
import taxi from "assets/images/3644592.jpg";
import packageImage from "assets/images/11291.jpg";

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
const Navbar = ({ changeTypeHandler }) => {
  const selectHandler = (value) => {
    console.log("🚀 ~ file: Navbar.js:36 ~ selectHandler ~ value:", value);
    if (value == "taxi") {
      changeTypeHandler(options[0]);
    }
    if (value == "bus") {
      changeTypeHandler(options[1]);
    }
    if (value == "package") {
      changeTypeHandler(options[2]);
    }
  };
  return (
    <>
      {" "}
      {/* <SearchBooking /> */}
      <ColorToggleButton onclick={selectHandler} />
    </>
  );
};

Navbar.propTypes = {};

export default Navbar;
