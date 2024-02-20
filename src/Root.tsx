import React, { useEffect, useMemo } from "react";
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";

import App from "./components/App";
import AppProvider from "./components/AppProvider";

const globalStyles = (
  <GlobalStyles
    styles={{
      "html, body, #root": {
        height: "100%",
      },

      code: {
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      },
    }}
  />
);

function Root() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.history.state !== null) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  );
}

export default Root;
