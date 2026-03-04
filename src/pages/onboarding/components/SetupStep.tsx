import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import uploadIcon from "@/assets/items-master/upload-icon.svg";
import { ACCEPTED_FILE_TYPES } from "@/pages/items-master-refactor/constants/upload.constants";

const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragOver",
})<{ isDragOver: boolean }>(({ theme, isDragOver }) => ({
  border: `1px dashed ${isDragOver ? "#144E72" : "#144E72"}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: "#144E72",
  },
}));

const SetupStep = () => {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        maxWidth: 500,
        mt: 1,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Company Name *
        </Typography>
        <TextField
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              "& input": {
                padding: "12px 14px",
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Upload Company Logo (optional)
        </Typography>
        <DropZone
          isDragOver={isDragOver}
          onDragOver={(e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const droppedFile = e.dataTransfer.files[0];
            // if (droppedFile && isValidFileType(droppedFile))
            //   handleFileUpload(droppedFile);
          }}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <img src={uploadIcon} alt="upload" width={35} height={35} />
          </Box>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "normal",
              color: "#000000",
              mb: 1,
            }}
          >
            Drag and drop CSV/Excel File
          </Typography>
          <input
            id="file-input"
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   e.target.files?.[0] && handleFileUpload(e.target.files[0])
            // }
            style={{ display: "none" }}
          />
        </DropZone>
        {/* {formData.companyLogo && (
          <Typography variant="caption" display="block" mt={0.5}>
            Selected file: {formData.companyLogo.name}
          </Typography>
        )} */}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Company Website (optional)
        </Typography>
        <TextField
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              "& input": {
                padding: "12px 14px",
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Industry (optional)
        </Typography>
        <FormControl fullWidth size="small">
          <Select>
            <MenuItem value="">Select an industry</MenuItem>
            <MenuItem value="Tech">Tech</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="Healthcare">Healthcare</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Company Size (optional)
        </Typography>
        <FormControl fullWidth size="small">
          <Select>
            <MenuItem value="">Select company size</MenuItem>
            <MenuItem value="1-10">1-10</MenuItem>
            <MenuItem value="11-50">11-50</MenuItem>
            <MenuItem value="51-200">51-200</MenuItem>
            <MenuItem value="201-500">201-500</MenuItem>
            <MenuItem value="500+">500+</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: "#000000",
            mb: 1,
          }}
        >
          Primary Location (optional)
        </Typography>
        <FormControl fullWidth size="small">
          <Select>
            <MenuItem value="" disabled>
              Select Primary Location
            </MenuItem>
            {/* {headers.map((h) => (
              <MenuItem key={h} value={h}>
                {h}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SetupStep;
