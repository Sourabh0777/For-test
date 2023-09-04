/* eslint-disable react/prop-types */
import React from "react";
import MKBox from "components/MKBox";
// import MKTypography from "components/MKTypography";
// import { Icon } from "@mui/material";
// import MKButton from "components/MKButton";
import TripleToggleSwitch from "./triple";

const SelectTypeForm = ({ onClick }) => {
  const labels = {
    left: {
      title: "Car",
      value: "car",
    },
    right: {
      title: "Package",
      value: "Package",
    },
    center: {
      title: "Bus",
      value: "bus",
    },
  };

  const onChange = (value) => {
    onClick(value);
  };

  return (
    <>
      {/* <MKBox
        bgColor="dark"
        borderRadius="xl"
        shadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={{ xs: 10, sm: 8, md: 10 }}
        mb={{ xs: 0, sm: 0, md: 0 }}
        mx={8}
      > */}
      {/* <MKBox
          variant="gradient"
          bgColor="info"
          coloredShadow="info"
          borderRadius="lg"
          p={2}
          mx={0}
          mt={0}
        >
          <MKTypography variant="h3" color="white">
            How you wish to travel with us?
          </MKTypography>
        </MKBox> */}
      {/* </MKBox> */}
      <MKBox
        borderRadius="xl"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={{ xs: 5, sm: 8, md: 5 }}
        mb={{ xs: 5, sm: 8, md: 3 }}
        mx={8}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "space-between",
          justifyContent: "start",
          width: "100%",
        }}
      >
        <TripleToggleSwitch labels={labels} onChange={onChange} />
      </MKBox>
    </>
  );
};

SelectTypeForm.propTypes = {};

export default SelectTypeForm;
