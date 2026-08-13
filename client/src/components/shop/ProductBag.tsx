import {Link} from "react-router-dom";
import {Box} from "@mui/material";
import {numberFormat} from "@utils/Numaric";
import {kraft, lotLabel} from "theme/kraft";

type ProductBagProps = {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  cost: number;
  to: string;
};

export default function ProductBag({id, title, description, thumbnail, cost, to}: ProductBagProps) {
  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: "flex",
        flexDirection: "column",
        color: kraft.ink,
        textDecoration: "none",
      }}>
      <Box
        sx={{
          background: kraft.paperDeep,
          border: `2px solid ${kraft.ink}`,
          padding: "14px 14px 18px",
          boxShadow: kraft.shadow,
        }}>
        <Box
          sx={{
            width: "72%",
            margin: "0 auto 12px",
            aspectRatio: "4 / 5",
            borderRadius: "50% / 42%",
            overflow: "hidden",
            border: "3px solid #3A2414",
            backgroundColor: kraft.window,
          }}>
          <Box
            component="img"
            src={thumbnail}
            alt=""
            sx={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: kraft.sticker,
            padding: "10px",
            border: `1px solid ${kraft.ink}`,
          }}>
          <Box
            sx={{
              fontFamily: kraft.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}>
            {lotLabel(id)}
          </Box>
          <Box
            component="h2"
            sx={{
              margin: "4px 0 6px",
              fontSize: 15,
              lineHeight: 1.3,
              fontWeight: 800,
            }}>
            {title}
          </Box>
          <Box
            sx={{
              margin: 0,
              color: kraft.mute,
              fontSize: 13,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
            {description}
          </Box>
          <Box
            sx={{
              fontFamily: kraft.mono,
              fontSize: 18,
              fontWeight: 600,
              marginTop: "8px",
              fontVariantNumeric: "tabular-nums",
            }}>
            {numberFormat(cost)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
