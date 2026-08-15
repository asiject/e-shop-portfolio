import {useState} from "react";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import GalleryView from "./GalleryView";
import ListView from "./ListView";
import {useProductListByCategoryidQuery} from "@recoils/product/query";
import Error from "@layout/Error";
import ProductListSkeleton from "@layout/ProductListSkeleton";
import NoData from "@web/common/NoData";
import {Styles} from "@styles";

const SKELETON_COUNT = 4;

export default function Category() {
  const [listView, setListView] = useState("gallery");
  const {id} = useParams();
  const {isLoading, isError, data, error} = useProductListByCategoryidQuery(Number(id));
  const styles = Styles();

  if (isError) {
    return <Error error={error} />;
  }

  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.categoryBox}>
        <Box component="h1" sx={styles.categoryTitle}>
          {data && data[0]?.category.title}
        </Box>
      </Box>
      {isLoading ? (
        <ProductListSkeleton count={SKELETON_COUNT} variant="web" />
      ) : isEmpty ? (
        <NoData />
      ) : (
        <ContentArea listView={listView} data={data} />
      )}
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
