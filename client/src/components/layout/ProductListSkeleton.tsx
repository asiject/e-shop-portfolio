import {Box, Skeleton} from "@mui/material";
import {kraft} from "theme/kraft";

type ProductListSkeletonProps = {
  count?: number;
  variant?: "web" | "mobile";
};

const webListSx = {
  display: "flex",
  overflow: "auto",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 0,
  margin: 0,
  li: {marginBottom: "24px"},
};

const webCardSx = {
  width: "25%",
  boxSizing: "border-box",
  padding: "0 10px",
};

const mobileListSx = {
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 0,
  margin: 0,
  li: {padding: "0 1%"},
};

const mobileCardSx = {
  width: "48%",
  marginBottom: "2%",
  boxSizing: "border-box",
};

export default function ProductListSkeleton({count = 4, variant = "web"}: ProductListSkeletonProps) {
  const isMobile = variant === "mobile";

  return (
    <Box
      component="ul"
      sx={isMobile ? mobileListSx : webListSx}
      aria-busy="true"
      aria-label="상품 목록 불러오는 중">
      {Array.from({length: count}, (_, index) => (
        <Box component="li" key={index} sx={isMobile ? mobileCardSx : webCardSx}>
          <Box
            sx={{
              background: kraft.paperDeep,
              border: `2px solid ${kraft.ink}`,
              padding: "14px",
              boxShadow: kraft.shadow,
            }}>
            <Skeleton
              variant="circular"
              animation="wave"
              sx={{
                width: "72%",
                aspectRatio: "4 / 5",
                height: "auto",
                margin: "0 auto 12px",
                bgcolor: "rgba(26,18,11,0.2)",
              }}
            />
            <Box sx={{backgroundColor: kraft.sticker, padding: "10px", border: `1px solid ${kraft.ink}`}}>
              <Skeleton variant="text" width="30%" sx={{bgcolor: "rgba(26,18,11,0.15)"}} />
              <Skeleton variant="text" width="80%" sx={{bgcolor: "rgba(26,18,11,0.15)"}} />
              <Skeleton variant="text" width="50%" sx={{bgcolor: "rgba(26,18,11,0.15)"}} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
