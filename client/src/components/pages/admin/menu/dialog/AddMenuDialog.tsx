import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {Box} from "@mui/material";

export default function AddMenuDialog({open, setOpen, handleAddItem}: any) {
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    console.log("handleSave >");
    setOpen(false);
    handleAddItem("1234");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>메뉴 추가</DialogTitle>
      <DialogContent>
        <Box>
          <TextField autoFocus margin="dense" id="name" label="메뉴 이름" />
        </Box>
        <Box>
          <TextField autoFocus margin="dense" id="name" label="메뉴 url" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleClose}>추가</Button>
      </DialogActions>
    </Dialog>
  );
}
