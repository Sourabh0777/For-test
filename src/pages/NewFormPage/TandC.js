import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const TandC = ({ open, handleClose }) => {
  const [content, setContent] = useState([]);
  const fetchTerms = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/terms`);
      console.log("result", result?.data?.content);
      setContent(result?.data?.content);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    fetchTerms();
  }, [open]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vw",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflow: "auto",
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          No Terms & Conditions Added
        </Typography>
        {content?.length ? (
          content?.map((c) => (
            <Typography key={c._id} id="modal-modal-description" sx={{ mt: 2 }}>
              {c.text}
            </Typography>
          ))
        ) : (
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            No Terms & Conditions Added
          </Typography>
        )}
        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          1. 3+1 Car = Any Car with 3 Passenger seats & 1 Driver Seat with NO luggage Carrier
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          2. 6+1 Car = Any Car with 6 Passenger seats & 1 Driver Seat with NO luggage Carrier
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          3. Toll and Parking Charges are EXTRA to be paid by Passenger to driver
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          4. Any change in route and/or landing location will incur extra charges in fare
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          5. Night Halting/Detention charges are EXTRA Rs.1000 to be paid to driver
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          6. Booking will be invalid if the fare amount is not paid in advance.
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          7. Changes in Booking details shall be notified only through Change Request Form.
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          8. Cancellation Charges apply if booking is cancelled within 6 hours of scheduled dept.
          time
        </Typography> */}
      </Box>
    </Modal>
  );
};

TandC.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default TandC;
