"use client";
import { Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Exercise } from "../../../../backend/types";

export default function ExercisePage() {
  const { id } = useParams();
  console.log(id);
  const [exercise, setExercise] = useState<Exercise | null>(null); // Allow null

  useEffect(() => {
    if (id) {
      console.log(`Fetchinf from URL: http://localhost:3001/exercises/${id}`);
      const fetchExercise = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/exercises/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch exercise");
          }
          const data = (await response.json()) as Exercise;
          setExercise(data);
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchExercise();
    }
  }, [id]);

  if (!exercise) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth={false}>
      <img src={exercise.gifUrl} alt={exercise.name} />
      <Typography variant="h4">{exercise.name}</Typography>
      <Typography variant="body1">Body Part: {exercise.bodyPart}</Typography>
      <Typography variant="body1">Target: {exercise.target}</Typography>
      <Typography variant="body1">Equipment: {exercise.equipment}</Typography>
    </Container>
  );
}
