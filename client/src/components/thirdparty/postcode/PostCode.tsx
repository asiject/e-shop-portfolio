import {Dialog} from "@mui/material";
import React from "react";
import DaumPostcode from "react-daum-postcode";

export default function PostCode({
  open,
  setOpen,
  handleData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleData: Function;
}) {
  const handleComplete = (data: any) => {
    handleData(data);
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose} sx={{".MuiPaper-root": {width: "400px"}}}>
      <DaumPostcode onComplete={handleComplete} />
    </Dialog>
  );
}
