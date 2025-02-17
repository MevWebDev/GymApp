"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import WorkoutCard from "../components/WorkoutCard";
import type { fullWorkoutPlan } from "../../../shared/shared_types";

export default function LibraryPage() {
  const { user } = useAuth();
  const [savedWorkouts, setSavedWorkouts] = useState<fullWorkoutPlan[]>([]);
  const [createdWorkouts, setCreatedWorkouts] = useState<fullWorkoutPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.id) {
      const fetchWorkouts = async () => {
        try {
          const [savedResponse, createdResponse] = await Promise.all([
            axios.get(
              `https://gymapp-backend-production.up.railway.app/api/users/${user.id}/saved-workouts`
            ),
            axios.get(
              `https://gymapp-backend-production.up.railway.app/api/users/${user.id}/workouts`
            ),
          ]);

          setSavedWorkouts(savedResponse.data);

          setCreatedWorkouts(createdResponse.data);
        } catch (error) {
          console.error("Error fetching workouts", error);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkouts();
    }
  }, [user]);

  if (!user) {
    return <Typography>Please log in to view your library.</Typography>;
  }

  if (loading) {
    return <Typography>Loading your library...</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Library
      </Typography>

      <Typography variant="h5" gutterBottom>
        Saved Workouts
      </Typography>
      {savedWorkouts.length === 0 ? (
        <Typography>No saved workouts.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            my: 2,
            "&::-webkit-scrollbar": {
              my: 2,
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
          }}
        >
          {savedWorkouts.slice(0, 12).map((workout: fullWorkoutPlan) => (
            <Box
              key={workout.id}
              sx={{
                maxWidth: 250,
                aspectRatio: "1/1",
                flexShrink: 0,
                mb: 2,
              }}
            >
              <WorkoutCard workoutPlan={workout} />
            </Box>
          ))}
        </Box>
      )}
      <Typography variant="h5" gutterBottom>
        Created Workouts
      </Typography>
      {createdWorkouts.length === 0 ? (
        <Typography>No created workouts.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
          }}
        >
          {createdWorkouts.slice(0, 12).map((workout: fullWorkoutPlan) => (
            <Box
              key={workout.id}
              sx={{
                maxWidth: 250,
                flexShrink: 0,
                mb: 2,
              }}
            >
              <WorkoutCard workoutPlan={workout} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
