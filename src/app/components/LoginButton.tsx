"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // If you're using Next.js pages directory. For app directory, use 'next/navigation'
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useAuth } from "../contexts/AuthContext"; // Adjust the import path as needed
import { supabase } from "../../../backend/auth/supabaseClient"; // Adjust path accordingly

const LoginButton = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    router.push("/dashboard");
    handleClose();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    handleClose();
  };

  if (!user) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/login")}
      >
        Login
      </Button>
    );
  }

  return (
    <>
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
        <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default LoginButton;
