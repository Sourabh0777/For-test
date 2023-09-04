import Grid from "@mui/material/Grid";

// Material Kit 2 React components

import bus from "assets/images/20945950.jpg";
import taxi from "assets/images/3644592.jpg";
import packageImage from "assets/images/11291.jpg";

import Image from "./Components/Image";
import UserForm from "./Components/UserForm";
import ColorToggleButton from "./Components/ColorToggleButton";
import { FormContext } from "./Components/FormContext";
import { useEffect, useState } from "react";
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
function Form() {
  const [selectedOption, setSelectedOption] = useState("taxi");
  const [formData, setFormData] = useState();
  useEffect(() => {
    if (selectedOption == "taxi") {
      setFormData(options[0]);
    }
    if (selectedOption == "bus") {
      setFormData(options[1]);
    }
    if (selectedOption == "package") {
      setFormData(options[2]);
    }
  }, [selectedOption]);

  const selectHandler = (value) => {
    setSelectedOption(value);
  };

  return (
    <FormContext.Provider value={formData}>
      <Grid container spacing={0} alignItems="center">
        <Grid
          item
          xs={12}
          lg={12}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {" "}
          <ColorToggleButton onclick={selectHandler} />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center" sx={{ height: "90vh" }}>
        {formData && <Image image={formData.bgImage} />}

        <Grid
          item
          xs={12}
          sm={10}
          mt={0}
          lg={6}
          xl={5}
          ml={{ xs: "auto", lg: 6 }}
          mr={{ xs: "auto", lg: 6 }}
          sx={{ height: "80vh" }}
        >
          {formData && <UserForm />}
        </Grid>
      </Grid>
    </FormContext.Provider>
  );
}

export default Form;
