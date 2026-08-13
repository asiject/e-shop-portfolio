import {createTheme} from "@mui/material";

export const kraft = {
  ink: "#1A120B",
  paper: "#B48445",
  paperDeep: "#8D5A2B",
  sticker: "#F3E6C9",
  stamp: "#B42318",
  mute: "#4A341F",
  window: "#2A1A10",
  shadow: "6px 8px 0 rgba(26, 18, 11, 0.28)",
  sans: '"Noto Sans KR", sans-serif',
  display: '"Archivo Narrow", "Noto Sans KR", sans-serif',
  mono: '"Spline Sans Mono", ui-monospace, monospace',
} as const;

export const lotLabel = (id: string | number) => `LOT ${String(id).padStart(2, "0")}`;

export const kraftTheme = createTheme({
  palette: {
    primary: {
      main: kraft.ink,
      contrastText: kraft.sticker,
    },
    secondary: {
      main: kraft.stamp,
      contrastText: kraft.sticker,
    },
    background: {
      default: kraft.paper,
      paper: kraft.sticker,
    },
    text: {
      primary: kraft.ink,
      secondary: kraft.mute,
    },
  },
  typography: {
    fontFamily: kraft.sans,
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
        },
        contained: {
          backgroundColor: kraft.ink,
          color: kraft.sticker,
          "&:hover": {
            backgroundColor: "#2A1E14",
            boxShadow: "none",
          },
        },
        outlined: {
          border: `2px solid ${kraft.ink}`,
          color: kraft.ink,
          backgroundColor: kraft.sticker,
          "&:hover": {
            border: `2px solid ${kraft.ink}`,
            backgroundColor: "#E8D7B4",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: kraft.sticker,
          borderRadius: 0,
          "& fieldset": {
            borderColor: kraft.ink,
          },
          "&:hover fieldset": {
            borderColor: kraft.ink,
          },
          "&.Mui-focused fieldset": {
            borderColor: kraft.ink,
            borderWidth: 2,
          },
        },
        input: {
          color: kraft.ink,
        },
      },
    },
  },
});
