
import React from "react";
import { Box, Typography, Chip, Stack, CardContent } from "@mui/material";

interface ItemDetailCardProps {
  title?: string;
  fields: Record<string, string | string[] | number>;
}

const ItemDetailCard: React.FC<ItemDetailCardProps> = ({ title, fields }) => {
  return (
    <Box>
      <CardContent>
        {title && (
          <Typography
            variant="subtitle1"
            fontWeight="600"
            borderBottom="1px solid #e0e0e0"
            pb={1}
            mb={1}
            color="black"
          >
            {title}
          </Typography>
        )}

        <Stack spacing={1.5}>
          {Object.entries(fields).map(([key, value]) => (
            <Box key={key} display="flex" alignItems="start">
              {/* Key */}
              <Typography
                variant="body2"
                fontWeight={500}
                color="black"
                sx={{ minWidth: 100 }}
              >
                {key}:
              </Typography>

              {Array.isArray(value) ? (
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  alignItems="center"
                >
                  {value.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      sx={{
                        bgcolor: "#F3F7FA",
                        color: "black",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" fontWeight={600} color="black">
                  {value}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Box>
  );
};

export default ItemDetailCard;
