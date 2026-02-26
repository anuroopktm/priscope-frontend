"use client";

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
import { getAvatarColor } from "@/utils/getAvatarColor";

export interface TimelineUpdate {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface TimelineEntry {
  user: string;
  date: string;
  updates: TimelineUpdate[];
  comment?: string;
}

export interface TimelineProps {
  title?: string;
  data: TimelineEntry[];
  emptyText?: string;
}

export const TimelineDetail: React.FC<TimelineProps> = ({
  title = "Timeline",
  data,
  emptyText = "No timeline data available",
}) => {
  const hasData = data?.length > 0;
  return (
    <Box sx={{ p: 2, pt: 0 }}>
      {/* Header */}
      {title && (
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
          {title}
        </Typography>
      )}

      {/* Timeline Body */}
      {hasData ? (
        <Timeline position="right" sx={{ p: 0, pt: 1 }}>
          {data.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent sx={{ flex: 0, p: 0, m: 0 }} />

              <TimelineSeparator>
                <TimelineDot sx={{ width: 8, height: 8, margin: "6px 0" }} />
                {index < data.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: "#e0e0e0", width: 2 }} />
                )}
              </TimelineSeparator>

              <TimelineContent sx={{ pb: 3, pt: 0 }}>
                <Paper elevation={0}>
                  <Stack spacing={1}>
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

                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.user}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        on {item.date}
                      </Typography>
                    </Stack>

                    {item.updates.length ? (
                      item.updates.map((update, idx) => (
                        <Typography key={idx} variant="body2">
                          Updated{" "}
                          <Typography
                            component="span"
                            sx={{ fontWeight: 600, fontSize: "12px" }}
                          >
                            {update.field}
                          </Typography>{" "}
                          from{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "#1A2B44",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          >
                            {update.oldValue}
                          </Typography>{" "}
                          to{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "#1A2B44",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          >
                            {update.newValue}
                          </Typography>
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2">Inserted Row</Typography>
                    )}

                    {item.comment && (
                      <Box
                        sx={{
                          bgcolor: "#f5f5f5",
                          p: 1.5,
                          borderRadius: 8,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="#777777"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {item.comment}
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
          {emptyText}
        </Box>
      )}
    </Box>
  );
};

export default TimelineDetail;
