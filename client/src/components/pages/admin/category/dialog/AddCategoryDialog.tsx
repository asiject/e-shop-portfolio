import {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Box, MenuItem} from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAddItem: (item: {title: string; type: string; link: string}) => Promise<void> | void;
};

export default function AddCategoryDialog({open, setOpen, handleAddItem}: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PRODUCT");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
    setTitle("");
    setType("PRODUCT");
    setLink("");
  };

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      alert("카테고리명을 입력하세요");
      return;
    }
    setSaving(true);
    try {
      await handleAddItem({title: trimmed, type, link: link.trim()});
      handleClose();
    } catch (err) {
      console.error(err);
      alert("카테고리 추가에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>카테고리 추가</DialogTitle>
      <DialogContent>
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, minWidth: 280, pt: 1}}>
          <TextField
            autoFocus
            margin="dense"
            label="카테고리명"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
          />
          <TextField select margin="dense" label="타입" value={type} onChange={e => setType(e.target.value)} fullWidth>
            <MenuItem value="PRODUCT">상품</MenuItem>
            <MenuItem value="LINK">링크</MenuItem>
          </TextField>
          <TextField margin="dense" label="링크 (선택)" value={link} onChange={e => setLink(e.target.value)} fullWidth />
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
