import React, { Suspense, useEffect, useMemo } from "react";
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { ErrorDisplay } from "../ErrorDisplay";
import { useSettings } from "../ActionsProvider";

const FilesDialog = React.lazy(() => import("./FilesDialog"));
const SettingsDialog = React.lazy(() => import("./SettingsDialog"));
const ToolsDialog = React.lazy(() => import("./ToolsDialog"));
const WorkflowDialog = React.lazy(() => import("./WorkflowDialog"));

const globalStyles = (
  <GlobalStyles
    styles={{
      html: {
        position: "relative",
        height: "calc(100% - env(keyboard-inset-height, 0px))",
        transition: "height 0.2s",
      },

      "body, #root": {
        height: "100%",
      },

      code: {
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      },
    }}
  />
);

export function GlobalComponentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = useSettings() ?? {};
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { i18n } = useTranslation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode:
            settings.darkMode !== undefined
              ? settings.darkMode
              : prefersDarkMode
              ? "dark"
              : "light",
        },
        typography: {
          button: {
            textTransform: "none",
          },
        },
      }),
    [settings.darkMode, prefersDarkMode]
  );

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [i18n, settings.language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      {children}
      <Suspense>
        <FilesDialog />
      </Suspense>
      <Suspense>
        <ToolsDialog />
      </Suspense>
      <Suspense>
        <SettingsDialog />
      </Suspense>
      <Suspense>
        <WorkflowDialog />
      </Suspense>
      <ErrorDisplay />
    </ThemeProvider>
  );
}
