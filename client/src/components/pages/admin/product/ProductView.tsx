import Error from "@layout/Error";
import Loading from "@layout/Loading";
import {useProductQuery} from "@recoils/product/query";
import {useNavigate, useParams} from "react-router";
import {Box, AppBar, Toolbar, IconButton, Typography, Tooltip} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteAdminProduct} from "@recoils/admin/product/axios";
import {useQueryClient} from "react-query";
import {numberFormat} from "@utils/Numaric";

export default function ProductView() {
  const {id} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {isLoading, isError, data, error} = useProductQuery(id || "");

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

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
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton sx={{color: "white"}} edge="start" onClick={handlePrev}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            상품상세
          </Typography>
          <Box sx={{display: "flex", gap: 1}}>
            <Tooltip title="삭제">
              <IconButton edge="end" sx={{color: "white"}} onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="수정">
              <IconButton edge="end" sx={{color: "white"}} onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <MainPane data={data} />
    </>
  );
}

function MainPane({data}: any) {
  if (!data) {
    return <Box sx={{p: 3}}>상품 정보가 없습니다</Box>;
  }
  return (
    <Box sx={{p: 3, display: "flex", flexDirection: "column", gap: 1.5}}>
      {data.thumbnail && (
        <Box component="img" src={data.thumbnail} alt={data.title} sx={{maxWidth: 240, maxHeight: 240, objectFit: "cover"}} />
      )}
      <Typography variant="h5">{data.title}</Typography>
      <Typography>판매가: {numberFormat(data.cost)}</Typography>
      <Typography>재고: {numberFormat(data.capacity, "개")}</Typography>
      <Typography>노출: {data.showyn === "Y" ? "Y" : "N"}</Typography>
      <Typography>설명: {data.description}</Typography>
      {data.options?.length > 0 && (
        <Box>
          <Typography fontWeight={600}>옵션</Typography>
          {data.options.map((opt: any) => (
            <Typography key={opt.optionid}>
              {opt.optkey}: {opt.optvals || opt.items?.map((i: any) => i.itemval).join(", ")}
            </Typography>
          ))}
        </Box>
      )}
      {data.editor && (
        <Box sx={{mt: 2, whiteSpace: "pre-wrap"}}>
          <Typography fontWeight={600}>상세</Typography>
          <Typography component="div">{data.editor}</Typography>
        </Box>
      )}
    </Box>
  );
}
