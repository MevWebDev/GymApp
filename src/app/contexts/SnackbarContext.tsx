"use client";
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackbarContextType = {
  showMessage: (
    message: React.ReactNode,
    severity?: "success" | "error" | "warning" | "info"
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error(
      "useSnackbarContext must be used within a SnackbarProvider"
    );
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<React.ReactNode>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const showMessage = (
    msg: React.ReactNode,
    sev: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent<Element, Event> | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
