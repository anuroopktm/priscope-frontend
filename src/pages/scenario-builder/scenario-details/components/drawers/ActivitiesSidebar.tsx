import { useListScenarioActivity } from "@/services/queries/scenario-builder/scenario-builder.queries";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useScenarioStore } from "../../store/useScenarioStore";

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const ActivitiesSidebar = () => {
  const { id: scenarioId } = useParams<{ id: string }>();

  const { setIsOpen } = useScenarioStore(
    useShallow((state) => ({
      setIsOpen: state.setIsActivitiesSidebarOpen,
    })),
  );

  const { data } = useListScenarioActivity(scenarioId, {
    page_size: 50,
    skip: 0,
  });

  const activities = data?.activities || [];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "brand.primary", fontWeight: 600 }}
        >
          Activity Log
        </Typography>
        <IconButton
          onClick={() => setIsOpen(false)}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 1,
            width: 32,
            height: 32,
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Divider />

      {/* Activities List */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {activities.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No activities found
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity) => (
              <ListItem
                key={activity.id}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  px: 0,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Stack direction="row" spacing={1.5}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "#0369A1",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                      src={activity.created_by?.avatar}
                    >
                      {activity.created_by?.name?.[0] || "A"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: "#1E293B" }}
                        >
                          {activity.created_by?.name || "System"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {formatTimeAgo(activity.created_at)}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          mt: 0.8,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.8,
                        }}
                      >
                        <Chip
                          label={String(activity.action || "").replace(
                            /_/g,
                            " ",
                          )}
                          size="small"
                          sx={{
                            alignSelf: "flex-start",
                            bgcolor: "#E0F2FE",
                            color: "#0369A1",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        />
                        {activity.details &&
                          typeof activity.details === "object" &&
                          Object.keys(activity.details).length > 0 && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#475569",
                                fontSize: "12px",
                                lineHeight: 1.4,
                                fontWeight: 500,
                              }}
                            >
                              {activity?.details?.description ||
                                JSON.stringify(activity?.details)}
                            </Typography>
                          )}
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default ActivitiesSidebar;
