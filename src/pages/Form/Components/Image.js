import MKBox from "components/MKBox";
import React from "react";
import Grid from "@mui/material/Grid";

// eslint-disable-next-line react/prop-types
const Image = ({ image }) => {
  return (
    <Grid item xs={16} lg={10} sm={16} md={16}>
      <MKBox
        display={{ xs: "none", lg: "flex" }}
        width="calc(90% - 1rem)"
        height="calc(70vh - 1rem)"
        minHeight="calc(70vh - 1rem)"
        borderRadius="lg"
        ml={0}
        mt={0}
        sx={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Grid>
  );
};

export default Image;
