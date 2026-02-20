"use client";
import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import AddAttributeModal from "./add-attribute";
import { RATE_FIELDS } from "../../../items-master/constants/additem.constants";
import { AddOutlined, ArrowBackOutlined } from "@mui/icons-material";
import { theme } from "@/theme/theme";

interface AddNewItemDrawerProps {
  open: boolean;
  onClose: () => void;
}

const AddNewItemDrawer: React.FC<AddNewItemDrawerProps> = ({
  open,
  onClose,
}) => {
  const [attributeFields, setAttributeFields] = useState<string[]>([]);
  const [attributeModalOpen, setAttributeModalOpen] = useState(false);

  const handleAddAttribute = (newAttr: string) => {
    if (!attributeFields.includes(newAttr)) {
      setAttributeFields((prev) => [...prev, newAttr]);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            minWidth: 400,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          px={2}
          py={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" sx={{ mr: 5, gap:'auto' }}>
            <Box
              component="button"
              onClick={onClose}
              style={{
                display: "flex",
                height: 32,
                padding: 8,
                alignItems: "center",
                borderRadius: 8,
                marginRight: 8,
                border: "1px solid rgba(26, 43, 68, 0.10)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <ArrowBackOutlined
                fontSize="small"
                sx={{ color: theme.palette.text.primary }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 20 }}>
              Add New Item
            </Typography>
          </Box>

          <Button
            variant="outlined"
            sx={{
              borderRadius: 8,
              height: 32,
              borderColor: theme.palette.brand.tertiary,
              fontSize: 14,
              fontWeight: 600,
              color: theme.palette.brand.tertiary,
            }}
            onClick={() => setAttributeModalOpen(true)}
            startIcon={<AddOutlined />}
          >
            Add Attributes
          </Button>
        </Box>

        <Divider />

        {/* Search Bar */}

        {/* Form */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            pt: 2,
            pb: 1,
          }}
        >
          <Stack spacing={2}>
            {RATE_FIELDS.map((field) => (
              <TextField
                key={field.key}
                label={`${field.label} *`}
                variant="outlined"
                size="small"
                fullWidth
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            ))}

            {attributeFields.map((attr) => (
              <TextField
                key={attr}
                label={attr}
                variant="outlined"
                size="small"
                fullWidth
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Divider sx={{mb: 1}} />

        {/* Sticky Bottom Button */}
        <Box px={1} py={1}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ borderRadius: 8, backgroundColor: theme.palette.brand.tertiary,fontWeight: 600 }}
          >
            Submit
          </Button>
        </Box>
      </Drawer>

      {/* Attribute Modal */}
      <AddAttributeModal
        open={attributeModalOpen}
        onClose={() => setAttributeModalOpen(false)}
        onSubmit={handleAddAttribute}
      />
    </>
  );
};

export default AddNewItemDrawer;
