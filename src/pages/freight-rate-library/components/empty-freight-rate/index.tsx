import React, { useMemo, useCallback } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import add from "@/assets/rate-libraries/add-item.svg";
import upload from "@/assets/rate-libraries/upload-circle.svg";
import uploadcsv from "@/assets/rate-libraries/csv-upload.svg";
import plus from "@/assets/rate-libraries/plus-sign.svg";
import MainContentContainer from "@/components/common/main-content-container";

interface CardConfig {
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

interface FreightRateInitialPageProps {
  onImportData: () => void;
  onAddManually: () => void;
  hasImportPermission: boolean;
}

// Card data configuration for freight rates (without ERP sync)
const FREIGHT_RATE_CARD_CONFIGS = (): readonly CardConfig[] =>
  [
    {
      id: "csv-upload",
      title: (
        <span
          dangerouslySetInnerHTML={{
            __html: "Upload and map your <strong>CSV/Excel</strong> file",
          }}
        />
      ),
      buttonText: "Upload file",
      icon: <img src={uploadcsv} alt="Upload CSV" width={20} height={20} />,
      image: upload,
      imageAlt: "Upload CSV",
      imageStyle: {
        width: "130px",
        height: "auto",
      },
    },
    {
      id: "manual-add",
      title: (
        <span
          dangerouslySetInnerHTML={{
            __html: "Add your freight rate <strong>Manually</strong>",
          }}
        />
      ),
      buttonText: "Add manually",
      icon: <img src={plus} alt="Add item icon" width={20} height={20} />,
      image: add,
      imageAlt: "Add item icon",
      imageStyle: {
        width: "100px",
        height: "auto",
      },
    },
  ] as const;

// Memoized styles to prevent recreation on every render
const cardBoxStyles = {
  background: "linear-gradient(96.81deg, #D8ECF8 0%, #89C5EA 100%)",
  borderRadius: 2,
  width: "100%",
  maxWidth: { xs: "100%", sm: "220px", lg: "220px" },
  minWidth: { xs: "220px", sm: "220px" },
  height: { xs: 180, sm: 200 },
  p: { xs: 2.5, sm: 3 },
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
} as const;

const buttonStyles = {
  bgcolor: "#144E72",
  "&:hover": { bgcolor: "#144E72" },
  color: "#fff",
  textTransform: "none",
  fontSize: { xs: "13px", sm: "14px" },
  fontWeight: 600,
  py: { xs: 0.75, sm: 1 },
  borderRadius: 8,
  minHeight: { xs: "36px", sm: "40px" },
} as const;

const titleStyles = {
  color: "#1A2B44",
  fontWeight: 500,
  fontSize: { xs: "15px", sm: "16px" },
  lineHeight: 1.4,
  mb: { xs: 2, sm: 2.5 },
} as const;

const imageBoxStyles = {
  position: "absolute",
  top: 0,
  right: 0,
  opacity: 25,
  zIndex: 1,
} as const;

// Optimized ActionCard with useCallback for event handlers
const ActionCard = React.memo<ActionCardProps>(({ config, onAction }) => {
  const {
    id,
    title,
    buttonText,
    // icon,
    image,
    imageAlt,
    imageStyle,
  } = config;

  const handleCardClick = useCallback(() => {
    onAction(id);
  }, [onAction, id]);

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
        {/* Title */}
        <Box sx={{ zIndex: 2, flex: 1 }}>
          <Typography variant="body1" sx={titleStyles}>
            {title}
          </Typography>
        </Box>

        {/* Button */}
        <Box sx={{ zIndex: 2 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={config.icon}
            onClick={handleButtonClick}
            sx={buttonStyles}
          >
            {buttonText}
          </Button>
        </Box>

        {/* Background illustration */}
        <Box sx={imageBoxStyles}>
          <img
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

const FreightRateInitialPage: React.FC<FreightRateInitialPageProps> = ({
  onImportData,
  onAddManually,
  hasImportPermission = true,
}) => {
  // Memoized card action handler
  const handleCardAction = useCallback(
    (cardId: string) => {
      switch (cardId) {
        case "csv-upload":
          onImportData();
          break;
        case "manual-add":
          onAddManually();
          break;
        default:
          console.warn("Unknown card action:", cardId);
      }
    },
    [onImportData, onAddManually],
  );

  // Memoized static styles
  const headerTextStyles = useMemo(
    () => ({
      color: "#1A2B44",
      textAlign: "center",
      mb: 1,
    }),
    [],
  );

  const subTextStyles = useMemo(
    () => ({
      color: "#858585",
      textAlign: "center",
    }),
    [],
  );

  const containerBoxStyles = useMemo(
    () => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      pt: "3%",
      minHeight: "60vh",
    }),
    [],
  );

  const gridStyles = useMemo(
    () => ({
      mt: { xs: 1, sm: 2 },
      maxWidth: "700px",
      mx: "auto",
      width: "100%",
      gap: 0,
    }),
    [],
  );

  return (
    <MainContentContainer hasFilter={true}>
      <Box p={1} sx={containerBoxStyles}>
        {/* Header Section */}
        <Typography
          variant="h5"
          fontWeight="600"
          gutterBottom
          sx={headerTextStyles}
        >
          Hey, It seems like you're new here
        </Typography>

        <Typography variant="body2" mb={4} sx={subTextStyles}>
          "Try any of the below option to add freight rates here"
        </Typography>

        {/* Cards Grid */}
        <Grid
          container
          justifyContent="center"
          alignItems="stretch"
          sx={gridStyles}
        >
          {FREIGHT_RATE_CARD_CONFIGS()
            .filter((config) => {
              if (config.id === "csv-upload" && !hasImportPermission)
                return false;
              return true;
            })
            .map((config) => (
              <ActionCard
                key={config.id}
                config={config}
                onAction={handleCardAction}
              />
            ))}
        </Grid>
      </Box>
    </MainContentContainer>
  );
};

export default FreightRateInitialPage;
