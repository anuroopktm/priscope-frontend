import { CARD_CONFIGS } from "./action-cards/card-configs";
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ActionCard from "./action-cards/actionCard";

const AddItemMasterData = () => {
  const navigate = useNavigate();
  const handleCardAction = (cardId: string) => {
    const card = CARD_CONFIGS.find((c) => c.id === cardId);
    if (card) {
      navigate(card.navigate);
    }
  };
  return (
    <Box
      p={1}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="stretch"
        sx={{
          mt: { xs: 1, sm: 2 },
          maxWidth: "700px",
          mx: "auto",
          width: "100%",
          gap: 0,
        }}
      >
        {CARD_CONFIGS.map((config) => (
          <ActionCard
            key={config.id}
            config={config}
            onAction={handleCardAction}
          />
        ))}
      </Grid>
      <Typography
        mb={4}
        sx={{ color: "#858585", textAlign: "center", fontSize: "10px" }}
      >
        Not ready yet?{" "}
        <span
          onClick={() => navigate("/items-master")}
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            color: "#144E72",
            cursor: "pointer",
          }}
        >
          Skip now
        </span>{" "}
        you can import data anytime from your items Master.
      </Typography>
    </Box>
  );
};

export default AddItemMasterData;
