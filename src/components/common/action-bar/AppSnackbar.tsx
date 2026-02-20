"use client";
import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface AppSnackbarProps {
    snackbar: any;
    onClose: () => void;
    autoHideDuration?: number;
    position?: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" };
}

const AppSnackbar: React.FC<AppSnackbarProps> = ({
    snackbar,
    onClose,
    autoHideDuration = 4000,
    position = { vertical: "top", horizontal: "center" },
}) => {
    const { message, severity } = snackbar;

    return (
        <Snackbar
            open={!!message}
            autoHideDuration={autoHideDuration}
            anchorOrigin={position}
            onClose={onClose}
        >
            <Alert
                severity={severity || "info"}
                onClose={onClose}
                sx={{ width: "100%" }}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AppSnackbar;