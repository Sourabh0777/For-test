import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Grid } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

export default function Animations() {
  return (
    <Grid item xs={8} lg={8} mt={0}>
      <MKBox
        bgColor="white"
        borderRadius="xl"
        shadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={{ xs: 0, sm: 0, md: 0 }}
        mb={{ xs: 5, sm: 10, md: 5 }}
        mx={0}
        sx={{ width: 1200 }}
      >
        <MKBox
          variant="gradient"
          bgColor="info"
          coloredShadow="info"
          borderRadius="lg"
          p={2}
          mx={2}
          mt={-2}
        >
          <MKTypography variant="h3" color="white">
            Booking Confirmed
          </MKTypography>
        </MKBox>
        <Box m={5}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Box>
      </MKBox>
    </Grid>
  );
}
