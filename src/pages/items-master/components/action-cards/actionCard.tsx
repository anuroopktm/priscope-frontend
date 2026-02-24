"use client";
import React, { useCallback } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import {
  cardBoxStyles,
  buttonStyles,
  titleStyles,
  imageBoxStyles,
} from "./cardStyles";

export interface CardConfig {
  id: string;
  title: React.ReactNode;
  buttonText: string;
  icon: React.ReactNode;
  image: any;
  imageAlt: string;
  imageStyle: React.CSSProperties;
}

interface ActionCardProps {
  config: CardConfig;
  onAction: (cardId: string) => void;
}

const ActionCard = React.memo<ActionCardProps>(({ config, onAction }) => {
  const { id, title, buttonText, icon, image, imageAlt, imageStyle } = config;

  const handleCardClick = useCallback(() => onAction(id), [onAction, id]);
  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAction(id);
    },
    [onAction, id],
  );

  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 4 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        minWidth: { xs: "220px", sm: "220px", lg: "220px" },
      }}
    >
      <Box sx={cardBoxStyles} onClick={handleCardClick}>
        <Box sx={{ zIndex: 2, flex: 1 }}>
          <Typography variant="body1" sx={titleStyles}>
            {title}
          </Typography>
        </Box>

        <Box sx={{ zIndex: 2 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={icon}
            onClick={handleButtonClick}
            sx={buttonStyles}
          >
            {buttonText}
          </Button>
        </Box>

        <Box sx={imageBoxStyles}>
          <Image
            src={image}
            alt={imageAlt}
            style={{
              objectFit: "contain",
              ...imageStyle,
            }}
          />
        </Box>
      </Box>
    </Grid>
  );
});

ActionCard.displayName = "ActionCard";

export default ActionCard;
