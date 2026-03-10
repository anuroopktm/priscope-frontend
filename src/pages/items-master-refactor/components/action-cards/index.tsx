import { Box, Grid, Typography } from "@mui/material";
import { CARD_CONFIGS } from "./card-configs";
import ActionCard from "./actionCard";
type Props = {
  handleCardAction: (cardId: string) => void;
};
const EmptyDataState = ({ handleCardAction }: Props) => {
  return (
    <Box
      p={1}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: "3%",
        minHeight: "60vh",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="600"
        gutterBottom
        sx={{
          color: "#1A2B44",
          textAlign: "center",
          mb: 1,
        }}
      >
        Hey, It seems like you're new here
      </Typography>

      <Typography
        variant="body2"
        mb={4}
        sx={{
          color: "#1A2B44",
          textAlign: "center",
        }}
      >
        Try any of the below option to add data here
      </Typography>

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
    </Box>
  );
};

export default EmptyDataState;
