import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import GalleryView from "./GalleryView";
import ListView from "./ListView";
import {getProductListByCategoryidQuery} from "@recoils/product/query";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Styles} from "@styles";
export default function Category() {
  const [listView, setListView] = useState("gallery");
  const {id} = useParams();
  const {isLoading, isError, data, error} = getProductListByCategoryidQuery(Number(id));
  const styles = Styles();
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <Box sx={styles.container}>
      <Box sx={styles.categoryBox}>
        <Box sx={styles.categoryTitle}>{data && data[0]?.category.title}</Box>
      </Box>
      {/* 일단보존 <Box sx={{ marginTop: "30px", fontSize: "13px", display: "flex" }}>
        <SortArea sort={sort} setSort={setSort} />
        <RightArea setListView={setListView} />
      </Box> */}
      <ContentArea listView={listView} data={data} />
      {/* <Paging /> */}
    </Box>
  );
}
function ContentArea({listView, data}: any) {
  const list = [
    {id: "list", item: <ListView list={data} />},
    {id: "gallery", item: <GalleryView list={data} />},
  ];
  const viewItem = list.find(({id}) => id == listView)?.item;

  return <>{viewItem}</>;
}
// 아래 일단 보존
// function RightArea({setListView}) {
//   const list = [
//     {id: "list", item: <FormatListBulletedIcon />},
//     {id: "gallery", item: <GridViewIcon />},
//   ];
//   const viewList = list.map(({id, item}) => (
//     <Box
//       key={id}
//       component={"li"}
//       sx={{
//         border: "1px solid black",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: "pointer",
//       }}
//       onClick={() => setListView(id)}>
//       {item}
//     </Box>
//   ));

//   return (
//     <Box
//       sx={{
//         marginLeft: "auto",
//         marginRight: "10px",
//         display: "flex",
//         justifyContent: "flex-end",
//         height: "100%",
//         alignItems: "center",
//       }}>
//       <Box sx={{marginRight: "10px"}}>10개씩 보기</Box>
//       <Box component={"ul"} sx={{display: "flex"}}>
//         {viewList}
//       </Box>
//     </Box>
//   );
// }

// function SortArea({ sort, setSort }) {
//   const list = [
//     { id: "1", text: "인기도순" },
//     { id: "2", text: "누적판매순" },
//     { id: "3", text: "낮은가격순" },
//     { id: "4", text: "최신등록순" },
//   ];

//   const sortList = list?.map(({ id, text }) => (
//     <Box
//       key={id}
//       component={"li"}
//       sx={{
//         padding: "0 12px",
//         backgroundColor: "#ffffff",
//         height: "100%",
//         display: "flex",
//         alignItems: "center",
//         cursor: "pointer",
//       }}
//       onClick={() => {
//         setSort(id);
//       }}
//     >
//       {sort == id ? (
//         <>
//           <CheckIcon />
//           <Box component={"strong"}>{text}</Box>
//         </>
//       ) : (
//         text
//       )}
//     </Box>
//   ));
//   return (
//     <Box
//       component={"ul"}
//       sx={{
//         display: "flex",
//         backgroundColor: "#e1e1e1",
//         alignItems: "center",
//         "li + li": { marginLeft: "1px" },
//         "li:first-of-type": { paddingLeft: "0" },
//       }}
//     >
//       {sortList}
//     </Box>
//   );
// }

function Paging() {
  return <>paging</>;
}
