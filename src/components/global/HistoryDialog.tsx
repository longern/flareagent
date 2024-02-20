import React, { useCallback, useEffect } from "react";
import { Box, Dialog, IconButton, Slide, Toolbar } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Close as CloseIcon } from "@mui/icons-material";

export const SlideLeft = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export function HistoryModal({
  hash,
  open,
  onClose,
  children,
}: {
  hash: string;
  open: boolean;
  onClose: () => void;
  children: (onClose: () => void) => React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    window.history.pushState(
      (window.history.state ?? []).concat(hash),
      "",
      `#${hash}`
    );
    const handlePopState = (event: PopStateEvent) => {
      const stack = (event.state as string[] | null) ?? [];
      if (!stack.includes(hash)) onClose();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hash, open, onClose]);

  const handleClose = useCallback(() => {
    window.history.back();
  }, []);

  return children(handleClose);
}

export function HistoryDialog({
  hash,
  title,
  open,
  onClose,
  children,
  endAdornment,
}: {
  hash: string;
  title?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  endAdornment?: React.ReactNode;
}) {
  return (
    <HistoryModal hash={hash} open={open} onClose={onClose}>
      {(onClose) => (
        <Dialog
          open={open}
          onClose={onClose}
          fullScreen
          TransitionComponent={SlideLeft}
          PaperProps={{
            sx: {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#050505" : "#fafafa",
            },
          }}
        >
          <Toolbar disableGutters>
            <IconButton
              size="large"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Box flexGrow={1} textAlign="center">
              {title}
            </Box>
            {endAdornment ?? <Box width={48} />}
          </Toolbar>
          {children}
        </Dialog>
      )}
    </HistoryModal>
  );
}
