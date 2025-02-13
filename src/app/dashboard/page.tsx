"use client";

import React, { useState, useEffect, FormEvent, Suspense } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
// import { supabase } from "../../../backend/auth/supabaseClient";
import axios from "axios";
import { redirect, useSearchParams } from "next/navigation";

const DashboardSettings = () => {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const recoverySession = searchParams.get("type") === "recovery";

  const [avatar, setAvatar] = useState<string>("");
  const [nick, setNick] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar);
      setNick(user.nick);
    }
  }, [user]);

  if (!loading && !user && !recoverySession) {
    redirect("/login");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let profileUpdated = false;
    let passwordUpdated = true;

    try {
      const profileResponse = await axios.patch(
        "http://localhost:3001/api/users/update",
        {
          id: user?.id,
          nick,
          avatar,
        }
      );
      if (profileResponse.status === 200) {
        profileUpdated = true;
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      profileUpdated = false;
    }

    // if (password.trim() !== "") {
    //   const { error } = await supabase.auth.updateUser({ password });
    //   if (error) {
    //     console.error("Password update error:", error.message);
    //     passwordUpdated = false;
    //   }
    // }

    if (profileUpdated && passwordUpdated) {
      setSnackbar({
        open: true,
        message: "Profile updated successfully.",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Update Profile
        </Typography>
        <Avatar
          src={avatar || undefined}
          alt={nick || "Avatar"}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
          noValidate
        >
          <TextField
            label="Avatar URL"
            fullWidth
            margin="normal"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
          <TextField
            label="Nickname"
            fullWidth
            margin="normal"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Leave blank if you do not want to change your password"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Update Profile
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const SettingsPage = () => {
  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <DashboardSettings />
    </Suspense>
  );
};

export default SettingsPage;
