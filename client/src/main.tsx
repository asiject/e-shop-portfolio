import React from "react";
import ReactDOM from "react-dom/client";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {BrowserRouter} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import {QueryClient, QueryClientProvider} from "react-query";
import {IntlProvider} from "react-intl";

import App from "./App";
import {RecoilRoot, useRecoilValue} from "recoil";
import {localeState} from "@recoils/admin/menu/state";
import {ko, en} from "./locales";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const theme = createTheme({
  palette: {
    primary: {
      main: "#9ac66d",
      contrastText: "#FFFFFF",
    },
  },
});
const queryClient = new QueryClient();
const locales: any = {ko, en};
function Init() {
  const locale = useRecoilValue(localeState);
  const messages = locales[locale];
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <IntlProvider locale={locale} messages={messages}>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ThemeProvider>
        </IntlProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RecoilRoot>
    <Init />
  </RecoilRoot>,
  // </React.StrictMode>,
);
