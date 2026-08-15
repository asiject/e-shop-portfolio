import {Box} from "@mui/material";
import {kraft} from "theme/kraft";

type NoImageProps = {
  size?: "hero" | "thumb";
};

export default function NoImage({size = "hero"}: NoImageProps) {
  const isThumb = size === "thumb";
  return (
    <Box
      role="img"
      aria-label="no image"
      sx={{
        width: "100%",
        height: "100%",
        minHeight: isThumb ? "100%" : 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: kraft.window,
        color: kraft.sticker,
        fontFamily: kraft.mono,
        fontWeight: 600,
        fontSize: isThumb ? 8 : 14,
        letterSpacing: "0.08em",
        textTransform: "lowercase",
      }}>
      no image
    </Box>
  );
}
