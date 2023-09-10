import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import Image from "./Components/Image";
import UserForm from "./Components/UserForm";
import { FormContext } from "./Components/FormContext";
import { useContext } from "react";
import taxi from "assets/images/3644592.jpg";

function Form() {
  const formData = useContext(FormContext);
  console.log("🚀 ~ file: index.js:11 ~ Form ~ formData:", formData);

  return (
    <Grid container spacing={8} alignItems="center" mx={2}>
      <Grid item xs={6} lg={12} p={0} sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        {formData ? <Image image={formData.bgImage} /> : <Image image={taxi} />}
        <UserForm />
      </Grid>
    </Grid>
  );
}

export default Form;
