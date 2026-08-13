import Error from "@layout/Error";
import Loading from "@layout/Loading";
import {getProductQuery} from "@recoils/product/query";
import {useNavigate, useParams} from "react-router";
import {Box, AppBar, Toolbar, IconButton, Typography, Tooltip} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
export default function ProductView() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = getProductQuery(id || "");

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const handlePrev = () => {
    navigate(-1);
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
          <RightButtons />
        </Toolbar>
      </AppBar>
      <MainPane data={data} />
    </>
  );
}
function RightButtons() {
  const buttonList = [
    <Tooltip key={"delete"} title="delete">
      <IconButton edge="end" sx={{color: "white"}}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>,
    <Tooltip key={"edit"} title="edit">
      <IconButton edge="end" sx={{color: "white"}}>
        <EditIcon />
      </IconButton>
    </Tooltip>,
  ].filter(Boolean);
  return <Box sx={{display: "flex", gap: 1}}>{buttonList}</Box>;
}
function MainPane({data}: any) {
  return <Box sx={{p: 3}}>{JSON.stringify(data)}</Box>;
}
