'use client';

import React, { useEffect, useState } from 'react';
import {
  Snackbar,
  Box,
  Typography,
  LinearProgress,
  Button,
  Paper,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { theme } from '@/theme/theme';

type UploadSnackbarProps = {
  open: boolean;
  onClose: () => void;
  onMapData?: () => void;
};

const UploadSnackbar: React.FC<UploadSnackbarProps> = ({ 
  open, 
  onClose, 
  onMapData 
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    setProgress(0);
    setIsComplete(false);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 10, 100);
        if (next === 100) {
          clearInterval(timer);
          setTimeout(() => setIsComplete(true), 300);
        }
        return next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [open]);

  const handleMapData = () => {
    if (onMapData) {
      onMapData();
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={50000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={onClose}
    >
      <Paper elevation={3} sx={{ p: 2, width: 300, borderRadius: 8 }}>
        {!isComplete ? (
          // Progress state
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Upload in Progress
            </Typography>
            <Box display="flex" alignItems="center">
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ flexGrow: 1, height: 6, borderRadius: 4, mr: 1 }}
              />
              <Typography variant="body2">{`${progress}%`}</Typography>
            </Box>
          </Box>
        ) : (
          // Completion state
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircleOutline 
                sx={{ 
                  color: theme.palette.brand.buttonBg, 
                  mr: 1,
                  fontSize: 24
                }} 
              />
              <Typography variant="subtitle1" fontWeight="bold">
                Upload Successful
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={handleMapData}
              sx={{ 
                backgroundColor: theme.palette.brand.buttonBg, 
                borderRadius: 8,
                '&:hover': {
                  backgroundColor: theme.palette.brand.buttonBg,
                  opacity: 0.9,
                },
              }}
            >
              View Log
            </Button>
          </Box>
        )}
      </Paper>
    </Snackbar>
  );
};

export default UploadSnackbar;