"use client";
import * as React from "react";
import { Button, Box } from "@mui/material";

import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ExploreIcon from "@mui/icons-material/Explore";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import AnimatedHoverText from "./AnimatedHoverText";
import { useAuth } from "../contexts/AuthContext";
import LoginButton from "./LoginButton";

const linkStyles = {
  display: { xs: "none", md: "block" },
};

const iconStyles = {
  display: { xs: "block", md: "none" },
};

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 2, md: 5 },
        my: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 5 },
          alignItems: "center",
          justifySelf: "flex-end",
        }}
      >
        <Link href="/">
          <AnimatedHoverText style={linkStyles}>Home</AnimatedHoverText>
          <HomeIcon sx={{ display: { xs: "block", md: "none" } }} />
        </Link>

        <Link href="/exercises">
          <AnimatedHoverText style={linkStyles}>Exercises</AnimatedHoverText>
          <FitnessCenterIcon sx={{ ...iconStyles }} />
        </Link>
        <Link href="/explore/workouts">
          <AnimatedHoverText style={linkStyles}>Explore</AnimatedHoverText>
          <ExploreIcon sx={{ ...iconStyles }} />
        </Link>
        <Link href="/library">
          <AnimatedHoverText style={linkStyles}>Library</AnimatedHoverText>
          <BackupTableIcon sx={{ ...iconStyles }} />
        </Link>
      </Box>
      <LoginButton />
    </Box>
  );
}
