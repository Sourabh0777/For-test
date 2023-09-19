/* eslint-disable react/prop-types */
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import Image from "./Components/Image";
import UserForm from "./Components/UserForm";
import { FormContext } from "./Components/FormContext";
import taxi from "assets/images/3644592.jpg";
import BusForm from "./Components/BusForm";
import { useState } from "react";
import PackageForm from "./Components/PackageForm";

function Form() {
  const a = {
    bgImage: taxi,
    heading: "Taxi",
    name: "Taxi",
    value: "taxi",
    icon: "local_taxi_icon",
  };
  const [formData, setFormData] = useState(a);
  const changeTypeHandler = (value) => {
    setFormData(value);
  };
  console.log("🚀 ~ file: index.js:21 ~ Form ~ formData:", formData);

  return (
    <FormContext.Provider value={formData}>
      <Grid container spacing={8} alignItems="center" mx={5}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          p={0}
          sx={{ display: "flex", justifyContent: "center", mt: 5 }}
        >
          {formData ? <Image image={formData.bgImage} /> : <Image image={taxi} />}
          {formData.value == "taxi" && <UserForm changeTypeHandler={changeTypeHandler} />}
          {formData.value == "bus" && <BusForm changeTypeHandler={changeTypeHandler} />}
          {formData.value == "package" && <PackageForm changeTypeHandler={changeTypeHandler} />}
        </Grid>
      </Grid>
    </FormContext.Provider>
  );
}

export default Form;
