"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../../backend/src/auth/supabaseClient";
import CreateWorkoutPlanPopup from "./CreateWorkoutPlanPopup";

const LoginButton = () => {
  const { user, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    handleClose();
    redirect("/dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleClose();
    redirect("/login");
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (!user) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => redirect("/login")}
      >
        Login
      </Button>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <CreateWorkoutPlanPopup />
      <Avatar
        onClick={handleAvatarClick}
        src={user.avatar || undefined}
        alt={user.nick || user.email}
        sx={{ cursor: "pointer" }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => redirect(`/explore/users/${user.id}`)}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default LoginButton;
