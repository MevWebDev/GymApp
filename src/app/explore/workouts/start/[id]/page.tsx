"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import {
  fullWorkoutPlan,
  WorkoutPlanExercise,
} from "../../../../../../backend/types";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import { useAuth } from "@/app/contexts/AuthContext";

interface WorkoutSet {
  id: number;
  reps: number;
  weight?: number;
}

interface CompletedWorkoutExercise
  extends Omit<WorkoutPlanExercise, "sets" | "workoutPlan"> {
  sets: WorkoutSet[];
}

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

const WorkoutExecutionPage = () => {
  const router = useRouter();

  const { user } = useAuth();

  const { id } = useParams();
  const [workoutPlan, setWorkoutPlan] = useState<fullWorkoutPlan | null>(null);
  const [completedExercises, setCompletedExercises] = useState<
    CompletedWorkoutExercise[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setElapsed(Math.floor((performance.now() - startTime) / 1000));
    },
    isRunning ? 1000 : null
  );

  useEffect(() => {
    if (!id) return;

    const fetchWorkoutData = async () => {
      try {
        const response = await fetch(
          `https://gymapp-backend-production.up.railway.app/api/workouts/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch workout plan");

        const data: fullWorkoutPlan = await response.json();

        const initialExercises = data.exercises.map((exercise) => ({
          ...exercise,
          sets: Array.from({ length: exercise.sets }, (_, i) => ({
            id: i + 1,
            reps: exercise.reps,
            weight: undefined,
          })),
        }));

        setWorkoutPlan(data);
        setCompletedExercises(initialExercises);
        setIsLoading(false);
        setIsRunning(true);
        setStartTime(performance.now());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load workout");
        setIsLoading(false);
      }
    };

    fetchWorkoutData();

    return () => setIsRunning(false);
  }, [id, router]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSetChange = (
    exerciseId: number,
    setId: number,
    field: "reps" | "weight",
    value: string
  ) => {
    setCompletedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: Number(value) } : set
              ),
            }
          : exercise
      )
    );
  };

  const handleAddSet = (exerciseId: number) => {
    setCompletedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: exercise.sets.length + 1,
                  reps: exercise.reps,
                  weight: undefined,
                },
              ],
            }
          : exercise
      )
    );
  };

  const handleRemoveSet = (exerciseId: number, setId: number) => {
    setCompletedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise
      )
    );
  };

  const handleCompleteWorkout = async () => {
    setIsRunning(false);

    try {
      const payload = {
        userId: user?.id,
        workoutPlanId: id,
        duration: elapsed,
        exercises: completedExercises.flatMap((exercise) =>
          exercise.sets.map((set) => ({
            exerciseId: exercise.exerciseId,
            reps: set.reps,
            weight: set.weight,
          }))
        ),
      };

      const response = await axios.post(
        "https://gymapp-backend-production.up.railway.app/api/workouts/complete",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        router.push("/workouts/history");
      }
    } catch (error) {
      console.error("Error completing workout:", error);
    }
  };

  if (isLoading) {
    return <CircularProgress sx={{ display: "block", mt: 4, mx: "auto" }} />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!workoutPlan) {
    return <Typography>Workout plan not found</Typography>;
  }

  if (!user) {
    return <Typography>Login to access this page</Typography>;
  }

  return (
    <Container sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5">
          Workout Duration: {formatTime(elapsed)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {workoutPlan.title}
        </Typography>
      </Box>

      {completedExercises.map((exercise) => (
        <Box key={exercise.id} sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <Box sx={{ width: 150 }}>
              <img
                src={exercise.exercise.gifUrl}
                alt={exercise.exercise.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              {exercise.exercise.name}
            </Typography>
          </Box>

          {exercise.sets.map((set, index) => (
            <Box key={set.id} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Typography variant="body1" sx={{ alignSelf: "center" }}>
                Set {index + 1}
              </Typography>
              <TextField
                label="Reps"
                type="number"
                value={set.reps}
                onChange={(e) =>
                  handleSetChange(exercise.id, set.id, "reps", e.target.value)
                }
              />
              <TextField
                label="Weight (kg)"
                type="number"
                value={set.weight || ""}
                onChange={(e) =>
                  handleSetChange(exercise.id, set.id, "weight", e.target.value)
                }
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveSet(exercise.id, set.id)}
              >
                <Typography
                  sx={{ display: { xs: "none", md: "block" } }}
                  color="error"
                >
                  Remove
                </Typography>
                <Typography
                  sx={{ display: { xs: "block", md: "none" } }}
                  color="error"
                >
                  X
                </Typography>
              </Button>
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={() => handleAddSet(exercise.id)}
            sx={{ mt: 1 }}
          >
            Add set
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={handleCompleteWorkout}
        sx={{ mt: 3 }}
      >
        Complete Workout
      </Button>
    </Container>
  );
};

export default WorkoutExecutionPage;
