import React, { ReactNode } from "react";
import { Typography } from "@mui/material";
import { SxProps } from "@mui/material";

export default function AnimatedHoverText({
  children,
  style,
}: {
  children: ReactNode;
  style: SxProps;
}) {
  return (
    <Typography
      sx={{
        position: "relative",
        display: "inline-block",
        color: "text.primary",
        textDecoration: "none",
        fontSize: { xs: 14, md: 18 },

        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 0,
          height: "2px",
          backgroundColor: "currentColor",
          transition: "width 0.3s ease",
        },

        "&:hover::after": {
          width: "100%",
        },
        ...style,
      }}
    >
      {children}
    </Typography>
  );
}
