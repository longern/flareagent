import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  Box,
  Button,
  Card,
  Container,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slider,
  Stack,
  Switch,
  TextField,
  Theme,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Help as HelpIcon,
  Lock as LockIcon,
  NavigateNext as NavigateNextIcon,
  Save as SaveIcon,
  Tune as TuneIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";

import AccountDialogContent from "./AccountDialogContent";
import { HistoryDialog } from "./HistoryDialog";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { hideSettings } from "../../app/dialogs";
import { setSettings } from "../../app/settings";
import { AppState } from "../../app/store";
import { clearMemories, deleteMemory } from "../../app/memories";

export const SparseList = styled(List)(() => ({
  padding: 0,
  "& .MuiListItemButton-root": { minHeight: 60 },
}));

function LanguageDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const language = useAppSelector((state) => state.settings.language);
  const dispatch = useAppDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleChangeLanguage = useCallback(() => {
    dispatch(setSettings({ key: "language", value: selectedLanguage }));
    i18n.changeLanguage(selectedLanguage);
    onClose();
  }, [dispatch, selectedLanguage, i18n, onClose]);

  function getDisplayName(code: string, locale: string) {
    try {
      return new Intl.DisplayNames([locale], { type: "language" }).of(code);
    } catch (e) {
      return code;
    }
  }

  return (
    <HistoryDialog
      hash="language"
      title={t("Language")}
      open={open}
      onClose={onClose}
      endAdornment={({ onClose }) => (
        <IconButton
          aria-label={t("Save")}
          size="large"
          color="inherit"
          onClick={() => {
            handleChangeLanguage();
            onClose();
          }}
        >
          <CheckIcon />
        </IconButton>
      )}
    >
      <DialogContent>
        <Card elevation={0}>
          <SparseList>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setSelectedLanguage(undefined)}>
                <ListItemText primary={t("System default")} />
                {selectedLanguage === undefined && (
                  <CheckIcon color="success" />
                )}
              </ListItemButton>
            </ListItem>
            {Object.keys(i18n.options.resources).map((language) => (
              <ListItem key={language} disablePadding>
                <ListItemButton onClick={() => setSelectedLanguage(language)}>
                  <ListItemText primary={getDisplayName(language, language)} />
                  {selectedLanguage === language && (
                    <CheckIcon color="success" />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </SparseList>
        </Card>
      </DialogContent>
    </HistoryDialog>
  );
}

function DarkModeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const settingsDarkMode = useAppSelector((state) => state.settings.darkMode);
  const [darkMode, setDarkMode] = useState(settingsDarkMode);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  return (
    <HistoryDialog
      hash="dark-mode"
      title={t("Dark Mode")}
      open={open}
      onClose={onClose}
      endAdornment={({ onClose }) => (
        <IconButton
          size="large"
          color="inherit"
          aria-label={t("Save")}
          onClick={() => {
            dispatch(setSettings({ key: "darkMode", value: darkMode }));
            onClose();
          }}
        >
          <CheckIcon />
        </IconButton>
      )}
    >
      <DialogContent>
        <Card elevation={0}>
          <SparseList>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDarkMode(undefined)}>
                <ListItemText primary={t("System default")} />
                {darkMode === undefined && <CheckIcon color="success" />}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDarkMode("light")}>
                <ListItemText primary={t("Light Mode")} />
                {darkMode === "light" && <CheckIcon color="success" />}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDarkMode("dark")}>
                <ListItemText primary={t("Dark Mode")} />
                {darkMode === "dark" && <CheckIcon color="success" />}
              </ListItemButton>
            </ListItem>
          </SparseList>
        </Card>
      </DialogContent>
    </HistoryDialog>
  );
}

function GeneralContent() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [darkModeOpen, setDarkModeOpen] = useState(false);

  const settings = useAppSelector((state) => state.settings);
  const { t, i18n } = useTranslation();

  function getDisplayName(code: string, locale: string) {
    try {
      return new Intl.DisplayNames([locale], { type: "language" }).of(code);
    } catch (e) {
      return code;
    }
  }

  const handleLanguageClose = useCallback(() => {
    setLanguageOpen(false);
  }, []);

  const handleDarkModeClose = useCallback(() => {
    setDarkModeOpen(false);
  }, []);

  return (
    <>
      <Card elevation={0}>
        <SparseList>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setLanguageOpen(true)}>
              <ListItemText
                primary={t("Language")}
                secondary={
                  settings.language === undefined
                    ? t("System default")
                    : getDisplayName(settings.language, i18n.language)
                }
              />
              <NavigateNextIcon />
            </ListItemButton>
          </ListItem>
          <Divider component="li" />
          <ListItem disablePadding>
            <ListItemButton onClick={() => setDarkModeOpen(true)}>
              <ListItemText
                primary={t("Dark Mode")}
                secondary={
                  settings?.darkMode === undefined
                    ? t("System default")
                    : settings.darkMode === "light"
                    ? t("Light Mode")
                    : t("Dark Mode")
                }
              />
              <NavigateNextIcon />
            </ListItemButton>
          </ListItem>
        </SparseList>
      </Card>
      <LanguageDialog open={languageOpen} onClose={handleLanguageClose} />
      <DarkModeDialog open={darkModeOpen} onClose={handleDarkModeClose} />
    </>
  );
}

function SystemPromptEditor({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const systemPrompt = useAppSelector((state) => state.settings.systemPrompt);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(systemPrompt ?? "");

  const { t } = useTranslation();

  return (
    <HistoryDialog
      hash="system-prompt"
      title={t("System prompt")}
      open={open}
      onClose={onClose}
      endAdornment={({ onClose }) => (
        <IconButton
          size="large"
          color="inherit"
          aria-label={t("Save")}
          onClick={() => {
            dispatch(
              setSettings({ key: "systemPrompt", value: value ?? undefined })
            );
            onClose();
          }}
        >
          <SaveIcon />
        </IconButton>
      )}
    >
      <Card elevation={0} sx={{ height: "100%" }}>
        <TextField
          variant="standard"
          fullWidth
          multiline
          minRows={20}
          maxRows={20}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          inputProps={{ sx: { padding: 2 } }}
        />
      </Card>
    </HistoryDialog>
  );
}

function PersonalizationContent() {
  const memories = useAppSelector((state) => state.memories.memories);
  const systemPrompt = useAppSelector((state) => state.settings.systemPrompt);
  const temperature = useAppSelector((state) => state.settings.temperature);
  const disableMemory = useAppSelector((state) => state.settings.disableMemory);
  const [showSystemPromptEditor, setShowSystemPromptEditor] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Stack height="100%" spacing={1}>
      <Card elevation={0}>
        <SparseList>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setShowSystemPromptEditor(true)}>
              <ListItemText
                primary={t("System prompt")}
                secondary={systemPrompt}
              />
              <NavigateNextIcon />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <Box sx={{ width: "100%" }}>
              <Box component="label" id="temperature-slider-label">
                {t("Temperature")}
              </Box>
              <Slider
                aria-labelledby="temperature-slider-label"
                value={temperature ?? 1}
                onChange={(_, value) => {
                  dispatch(
                    setSettings({
                      key: "temperature",
                      value: value === 1 ? undefined : (value as number),
                    })
                  );
                }}
                step={0.1}
                min={0}
                max={2}
                valueLabelDisplay="auto"
              />
            </Box>
          </ListItem>
        </SparseList>
      </Card>
      <SparseList>
        <ListItem disablePadding>
          <ListItemButton component="label" disableRipple>
            <ListItemText primary={t("Memory")} />
            <Switch
              color="primary"
              checked={!disableMemory}
              onChange={(event) => {
                dispatch(
                  setSettings({
                    key: "disableMemory",
                    value: !event.target.checked || undefined,
                  })
                );
              }}
            />
          </ListItemButton>
        </ListItem>
      </SparseList>
      <Card variant="outlined" sx={{ flexGrow: 1, overflow: "auto" }}>
        <SparseList>
          {Object.values(memories).map((memory) => (
            <ListItem key={memory.id}>
              <ListItemText primary={memory.content} />
              <IconButton onClick={() => deleteMemory(memory.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </SparseList>
      </Card>
      <Box>
        <Button
          variant="outlined"
          color="error"
          onClick={() => dispatch(clearMemories())}
        >
          {t("Clear memory")}
        </Button>
      </Box>
      <SystemPromptEditor
        open={showSystemPromptEditor}
        onClose={() => setShowSystemPromptEditor(false)}
      />
    </Stack>
  );
}

function PermissionIcon({ state }: { state: PermissionState | null }) {
  switch (state) {
    case "granted":
      return <CheckCircleIcon color="success" />;
    case "denied":
      return <CancelIcon color="error" />;
    case "prompt":
      return <HelpIcon color="primary" />;
    default:
      return null;
  }
}

const PERMISSIONS = [
  "geolocation",
  "notifications",
  "camera",
  "microphone",
  "accelerometer",
  "magnetometer",
  "clipboard-read",
  "clipboard-write",
] as PermissionName[];

const PERMISSION_REQUESTERS = {
  geolocation: () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }),
  notifications: () => Notification.requestPermission(),
  camera: () =>
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => stream.getTracks().forEach((track) => track.stop())),
  microphone: () =>
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => stream.getTracks().forEach((track) => track.stop())),
  "clipboard-read": () => navigator.clipboard.readText(),
};

function PermissionsContent() {
  const [permissions, setPermissions] = useState<
    Partial<Record<PermissionName, PermissionState | null>>
  >(Object.fromEntries(PERMISSIONS.map((name) => [name, null] as const)));

  const { t } = useTranslation();

  useEffect(() => {
    Promise.allSettled(
      PERMISSIONS.map(async (name: PermissionName) => {
        const status = await navigator.permissions.query({ name });
        return [name, status.state] as const;
      })
    ).then((results) => {
      setPermissions(
        Object.fromEntries(
          results.flatMap((result) =>
            result.status === "fulfilled" ? [result.value] : []
          )
        )
      );
    });
  }, []);

  function requestPermission(name: PermissionName) {
    if (!(name in PERMISSION_REQUESTERS)) return;
    PERMISSION_REQUESTERS[name]()
      .catch(() => {})
      .finally(() => {
        navigator.permissions.query({ name }).then((status) => {
          setPermissions((permissions) => ({
            ...permissions,
            [name]: status.state,
          }));
        });
      });
  }

  return (
    <Card elevation={0}>
      <SparseList>
        {Object.entries(permissions).map(
          ([name, state]: [PermissionName, PermissionState | null]) => (
            <ListItem key={name} disablePadding>
              <ListItemButton
                onClick={() => state === "prompt" && requestPermission(name)}
              >
                <ListItemText
                  primary={t(
                    name
                      .replaceAll("-", " ")
                      .replace(/^./, (ch) => ch.toUpperCase())
                  )}
                />
                <PermissionIcon state={state} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </SparseList>
    </Card>
  );
}

function SettingsForm() {
  type TabName = "Account" | "General" | "Personalization" | "Permissions";
  const [activeTab, setActiveTab] = useState<TabName | null>(null);

  const { t } = useTranslation();
  const matchesLg = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  useEffect(() => {
    if (activeTab === null && matchesLg) {
      setActiveTab("Account");
    }
  }, [activeTab, matchesLg]);

  const handleTabClose = useCallback(() => {
    setActiveTab(null);
  }, []);

  const tabs = (
    <Card elevation={0}>
      <SparseList>
        <ListItem disablePadding>
          <ListItemButton
            selected={activeTab === "Account"}
            onClick={() => setActiveTab("Account")}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary={t("Account")} />
            <NavigateNextIcon />
          </ListItemButton>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem disablePadding>
          <ListItemButton
            selected={activeTab === "General"}
            onClick={() => setActiveTab("General")}
          >
            <ListItemIcon>
              <TuneIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary={t("General")} />
            <NavigateNextIcon />
          </ListItemButton>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem disablePadding>
          <ListItemButton
            selected={activeTab === "Personalization"}
            onClick={() => setActiveTab("Personalization")}
          >
            <ListItemIcon>
              <PsychologyIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary={t("Personalization")} />
            <NavigateNextIcon />
          </ListItemButton>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem disablePadding>
          <ListItemButton
            selected={activeTab === "Permissions"}
            onClick={() => setActiveTab("Permissions")}
          >
            <ListItemIcon>
              <LockIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary={t("Permissions")} />
            <NavigateNextIcon />
          </ListItemButton>
        </ListItem>
      </SparseList>
    </Card>
  );

  const content =
    activeTab === "Account" ? (
      <AccountDialogContent />
    ) : activeTab === "General" ? (
      <GeneralContent />
    ) : activeTab === "Personalization" ? (
      <PersonalizationContent />
    ) : activeTab === "Permissions" ? (
      <PermissionsContent />
    ) : null;

  return matchesLg ? (
    <Stack direction="row" spacing={2} sx={{ height: "100%" }}>
      <Box width={300}>{tabs}</Box>
      <Box flexGrow={1}>
        <Container maxWidth="md" sx={{ height: "100%" }}>
          {content}
        </Container>
      </Box>
    </Stack>
  ) : (
    <>
      {tabs}
      <HistoryDialog
        hash={activeTab || ""}
        title={t(activeTab || "Settings")}
        open={activeTab !== null}
        onClose={handleTabClose}
      >
        <DialogContent sx={{ p: 2 }}>{content}</DialogContent>
      </HistoryDialog>
    </>
  );
}

function SettingsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <HistoryDialog
      hash="settings"
      title={t("Settings")}
      open={open}
      onClose={onClose}
    >
      <DialogContent sx={{ p: 2 }}>
        <SettingsForm />
      </DialogContent>
    </HistoryDialog>
  );
}

export default connect(
  (state: AppState) => ({
    open: state.dialogs.settings,
  }),
  (dispatch) => ({
    onClose: () => dispatch(hideSettings()),
  })
)(SettingsDialog);
