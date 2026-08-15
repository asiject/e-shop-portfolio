import {useEffect, useState} from "react";
import {isMobile} from "react-device-detect";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {useProductQnaQuery} from "@recoils/product/query";
import {postProductQna} from "@recoils/product/axios";
import {kraft} from "theme/kraft";
import {isProductQnaKind, PRODUCT_QNA_KIND_LABEL, type ProductQnaKind} from "@utils/productQna";

type ProductQnaRow = {
  id: number;
  kind: ProductQnaKind;
  body: string;
  answer?: string;
  createdate: string;
};

type ProductQnaProps = {
  id: string;
  productId?: number;
};

export default function ProductQna({id, productId}: ProductQnaProps) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const user = useRecoilValue(userState);
  const {data, refetch} = useProductQnaQuery(productId);
  const list = (data || []) as ProductQnaRow[];

  const queryKind = params.get("kind");
  const queryOrderid = params.get("orderid") || "";
  const initialKind: ProductQnaKind = isProductQnaKind(queryKind) ? queryKind : "question";

  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ProductQnaKind>(initialKind);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productId) return;
    if (!queryKind && !queryOrderid) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setKind(isProductQnaKind(queryKind) ? queryKind : "return");
    setOpen(true);
  }, [productId, queryKind, queryOrderid, user, navigate]);

  const handleClose = () => {
    setOpen(false);
    setBody("");
    if (queryKind || queryOrderid) {
      const next = new URLSearchParams(params);
      next.delete("kind");
      next.delete("orderid");
      setParams(next, {replace: true});
    }
  };

  const handleOpenWrite = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setKind("question");
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!productId) return;
    if (!body.trim()) {
      alert("문의 내용을 입력하세요");
      return;
    }
    setSaving(true);
    try {
      await postProductQna(productId, {
        kind,
        body: body.trim(),
        orderid: queryOrderid || undefined,
      });
      await refetch();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("문의 등록에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      id={id}
      sx={{
        backgroundColor: kraft.sticker,
        border: `2px solid ${kraft.ink}`,
        padding: "28px 24px",
      }}>
      <Box
        component="h2"
        sx={{
          m: 0,
          fontFamily: kraft.display,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}>
        상품 문의
      </Box>
      <Box sx={{mt: 1, mb: 2, color: kraft.mute, fontSize: 14, lineHeight: 1.45}}>
        옵션·용량·교환·반품은 로그인 후 남겨 주세요.
      </Box>
      <Button variant="outlined" onClick={handleOpenWrite}>
        문의 작성
      </Button>

      {list.length === 0 ? (
        <Box sx={{mt: 2, color: kraft.mute, fontSize: 14}}>아직 등록된 문의는 없습니다.</Box>
      ) : (
        <Box component="ul" sx={{mt: 2, mb: 0, pl: 0, listStyle: "none"}}>
          {list.map(row => (
            <Box
              component="li"
              key={row.id}
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: `1px solid ${kraft.ink}`,
              }}>
              <Box sx={{fontFamily: kraft.mono, fontSize: 11, letterSpacing: "0.08em", color: kraft.mute}}>
                {PRODUCT_QNA_KIND_LABEL[row.kind]}
              </Box>
              <Box sx={{mt: 0.5, fontSize: 14, whiteSpace: "pre-wrap"}}>{row.body}</Box>
              {row.answer ? (
                <Box sx={{mt: 1, fontSize: 14, color: kraft.mute, whiteSpace: "pre-wrap"}}>답변: {row.answer}</Box>
              ) : (
                <Box sx={{mt: 1, fontSize: 13, color: kraft.mute}}>답변 대기</Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        aria-labelledby="product-qna-title"
        PaperProps={{
          sx: {
            backgroundColor: kraft.sticker,
            border: `2px solid ${kraft.ink}`,
            borderRadius: 0,
          },
        }}>
        <DialogTitle
          id="product-qna-title"
          sx={{display: "flex", alignItems: "center", fontFamily: kraft.display, fontWeight: 700, pr: 1}}>
          문의 작성
          <IconButton aria-label="닫기" onClick={handleClose} sx={{ml: "auto", color: kraft.ink}}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{minWidth: isMobile ? undefined : 400, pt: 1}}>
          <FormControl fullWidth size="small" sx={{mt: 1, mb: 2}}>
            <InputLabel id="qna-kind-label">구분</InputLabel>
            <Select
              labelId="qna-kind-label"
              label="구분"
              value={kind}
              onChange={e => setKind(e.target.value as ProductQnaKind)}>
              <MenuItem value="question">{PRODUCT_QNA_KIND_LABEL.question}</MenuItem>
              <MenuItem value="exchange">{PRODUCT_QNA_KIND_LABEL.exchange}</MenuItem>
              <MenuItem value="return">{PRODUCT_QNA_KIND_LABEL.return}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={6}
            label="문의 내용"
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 3, gap: 1}}>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            등록
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
