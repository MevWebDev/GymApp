"use client";
import { Container, Typography, Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fullWorkoutPlan } from "../../../../backend/types";

export default function ExercisePage() {
  const { id } = useParams();
  console.log(id);
  const [workoutPlan, setworkoutPlan] = useState<fullWorkoutPlan | null>(null); // Allow null

  useEffect(() => {
    if (id) {
      const fetchExercise = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/workouts/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch exercise");
          }
          const data = (await response.json()) as fullWorkoutPlan;
          setworkoutPlan(data);
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchExercise();
    }
  }, [id]);

  if (!workoutPlan) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h1">{workoutPlan.title}</Typography>
      <Box sx={{ aspectRatio: "16/9", width: "50%" }}>
        <img
          src={workoutPlan.image}
          alt={workoutPlan.image}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Typography variant="h3">{workoutPlan.description}</Typography>
      {workoutPlan.exercises.map((exercise) => (
        <Box key={exercise.id} sx={{ display: "flex", alignItems: "center" }}>
          <img src={exercise.exercise.gifUrl} alt={exercise.exercise.name} />

          <Typography variant="body1">{exercise.exercise.name}</Typography>
          <Typography variant="body1">Sets: {exercise.reps}</Typography>
        </Box>
      ))}
    </Container>
  );
}
