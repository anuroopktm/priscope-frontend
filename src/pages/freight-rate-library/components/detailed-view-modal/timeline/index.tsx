import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Typography, Box, Avatar, Paper, Stack } from "@mui/material";
import RateChangeIcon from "@/public/images/rate-change.svg";
import CalenderIcon from "@/public/images/calendar-03.svg";
import CommentIcon from "@/public/images/comment1.svg";

interface TimelineItemData {
  user: string;
  date: string;
  action: string;
  type?: string;
  from?: string;
  to?: string;
  description?: string;
  actionType?: "rate" | "validity" | "comment";
}

interface TimelineProps {
  timelineData: TimelineItemData[];
}

const getAvatarColor = (user: string) => {
  const colors = ["#CB5E5E", "#144E72", "#4caf50", "#ff9800", "#9c27b0"];
  let hash = 0;
  for (let i = 0; i < user.length; i++) {
    hash = user.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getActionIcon = (actionType: string | undefined) => {
  switch (actionType) {
    case "rate":
      return (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            verticalAlign: "middle",
          }}
        >
          <img src={RateChangeIcon} alt="Rate Change" width={16} height={16} />
        </Box>
      );

    case "validity":
      return (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            verticalAlign: "middle",
          }}
        >
          <img src={CalenderIcon} alt="Calendar" width={16} height={16} />
        </Box>
      );

    case "comment":
      return (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            verticalAlign: "middle",
          }}
        >
          <img src={CommentIcon} alt="Comment" width={14} height={14} />
        </Box>
      );

    default:
      return null;
  }
};

export const CustomTimeline: React.FC<TimelineProps> = ({ timelineData }) => {
  const hasData = timelineData.length > 0;

  return (
    <Box>
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          position: "sticky",
          borderBottom: "1px solid #e0e0e0",
          top: 0,
          backgroundColor: "white",
          zIndex: 1,
          py: 2,
        }}
      >
        Timeline
      </Typography>

      {/* Body */}
      {hasData ? (
        <Timeline position="right" sx={{ p: 0, pt: 1, overflowY: "auto" }}>
          {timelineData.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent sx={{ flex: 0, p: 0, m: 0 }} />

              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    width: 8,
                    height: 8,
                    margin: "6px 0",
                    boxShadow: "none",
                  }}
                />
                {index < timelineData.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: "#e0e0e0", width: 2 }} />
                )}
              </TimelineSeparator>

              <TimelineContent
                sx={{
                  pb: 3,
                  pt: 0,
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <Paper elevation={0}>
                  <Stack spacing={1}>
                    {/* User and Date Header */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(item.user),
                          width: 16,
                          height: 16,
                          fontSize: "10px",
                          fontWeight: 600,
                        }}
                      >
                        {item.user.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: getAvatarColor(item.user),
                        }}
                      >
                        {item.user}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        on {item.date}
                      </Typography>
                    </Stack>

                    {/* Action Description */}
                    <Box>
                      <Stack
                        display={"flex"}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="body2">
                          Updated
                          {item.actionType && (
                            <>
                              {getActionIcon(item.actionType)} {item.actionType}
                            </>
                          )}{" "}
                          {item.action === "rate" && item.from && item.to && (
                            <>
                              from
                              <Typography
                                component="span"
                                sx={{
                                  color: "#1A2B44",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                }}
                              >
                                {item.from}
                              </Typography>{" "}
                              to
                              <Typography
                                component="span"
                                sx={{
                                  color: "#1A2B44",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                }}
                              >
                                {item.to}
                              </Typography>
                            </>
                          )}
                          {item.action === "validity" &&
                            item.from &&
                            item.to && (
                              <>
                                from
                                <Typography
                                  component="span"
                                  sx={{
                                    color: "#1A2B44",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.from}
                                </Typography>{" "}
                                & validity to
                                <Typography
                                  component="span"
                                  sx={{
                                    color: "#1A2B44",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                  }}
                                >
                                  {item.to}
                                </Typography>
                              </>
                            )}
                          {!item.actionType && !item.action && " "}{" "}
                          {/* Fallback for empty actions */}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Description */}
                    {item.description && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "start",
                          gap: 1,
                          bgcolor: "#f5f5f5",
                          p: 1.5,
                          borderRadius: 8,
                        }}
                      >
                        <img
                          src={CommentIcon}
                          alt="Comment"
                          width={15}
                          height={15}
                        />
                        <Typography
                          variant="body2"
                          color="#777777"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <Box
          sx={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            fontSize: "14px",
          }}
        >
          No timeline data available
        </Box>
      )}
    </Box>
  );
};

export default CustomTimeline;
