import {type ReactNode} from "react";
import Error from "@layout/Error";
import Loading from "@layout/Loading";
import AdminGnb from "@layout/AdminGnb";
import {useProductQuery} from "@recoils/product/query";
import {useNavigate, useParams} from "react-router";
import {Box, Button, IconButton, Typography, Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteAdminProduct} from "@recoils/admin/product/axios";
import {useQueryClient} from "react-query";
import {numberFormat} from "@utils/Numaric";
import {wb} from "theme/adminWorkbench";

export default function ProductView() {
  const {id} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {isLoading, isError, data, error} = useProductQuery(id || "");

  const handlePrev = () => {
    navigate("/admin/product");
  };

  const handleEdit = () => {
    navigate(`/admin/product/write/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("이 상품을 삭제할까요?")) return;
    try {
      await deleteAdminProduct(Number(id));
      queryClient.invalidateQueries("getProductList");
      navigate("/admin/product");
    } catch (err) {
      console.error(err);
      alert("상품 삭제에 실패했습니다");
    }
  };

  return (
    <AdminGnb
      RightButtons={
        <>
          <Tooltip title="삭제">
            <IconButton edge="end" onClick={handleDelete} aria-label="삭제">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="수정">
            <IconButton edge="end" onClick={handleEdit} aria-label="수정">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      }>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error error={error} />
      ) : (
        <MainPane data={data} onPrev={handlePrev} onEdit={handleEdit} />
      )}
    </AdminGnb>
  );
}

function Fact({label, children}: {label: string; children: ReactNode}) {
  return (
    <Box sx={{display: "grid", gridTemplateColumns: "96px 1fr", gap: 1, py: 1, borderBottom: `1px solid ${wb.line}`}}>
      <Box sx={{fontSize: 13, color: wb.mute, fontWeight: 650}}>{label}</Box>
      <Box sx={{fontSize: 14}}>{children}</Box>
    </Box>
  );
}

function MainPane({data, onPrev, onEdit}: {data: any; onPrev: () => void; onEdit: () => void}) {
  if (!data) {
    return (
      <Box sx={{bgcolor: wb.paper, border: `1px solid ${wb.line}`, p: 2.5, color: wb.mute}}>
        상품 정보가 없습니다
      </Box>
    );
  }

  const images = [
    data.thumbnail,
    ...((data.images || []).map((img: any) => img.path) as string[]),
  ].filter(Boolean);
  const uniqueImages = [...new Set(images)];

  return (
    <Box>
      <Box sx={{display: "flex", alignItems: "flex-end", gap: 1, mb: 2}}>
        <Box sx={{flex: 1}}>
          <Typography component="h1" sx={{m: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em"}}>
            {data.title}
          </Typography>
          <Typography sx={{m: 0, mt: 0.5, fontSize: 13, color: wb.mute}}>
            {data.showyn === "Y" ? "노출" : "숨김"} · 재고 {numberFormat(data.capacity, "개")}
          </Typography>
        </Box>
        <Button onClick={onPrev} sx={{color: wb.ink}}>
          목록
        </Button>
        <Button variant="contained" onClick={onEdit}>
          수정
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {xs: "1fr", md: "240px 1fr"},
          gap: 2,
          alignItems: "start",
        }}>
        <Box sx={{bgcolor: wb.paper, border: `1px solid ${wb.line}`, p: 1.5}}>
          {uniqueImages.length === 0 ? (
            <Box sx={{height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: wb.mute, bgcolor: wb.bg}}>
              이미지 없음
            </Box>
          ) : (
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
              <Box
                component="img"
                src={uniqueImages[0]}
                alt={data.title}
                sx={{width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", bgcolor: wb.bg}}
              />
              {uniqueImages.length > 1 && (
                <Box sx={{display: "flex", gap: 0.5, flexWrap: "wrap"}}>
                  {uniqueImages.slice(1).map((src: string) => (
                    <Box
                      key={src}
                      component="img"
                      src={src}
                      alt=""
                      sx={{width: 56, height: 56, objectFit: "cover", border: `1px solid ${wb.line}`}}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{bgcolor: wb.paper, border: `1px solid ${wb.line}`, p: 2.5}}>
          <Fact label="판매가">
            <Box sx={{fontVariantNumeric: "tabular-nums", fontWeight: 700}}>{numberFormat(data.cost)}</Box>
          </Fact>
          <Fact label="재고">{numberFormat(data.capacity, "개")}</Fact>
          <Fact label="노출">{data.showyn === "Y" ? "Y" : "N"}</Fact>
          <Fact label="설명">{data.description || "—"}</Fact>
          {data.options?.length > 0 && (
            <Fact label="옵션">
              {data.options.map((opt: any) => (
                <Box key={opt.optionid} sx={{mb: 0.5}}>
                  {opt.optkey}: {opt.optvals || opt.items?.map((i: any) => i.itemval).join(", ")}
                </Box>
              ))}
            </Fact>
          )}
        </Box>
      </Box>

      {data.editor && (
        <Box sx={{mt: 2, bgcolor: wb.paper, border: `1px solid ${wb.line}`, p: 2.5, whiteSpace: "pre-wrap"}}>
          <Typography sx={{m: 0, mb: 1, fontSize: 13, fontWeight: 650, color: wb.mute}}>상세</Typography>
          <Typography component="div" sx={{fontSize: 14, lineHeight: 1.5}}>
            {data.editor.replace(/<[^>]+>/g, "")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
