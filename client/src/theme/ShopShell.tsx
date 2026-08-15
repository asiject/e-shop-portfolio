import {type ReactNode, useEffect} from "react";
import {Box, ThemeProvider} from "@mui/material";
import {useLocation} from "react-router-dom";
import {rememberPublicPath} from "@utils/safeBack";
import {kraft, kraftTheme} from "./kraft";

export default function ShopShell({children}: {children: ReactNode}) {
  const {pathname} = useLocation();

  useEffect(() => {
    rememberPublicPath(pathname);
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={kraftTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          color: kraft.ink,
          fontFamily: kraft.sans,
          background: `
            radial-gradient(ellipse at 12% 0, rgba(255, 224, 170, 0.28), transparent 46%),
            radial-gradient(ellipse at 90% 80%, rgba(70, 32, 8, 0.22), transparent 42%),
            ${kraft.paper}
          `,
          "::selection": {
            backgroundColor: kraft.ink,
            color: kraft.sticker,
          },
          "a": {
            textDecoration: "none",
          },
          "input, textarea": {
            caretColor: kraft.ink,
          },
          "button:focus-visible, a:focus-visible, input:focus-visible": {
            outline: `3px solid ${kraft.ink}`,
            outlineOffset: "3px",
          },
        }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
