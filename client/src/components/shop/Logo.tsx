import {Box} from "@mui/material";
import {Link} from "react-router-dom";
import {kraft} from "theme/kraft";

export const LOGO_SRC = "/public/img/logo.webp";

type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  to?: string;
  size?: LogoSize;
};

const sizePx: Record<LogoSize, number> = {
  sm: 36,
  md: 56,
  lg: 96,
};

export default function Logo({to, size = "md"}: LogoProps) {
  const px = sizePx[size];
  const img = (
    <img
      src={LOGO_SRC}
      alt={to ? "" : "E-SHOP"}
      width={px}
      height={px}
      decoding="async"
      {...{fetchpriority: "high"}}
      style={{width: px, height: px, display: "block", objectFit: "contain"}}
    />
  );

  if (!to) {
    return img;
  }

  return (
    <Box
      component={Link}
      to={to}
      aria-label="E-SHOP 홈"
      sx={{
        display: "inline-flex",
        lineHeight: 0,
        flexShrink: 0,
        "&:focus-visible": {
          outline: `2px solid ${kraft.ink}`,
          outlineOffset: 2,
        },
      }}>
      {img}
    </Box>
  );
}
