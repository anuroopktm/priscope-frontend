import { Grid, TextField, Typography } from "@mui/material";

const BasicInfoSection = () => (
  <Grid container spacing={2} sx={{ width: "50%", mb: 4 }}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: "#5C6A82",
          mb: 0.5,
          display: "block",
        }}
      >
        Name
      </Typography>
      <TextField
        fullWidth
        size="small"
        defaultValue="John Smith"
        sx={{ bgcolor: "white" }}
      />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: "#5C6A82",
          mb: 0.5,
          display: "block",
        }}
      >
        Email
      </Typography>
      <TextField
        error
        fullWidth
        size="small"
        defaultValue="Johnsmith@gmail.com"
        helperText="Email already taken"
        sx={{ bgcolor: "white" }}
      />
    </Grid>
  </Grid>
);

export default BasicInfoSection;
