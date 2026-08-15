import {useEffect, useState, type ChangeEvent, type ReactNode} from "react";
import {Box, Select, TextField, FormControlLabel, Switch, Button, IconButton as MuiIconButton, Typography, Tooltip, IconButton} from "@mui/material";
import {useNavigate, useParams} from "react-router";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {useCategoryListQuery} from "@recoils/category/query";
import {useProductQuery} from "@recoils/product/query";
import {postAdminProduct, putAdminProduct, uploadAdminProductImage} from "@recoils/admin/product/axios";
import {useQueryClient} from "react-query";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import AdminGnb from "@layout/AdminGnb";
import {wb} from "theme/adminWorkbench";

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

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: wb.paper,
    borderRadius: "2px",
    "& fieldset": {borderColor: wb.line},
    "&:hover fieldset": {borderColor: wb.ink},
    "&.Mui-focused fieldset": {borderColor: wb.ink},
  },
};

function FieldRow({label, children}: {label: string; children: ReactNode}) {
  return (
    <Box sx={{display: "flex", gap: 2, alignItems: "flex-start", mb: 2}}>
      <Box sx={{width: 96, flexShrink: 0, pt: "10px", fontSize: 13, fontWeight: 650, color: wb.mute}}>{label}</Box>
      <Box sx={{flex: 1, minWidth: 0}}>{children}</Box>
    </Box>
  );
}

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

  const handlePrev = () => {
    navigate("/admin/product");
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
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

  const handleRemoveImage = (path: string) => {
    setImages(prev => prev.filter(p => p !== path));
    if (thumbnail === path) {
      setThumbnail("");
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
          images,
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
    <AdminGnb
      RightButtons={
        <Tooltip title="저장">
          <span>
            <IconButton edge="end" onClick={handleSave} disabled={saving} aria-label="저장">
              <CheckIcon />
            </IconButton>
          </span>
        </Tooltip>
      }>
      {catLoading || (isEdit && prodLoading) ? (
        <Loading />
      ) : catError ? (
        <Error error={catErr} />
      ) : isEdit && prodError ? (
        <Error error={prodErr} />
      ) : (
        <Box>
          <Box sx={{display: "flex", alignItems: "flex-end", gap: 1, mb: 2}}>
            <Box sx={{flex: 1}}>
              <Typography component="h1" sx={{m: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em"}}>
                {isEdit ? "상품 수정" : "상품 등록"}
              </Typography>
              <Typography sx={{m: 0, mt: 0.5, fontSize: 13, color: wb.mute}}>
                {isEdit ? "기본 정보를 고친 뒤 저장합니다." : "카테고리·가격·옵션을 한 화면에서 넣습니다."}
              </Typography>
            </Box>
            <Button onClick={handlePrev} sx={{color: wb.ink}}>
              목록
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              저장
            </Button>
          </Box>

          <Box sx={{bgcolor: wb.paper, border: `1px solid ${wb.line}`, p: 2.5, maxWidth: 840}}>
            <FieldRow label="카테고리">
              <Select
                multiple
                native
                value={categoryids.map(String)}
                onChange={handleCategoryChange as any}
                disabled={isEdit}
                inputProps={{"aria-label": "카테고리", size: 6}}
                sx={{minWidth: 240, ...fieldSx}}>
                {(categories || []).map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
              {isEdit && (
                <Typography sx={{mt: 0.5, fontSize: 12, color: wb.mute}}>수정 시 카테고리는 카테고리 관리에서 연결하세요</Typography>
              )}
            </FieldRow>
            <FieldRow label="상품명">
              <TextField size="small" fullWidth value={title} onChange={e => setTitle(e.target.value)} sx={fieldSx} />
            </FieldRow>
            <FieldRow label="판매가">
              <TextField size="small" fullWidth type="number" value={price} onChange={e => setPrice(e.target.value)} sx={fieldSx} />
            </FieldRow>
            <FieldRow label="재고수량">
              <TextField size="small" fullWidth type="number" value={stock} onChange={e => setStock(e.target.value)} sx={fieldSx} />
            </FieldRow>
            <FieldRow label="간단설명">
              <TextField
                size="small"
                fullWidth
                value={description}
                onChange={e => setDescription(e.target.value)}
                inputProps={{maxLength: 100}}
                sx={fieldSx}
              />
            </FieldRow>
            <FieldRow label="노출">
              <FormControlLabel
                control={<Switch checked={showyn} onChange={e => setShowyn(e.target.checked)} />}
                label={showyn ? "노출" : "숨김"}
              />
            </FieldRow>
            <FieldRow label="옵션">
              <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                {options.map((row, idx) => (
                  <Box key={idx} sx={{display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center"}}>
                    <TextField
                      size="small"
                      label="옵션명"
                      value={row.optkey}
                      onChange={e => {
                        const next = [...options];
                        next[idx] = {...next[idx], optkey: e.target.value};
                        setOptions(next);
                      }}
                      sx={fieldSx}
                    />
                    <TextField
                      size="small"
                      label="옵션값"
                      value={row.itemval}
                      onChange={e => {
                        const next = [...options];
                        next[idx] = {...next[idx], itemval: e.target.value, optvals: e.target.value};
                        setOptions(next);
                      }}
                      sx={fieldSx}
                    />
                    <TextField
                      size="small"
                      label="추가금"
                      type="number"
                      value={row.price}
                      onChange={e => {
                        const next = [...options];
                        next[idx] = {...next[idx], price: e.target.value};
                        setOptions(next);
                      }}
                      sx={{width: 100, ...fieldSx}}
                    />
                    <TextField
                      size="small"
                      label="재고"
                      type="number"
                      value={row.capacity}
                      onChange={e => {
                        const next = [...options];
                        next[idx] = {...next[idx], capacity: e.target.value};
                        setOptions(next);
                      }}
                      sx={{width: 100, ...fieldSx}}
                    />
                    <MuiIconButton
                      aria-label="옵션 삭제"
                      onClick={() => setOptions(options.length === 1 ? [emptyOption()] : options.filter((_, i) => i !== idx))}>
                      <DeleteIcon fontSize="small" />
                    </MuiIconButton>
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={() => setOptions([...options, emptyOption()])} size="small" sx={{alignSelf: "flex-start", color: wb.ink}}>
                  옵션 추가
                </Button>
                {isEdit && (
                  <Typography sx={{fontSize: 12, color: wb.mute}}>수정 모드에서는 기본 정보만 저장됩니다 (옵션은 신규 등록 시 저장)</Typography>
                )}
              </Box>
            </FieldRow>
            <FieldRow label="이미지">
              <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="/product/images/..."
                  value={thumbnail}
                  onChange={e => setThumbnail(e.target.value)}
                  sx={fieldSx}
                />
                <Button variant="outlined" component="label" size="small" sx={{alignSelf: "flex-start"}}>
                  파일 업로드
                  <input hidden type="file" accept="image/*" onChange={e => handleUpload(e.target.files?.[0])} />
                </Button>
                {images.length > 0 && (
                  <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5}}>
                    {images.map(path => {
                      const isThumb = path === thumbnail;
                      return (
                        <Box key={path} sx={{position: "relative", width: 88, height: 88}}>
                          <Box
                            component="button"
                            type="button"
                            onClick={() => setThumbnail(path)}
                            aria-pressed={isThumb}
                            aria-label={isThumb ? "대표 이미지" : "대표로 지정"}
                            sx={{
                              width: "100%",
                              height: "100%",
                              p: 0,
                              border: `1px solid ${isThumb ? wb.action : wb.line}`,
                              bgcolor: wb.bg,
                              cursor: "pointer",
                              overflow: "hidden",
                            }}>
                            <Box component="img" src={path} alt="" sx={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
                          </Box>
                          <MuiIconButton
                            aria-label="이미지 삭제"
                            size="small"
                            onClick={() => handleRemoveImage(path)}
                            sx={{position: "absolute", top: 0, right: 0, bgcolor: wb.paper}}>
                            <DeleteIcon fontSize="inherit" />
                          </MuiIconButton>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </FieldRow>
            <FieldRow label="상세 설명">
              <TextField size="small" fullWidth multiline minRows={6} value={content} onChange={e => setContent(e.target.value)} sx={fieldSx} />
            </FieldRow>
          </Box>
        </Box>
      )}
    </AdminGnb>
  );
}
