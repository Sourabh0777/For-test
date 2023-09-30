/* eslint-disable react/prop-types */
import { ButtonGroup } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import React, { useEffect, useState } from "react";

const GroupButton = ({ onClick }) => {
  const tabs = [
    {
      title: "Taxi",
      component: <h1>Taxi</h1>,
    },
    {
      title: "Bus",
      component: <h1>Bus</h1>,
    },
  ];
  const [tabOpen, setTabOpen] = useState(tabs[0]?.title);
  useEffect(() => {
    onClick(tabOpen);
  }, [tabOpen]);

  return (
    <MKBox pt={2} pb={2} px={3}>
      <ButtonGroup variant="gradient" aria-label="outlined button group" shadow={"large"}>
        <MKButton
          onClick={() => setTabOpen("Taxi")}
          variant="gradient"
          color={tabOpen === "Taxi" ? "info" : "white"}
          style={{ color: tabOpen === "Taxi" ? "white" : "inherit" }}
        >
          Taxi
        </MKButton>
        <MKButton
          onClick={() => setTabOpen("Bus")}
          variant="gradient"
          color={tabOpen === "Bus" ? "info" : "white"}
          style={{ color: tabOpen === "Bus" ? "white" : "inherit" }}
        >
          Bus
        </MKButton>
      </ButtonGroup>
    </MKBox>
  );
};

export default GroupButton;
