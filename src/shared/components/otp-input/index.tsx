"use client";

import { TextField, Box, Typography } from "@mui/material";
import { useRef } from "react";

interface OTPInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function OTPInput({
  value,
  onChange,
  disabled,
  error,
  helperText,
}: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;

    const updated = [...value];
    updated[index] = val;
    onChange(updated);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d{1,6}$/.test(paste)) {
      const updated = paste.split("").concat(Array(6).fill("")).slice(0, 6);
      onChange(updated);
    }
  };

  return (
    <>
      <Box display="flex" gap={1} justifyContent="space-between">
        {value.map((val, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputsRef.current[index] = el)}
            value={val}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            error={error}
            type="password"
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              style: {
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
              },
            }}
            sx={{
              width: "50px",
              "& .MuiOutlinedInput-root": {
                height: "50px",
              },
            }}
          />
        ))}
      </Box>
      {error && helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block" }}
        >
          {helperText}
        </Typography>
      )}
    </>
  );
}
