import {useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";
import {bindSnackbar, type SnackNotice} from "@utils/notify";

export default function AppSnackbar() {
  const [notice, setNotice] = useState<SnackNotice | null>(null);

  useEffect(() => {
    bindSnackbar(next => setNotice(next));
    return () => bindSnackbar(null);
  }, []);

  const handleClose = () => setNotice(null);

  return (
    <Snackbar
      open={Boolean(notice)}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
      {notice ? (
        <Alert severity={notice.severity} variant="filled" onClose={handleClose} sx={{width: "100%"}}>
          {notice.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
