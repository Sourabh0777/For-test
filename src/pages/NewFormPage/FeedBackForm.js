import { Grid } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import React, { useState } from "react";

const FeedBackForm = () => {
  const [feedback, setFeedback] = useState();
  console.log("🚀 ~ file: FeedBackForm.js:9 ~ FeedBackForm ~ feedback:", feedback);
  const submitHandler = async () => {
    console.log("working");
  };
  return (
    <MKBox p={3}>
      <MKTypography variant="h6" fontWeight="medium" color="text" mb={1}>
        Give Your Feedback
      </MKTypography>
      <MKBox width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} sx={{ width: "80%", height: "100%" }}>
            <MKBox mb={2}>
              <textarea
                rows="4"
                cols="50"
                style={{
                  width: "100%",
                  padding: "10px",
                  overflowY: "auto",
                  resize: "none",
                }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />{" "}
            </MKBox>
            <MKBox mb={2}>
              {" "}
              <MKButton variant="gradient" color="info" onClick={submitHandler}>
                Submit
              </MKButton>
            </MKBox>
          </Grid>
        </Grid>
      </MKBox>
    </MKBox>
  );
};

export default FeedBackForm;
