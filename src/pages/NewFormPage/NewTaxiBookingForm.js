import React, { useState } from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";

const NewTaxiBookingForm = ({ setHideButton }) => {
  const [sources, setSources] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationData, setLocationData] = useState([]);

  return (
    <MDBox px={2}>
      <div
        onClick={() => {
          setHideButton(true);
          setSources([]);
          setLocations([]);
          setLocationData([]);
        }}
      >
        {sources[0]?.sourceName}
        {locations[0]?.locationName}
        {locationData[0]?.locationName}
      </div>
    </MDBox>
  );
};

NewTaxiBookingForm.propTypes = {
  setHideButton: PropTypes.func,
};

export default NewTaxiBookingForm;
