"use client";

import { useState } from "react";
import { supabase } from "../../../backend/auth/supabaseClient";
import axios from "axios";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import {
  TextField,
  Button,
  Typography,
  Avatar,
  Container,
  Box,
  Grid,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nick: z.string().min(1, "Nickname is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthComponent = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      nick: "",
    },
    validationSchema: toFormikValidationSchema(
      authMode === "register" ? signUpSchema : loginSchema
    ),
    onSubmit: async (values) => {
      if (authMode === "register") {
        try {
          // Register the user with Supabase
          const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });
          if (error) throw error;

          // Check if the user already exists in your backend
          const response = await axios.get("http://localhost:3001/api/users", {
            params: { email: values.email },
          });

          if (response.data && response.data.user) {
            showSnackbar("User already exists. Please log in.", "error");
          } else {
            // Create the user record in your backend
            await axios.post("http://localhost:3001/api/users/create", {
              email: values.email,
              nick: values.nick,
            });
            showSnackbar(
              "Account created successfully! Check your email to verify.",
              "success"
            );
          }
        } catch (err: any) {
          showSnackbar(err.message, "error");
        }
      } else {
        // Login flow
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          if (error) throw error;
          showSnackbar("Logged in successfully!", "success");
        } catch (err: any) {
          showSnackbar(err.message, "error");
        }
      }
    },
  });

  const toggleAuthMode = () => {
    setAuthMode((prevMode) => (prevMode === "login" ? "register" : "login"));
    formik.resetForm();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
        <Typography component="h1" variant="h5">
          {authMode === "register" ? "Sign Up" : "Log In"}
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ mt: 3 }}
          onSubmit={formik.handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>

            {authMode === "register" && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Nickname"
                  name="nick"
                  value={formik.values.nick}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nick && Boolean(formik.errors.nick)}
                  helperText={formik.touched.nick && formik.errors.nick}
                />
              </Grid>
            )}
          </Grid>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {authMode === "register" ? "Sign Up" : "Log In"}
          </Button>
        </Box>

        <Typography variant="body2">
          {authMode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link component="button" variant="body2" onClick={toggleAuthMode}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link component="button" variant="body2" onClick={toggleAuthMode}>
                Log In
              </Link>
            </>
          )}
        </Typography>
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

export default AuthComponent;
