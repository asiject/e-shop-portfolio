import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Box} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {MStyles} from "@styles";

export default function Location({open, setOpen}: any) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" sx={{display: "flex"}}>
          <Box>위치보기</Box>
          <Box sx={{marginLeft: "auto", cursor: "pointer"}} onClick={() => handleClose()}>
            X
          </Box>
        </DialogTitle>
        <DialogContent sx={MStyles.location}>
          <Box component={"h1"}>
            <InfoIcon />
            INFO
          </Box>
          <Box>E-SHOP</Box>
          <Box component={"h1"}>
            <CallIcon />
            CONTACT
          </Box>
          <Box>02-397-6258</Box>
          <Box component={"h1"}>
            <LocationOnIcon />
            LOCATION
          </Box>
          <Box>서울특별시 종로구 백석동1길 11 (부암동) 1층 (우 : 03020)</Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
