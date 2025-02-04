"use client";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  darken,
  Snackbar,
  Alert,
} from "@mui/material";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fullWorkoutPlan } from "../../../../../backend/types";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import EditWorkoutPlanPopup from "../../../components/EditWorkoutPlanPopup";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ExercisePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: loggedUser } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState<fullWorkoutPlan | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const fetchWorkout = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/workouts/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch workout");
          }
          const data = (await response.json()) as fullWorkoutPlan;
          setWorkoutPlan(data);
          console.log(data);
          // @ts-ignore
          if (loggedUser && data.savedByUsers) {
            // @ts-ignore
            const saved = data.savedByUsers.some(
              (u: any) => u.id === loggedUser.id
            );
            setIsSaved(saved);
          }
        } catch (error) {
          console.error(error);
          router.push("/explore/workouts");
        }
      };

      fetchWorkout();
    }
  }, [id, loggedUser, router]);

  if (!workoutPlan) {
    return <Typography>Loading...</Typography>;
  }

  const handleSave = async () => {
    if (!loggedUser || !workoutPlan) return;
    try {
      const response = await axios.post(
        "http://localhost:3001/api/workouts/save",
        {
          userId: loggedUser.id,
          workoutPlanId: workoutPlan.id,
        }
      );
      console.log("Workout saved!", response.data);
      setSnackbar({
        open: true,
        message: "Workout saved successfully!",
        severity: "success",
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving workout plan:", error);
      setSnackbar({
        open: true,
        message: "Error saving workout plan.",
        severity: "error",
      });
    }
  };

  const handleUnsave = async () => {
    if (!loggedUser || !workoutPlan) return;
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/workouts/save",
        {
          data: {
            userId: loggedUser.id,
            workoutPlanId: workoutPlan.id,
          },
        }
      );
      console.log("Workout unsaved!", response.data);
      setSnackbar({
        open: true,
        message: "Workout unsaved successfully!",
        severity: "success",
      });
      setIsSaved(false);
    } catch (error) {
      console.error("Error unsaving workout plan:", error);
      setSnackbar({
        open: true,
        message: "Error unsaving workout plan.",
        severity: "error",
      });
    }
  };

  return (
    <Container
      maxWidth={"md"}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 8 }}
    >
      <Box
        sx={{
          aspectRatio: "4/3",
          borderRadius: 4,
          overflow: "hidden",
          mt: 4,
          width: "80%",
          mx: "auto",
        }}
      >
        <img
          src={workoutPlan.image}
          alt={workoutPlan.image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography variant="h1">{workoutPlan.title}</Typography>
      <Typography variant="h3">{workoutPlan.description}</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 40, borderRadius: "50%", overflow: "hidden" }}>
            <img
              src={workoutPlan.user.avatar}
              alt={workoutPlan.user.nick}
              style={{ width: "100%", objectFit: "cover" }}
            />
          </Box>
          <Link
            href={`/explore/users/${workoutPlan.userId}`}
            passHref
            onClick={(e) => e.stopPropagation()}
          >
            <Typography
              component="span"
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {workoutPlan.user.nick}
            </Typography>
          </Link>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {loggedUser?.id !== workoutPlan.userId && (
            <>
              {isSaved ? (
                <Button
                  onClick={handleUnsave}
                  sx={{
                    bgcolor: "#f44336",
                    color: "secondary.main",
                    mt: 1,
                    "&:hover": { bgcolor: darken("#f44336", 0.1) },
                    px: 2,
                    py: 1,
                    borderRadius: 12,
                  }}
                >
                  Unsave
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  sx={{
                    bgcolor: "#2196F3",
                    color: "secondary.main",
                    mt: 1,
                    "&:hover": { bgcolor: darken("#2196F3", 0.1) },
                    px: 2,
                    py: 1,
                    borderRadius: 12,
                  }}
                >
                  Save
                </Button>
              )}
            </>
          )}
          {loggedUser?.id === workoutPlan.userId && (
            <>
              <EditWorkoutPlanPopup workoutPlan={workoutPlan} />
              <Button
                onClick={() => {
                  axios
                    .delete(
                      `http://localhost:3001/api/workouts/${workoutPlan.id}`
                    )
                    .then(() => {
                      setSnackbar({
                        open: true,
                        message: "Workout deleted successfully!",
                        severity: "success",
                      });
                      router.push("/explore/workouts");
                    })
                    .catch((error) => {
                      console.error("Error deleting workout plan:", error);
                      setSnackbar({
                        open: true,
                        message: "Error deleting workout plan.",
                        severity: "error",
                      });
                    });
                }}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>
      <Divider />
      <List sx={{ bgcolor: "background.paper" }} disablePadding={true}>
        {workoutPlan.exercises.map((exercise) => (
          <ListItem key={exercise.id} sx={{ mx: 0, px: 0 }}>
            <ListItemAvatar>
              <Box
                sx={{
                  aspectRatio: "1/1",
                  width: 80,
                  height: 80,
                  mr: 4,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <img
                  src={exercise.exercise.gifUrl}
                  alt={exercise.exercise.name}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    maxWidth: 300,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                >
                  {exercise.exercise.name}
                </Typography>
              }
              secondary={`${exercise.sets} sets x ${exercise.reps} reps`}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
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
}
