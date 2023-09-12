/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid, Modal, Slide } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import React from "react";

const BookingConfirmed = ({ open, onClose, data }) => {
  console.log("🚀 ~ file: BookingConfirmed.js:10 ~ BookingConfirmed ~ data:", data);
  const closeHandler = () => {
    console.log("working");
    onClose();
  };
  return (
    <Modal open={open} onClose={closeHandler} sx={{ display: "grid", placeItems: "center" }}>
      <Slide direction="down" in={open} timeout={500}>
        <MKBox
          position="relative"
          width="700px"
          display="flex"
          flexDirection="column"
          borderRadius="xl"
          bgColor="white"
          shadow="xl"
          p={3}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MKTypography variant="h3">Your Booking Token is generated</MKTypography>
            </Grid>
            <Grid item xs={12} md={12} p={5}>
              <MKInput
                type="text"
                variant="standard"
                label="Token ID"
                name="destinationTo"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={data}
              />
            </Grid>{" "}
            <Grid item xs={12} lg={12}>
              <MKBox display="flex" justifyContent={"right"} gap={4}></MKBox>
            </Grid>
          </Grid>
        </MKBox>
      </Slide>
    </Modal>
  );
};

export default BookingConfirmed;
