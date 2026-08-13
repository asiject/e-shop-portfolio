import {useEffect, useState} from "react";
import {Box, Select, TextField, FormControlLabel, Switch, Button, IconButton as MuiIconButton} from "@mui/material";
import {AppBar, Toolbar, IconButton, Tooltip, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {useCategoryListQuery} from "@recoils/category/query";
import {useProductQuery} from "@recoils/product/query";
import {postAdminProduct, putAdminProduct, uploadAdminProductImage} from "@recoils/admin/product/axios";
import {useQueryClient} from "react-query";
import Loading from "@layout/Loading";
import Error from "@layout/Error";

type OptionRow = {
  optkey: string;
  optvals: string;
  itemval: string;
  price: string;
  capacity: string;
};

const emptyOption = (): OptionRow => ({
  optkey: "",
  optvals: "",
  itemval: "",
  price: "0",
  capacity: "0",
});

export default function ProductWrite() {
  const navigate = useNavigate();
  const {id} = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const {data: categories, isLoading: catLoading, isError: catError, error: catErr} = useCategoryListQuery();
  const {
    data: product,
    isLoading: prodLoading,
    isError: prodError,
    error: prodErr,
  } = useProductQuery(id || "", {enabled: isEdit});

  const [categoryids, setCategoryids] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showyn, setShowyn] = useState(true);
  const [options, setOptions] = useState<OptionRow[]>([emptyOption()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product || !isEdit) return;
    setTitle(product.title || "");
    setPrice(String(product.cost ?? ""));
    setStock(String(product.capacity ?? ""));
    setDescription(product.description || "");
    setContent(product.editor || "");
    setThumbnail(product.thumbnail || "");
    setImages((product.images || []).map((img: any) => img.path).filter(Boolean));
    setShowyn(product.showyn !== "N");
    setCategoryids((product.categories || []).map((c: any) => Number(c.categoryid)).filter(Boolean));
    if (product.options?.length) {
      setOptions(
        product.options.map((opt: any) => {
          const first = opt.items?.[0];
          return {
            optkey: opt.optkey || "",
            optvals: opt.optvals || "",
            itemval: first?.itemval || opt.optvals || "",
            price: String(first?.price ?? 0),
            capacity: String(first?.capacity ?? 0),
          };
        }),
      );
    }
  }, [product, isEdit]);

  if (catLoading || (isEdit && prodLoading)) {
    return <Loading />;
  }
  if (catError) {
    return <Error error={catErr} />;
  }
  if (isEdit && prodError) {
    return <Error error={prodErr} />;
  }

  const handlePrev = () => {
    navigate("/admin/product");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = [...e.target.options].filter(o => o.selected).map(o => Number(o.value));
    setCategoryids(selected);
  };

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      const {data} = await uploadAdminProductImage(file);
      if (data?.path) {
        if (!thumbnail) setThumbnail(data.path);
        setImages(prev => [...prev, data.path]);
      }
    } catch (err) {
      console.error(err);
      alert("이미지 업로드에 실패했습니다");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("상품명을 입력하세요");
      return;
    }
    if (!price.trim()) {
      alert("판매가를 입력하세요");
      return;
    }
    if (!stock.trim()) {
      alert("재고를 입력하세요");
      return;
    }

    const details = options
      .filter(o => o.optkey.trim())
      .map(o => ({
        optkey: o.optkey.trim(),
        optvals: o.optvals.trim() || o.itemval.trim(),
        items: [
          {
            itemkey: o.optkey.trim(),
            itemval: o.itemval.trim() || o.optvals.trim(),
            price: Number(o.price) || 0,
            capacity: Number(o.capacity) || 0,
            useyn: "Y",
          },
        ],
      }));

    setSaving(true);
    try {
      if (isEdit && id) {
        await putAdminProduct({
          id: Number(id),
          title: title.trim(),
          description: description.trim().slice(0, 100),
          thumbnail,
          cost: Number(price) || 0,
          capacity: Number(stock) || 0,
          optionCnt: Number(stock) || 0,
          showyn: showyn ? "Y" : "N",
          editor: content,
        });
      } else {
        await postAdminProduct({
          categoryids,
          productname: title.trim(),
          price: Number(price) || 0,
          stock: Number(stock) || 0,
          showyn: showyn ? "Y" : "N",
          content,
          description: description.trim().slice(0, 100),
          thumbnail,
          images,
          details,
        });
      }
      queryClient.invalidateQueries("getProductList");
      if (id) queryClient.invalidateQueries("getProduct");
      navigate("/admin/product");
    } catch (err) {
      console.error(err);
      alert("상품 저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton sx={{color: "white"}} edge="start" onClick={handlePrev}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            {isEdit ? "상품수정" : "상품추가"}
          </Typography>
          <Tooltip title="저장">
            <span>
              <IconButton edge="end" sx={{color: "white"}} onClick={handleSave} disabled={saving}>
                <CheckIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          p: 3,
          ".rows": {display: "flex", mb: 1.5, alignItems: "flex-start"},
          ".header": {width: 120, padding: "10px 0", flexShrink: 0},
          ".value": {width: "calc(100% - 120px)"},
        }}>
        <Box className="rows">
          <Box className="header">카테고리</Box>
          <Box className="value">
            <Select
              multiple
              native
              value={categoryids.map(String)}
              onChange={handleCategoryChange as any}
              disabled={isEdit}
              inputProps={{size: 6}}
              sx={{minWidth: 240}}>
              {(categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
            {isEdit && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{mt: 0.5}}>
                수정 시 카테고리는 카테고리 관리에서 연결하세요
              </Typography>
            )}
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">상품명</Box>
          <Box className="value">
            <TextField size="small" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">판매가</Box>
          <Box className="value">
            <TextField size="small" fullWidth type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">재고수량</Box>
          <Box className="value">
            <TextField size="small" fullWidth type="number" value={stock} onChange={e => setStock(e.target.value)} />
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">간단설명</Box>
          <Box className="value">
            <TextField size="small" fullWidth value={description} onChange={e => setDescription(e.target.value)} inputProps={{maxLength: 100}} />
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">노출</Box>
          <Box className="value">
            <FormControlLabel control={<Switch checked={showyn} onChange={e => setShowyn(e.target.checked)} />} label={showyn ? "노출" : "숨김"} />
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">옵션</Box>
          <Box className="value" sx={{display: "flex", flexDirection: "column", gap: 1}}>
            {options.map((row, idx) => (
              <Box key={idx} sx={{display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center"}}>
                <TextField size="small" label="옵션명" value={row.optkey} onChange={e => {
                  const next = [...options];
                  next[idx] = {...next[idx], optkey: e.target.value};
                  setOptions(next);
                }} />
                <TextField size="small" label="옵션값" value={row.itemval} onChange={e => {
                  const next = [...options];
                  next[idx] = {...next[idx], itemval: e.target.value, optvals: e.target.value};
                  setOptions(next);
                }} />
                <TextField size="small" label="추가금" type="number" value={row.price} onChange={e => {
                  const next = [...options];
                  next[idx] = {...next[idx], price: e.target.value};
                  setOptions(next);
                }} sx={{width: 100}} />
                <TextField size="small" label="재고" type="number" value={row.capacity} onChange={e => {
                  const next = [...options];
                  next[idx] = {...next[idx], capacity: e.target.value};
                  setOptions(next);
                }} sx={{width: 100}} />
                <MuiIconButton
                  aria-label="옵션 삭제"
                  onClick={() => setOptions(options.length === 1 ? [emptyOption()] : options.filter((_, i) => i !== idx))}>
                  <DeleteIcon fontSize="small" />
                </MuiIconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => setOptions([...options, emptyOption()])} size="small">
              옵션 추가
            </Button>
            {isEdit && (
              <Typography variant="caption" color="text.secondary">
                수정 모드에서는 기본 정보만 저장됩니다 (옵션은 신규 등록 시 저장)
              </Typography>
            )}
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">대표 이미지</Box>
          <Box className="value" sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <TextField size="small" fullWidth placeholder="/product/images/..." value={thumbnail} onChange={e => setThumbnail(e.target.value)} />
            <Button variant="outlined" component="label" size="small" sx={{alignSelf: "flex-start"}}>
              파일 업로드
              <input hidden type="file" accept="image/*" onChange={e => handleUpload(e.target.files?.[0])} />
            </Button>
            {thumbnail && (
              <Box component="img" src={thumbnail} alt="thumbnail" sx={{maxWidth: 160, maxHeight: 160, objectFit: "cover"}} />
            )}
          </Box>
        </Box>
        <Box className="rows">
          <Box className="header">상세 설명</Box>
          <Box className="value">
            <TextField size="small" fullWidth multiline minRows={6} value={content} onChange={e => setContent(e.target.value)} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
