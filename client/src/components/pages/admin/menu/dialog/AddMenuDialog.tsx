import {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Box} from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAddItem: (item: {title: string; url: string}) => Promise<void> | void;
};

export default function AddMenuDialog({open, setOpen, handleAddItem}: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
    setTitle("");
    setUrl("");
  };

  const handleSave = async () => {
    const t = title.trim();
    const u = url.trim();
    if (!t || !u) {
      alert("메뉴명(또는 locale key)과 URL을 입력하세요");
      return;
    }
    if (u.length > 20) {
      alert("URL은 20자 이하여야 합니다");
      return;
    }
    setSaving(true);
    try {
      await handleAddItem({title: t, url: u});
      handleClose();
    } catch (err) {
      console.error(err);
      alert("메뉴 추가에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>메뉴 추가</DialogTitle>
      <DialogContent>
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, minWidth: 280, pt: 1}}>
          <TextField
            autoFocus
            margin="dense"
            label="타이틀 (locale key 예: menu.order)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
          />
          <TextField margin="dense" label="URL (예: /admin/order)" value={url} onChange={e => setUrl(e.target.value)} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          취소
        </Button>
        <Button onClick={handleSave} disabled={saving} variant="contained">
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}
