import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { ATTRIBUTE_OPTIONS } from "../../../constants/additem.constants";
import { theme } from "@/theme/theme";
// import theme from "@/shared/styles/theme";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (label: string) => void;
}

const AddAttributeModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [selected, setSelected] = useState<string>("Existing");
  const [customLabel, setCustomLabel] = useState("");
  const [search, setSearch] = useState("");

  const handleSubmit = () => {
    const finalLabel = selected === "New" ? customLabel : selected;
    if (finalLabel.trim()) {
      onSubmit(finalLabel);
      onClose();
      setCustomLabel("");
      setSelected("Existing");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 8,
          },
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Add Attribute
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search Attribute"
          margin="dense"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Custom Label with Tick */}
        <Box display="flex" gap={1} mt={1} mb={1}>
          <TextField
            fullWidth
            placeholder="Attribute Label"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              p: "10px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              border: `1px solid ${theme.palette.brand.tertiary}`,
              opacity: 0.5,
              cursor: "pointer",
            }}
            onClick={() => {
              if (customLabel.trim()) {
                setSelected("New");
              }
            }}
          >
            <CheckIcon fontSize="small" />
          </Box>
        </Box>

        {/* Radio List */}
        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {/* Default Existing */}
          <FormControlLabel
            value="Existing"
            control={
              <Radio
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={
                  <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                }
              />
            }
            label="Existing"
          />

          {/* Mapped Options */}
          {ATTRIBUTE_OPTIONS.map((attr) => (
            <FormControlLabel
              key={attr}
              value={attr}
              control={
                <Radio
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={
                    <CheckCircleIcon
                      sx={{ color: theme.palette.primary.main }}
                    />
                  }
                />
              }
              label={attr}
            />
          ))}

          {/* New Option */}
          <FormControlLabel
            value="New"
            control={
              <Radio
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={
                  <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                }
              />
            }
            label="New"
          />
        </RadioGroup>
      </DialogContent>
      <Divider />

      <DialogActions
        sx={{
          justifyContent: "flex-start",
          padding: "16px",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: theme.palette.brand.tertiary,
            borderColor: theme.palette.brand.tertiary,
            border: "1px solid",
            height: 40,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: theme.palette.brand.tertiary, height: 40 }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAttributeModal;
