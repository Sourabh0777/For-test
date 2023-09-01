import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

// eslint-disable-next-line react/prop-types
// eslint-disable-next-line react/prop-types
const RadioButtonData = [
  { name: "Bus", label: "Bus", value: "bus" },
  { name: "Car", label: "Car", value: "car" },
  { name: "Package", label: "Package", value: "package" },
];

// eslint-disable-next-line react/prop-types
export default function RadioButtonsGroup({ onChange }) {
  const handleRadioChange = (event) => {
    if (onChange) {
      onChange(event); // Call the onChange function passed from the parent
    }
  };

  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Select Vehicle</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={RadioButtonData[0].value}
        name="radio-buttons-group"
        sx={{ display: "flex", flexDirection: "row" }}
        onChange={handleRadioChange}
      >
        <FormControlLabel
          value={RadioButtonData[0].value}
          control={<Radio />}
          label={RadioButtonData[0].label}
        />
        <FormControlLabel
          value={RadioButtonData[1].value}
          control={<Radio />}
          label={RadioButtonData[1].label}
        />
        <FormControlLabel
          value={RadioButtonData[2].value}
          control={<Radio />}
          label={RadioButtonData[2].label}
        />
      </RadioGroup>
    </FormControl>
  );
}
