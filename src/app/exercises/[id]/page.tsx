"use client";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Exercise } from "../../../../shared/shared_types";
import { BASE_URL } from "../../utils/utils";

export default function ExercisePage() {
  const { id } = useParams();

  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (id) {
      const fetchExercise = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/exercises/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch exercise");
          }
          const data = (await response.json()) as Exercise;
          setExercise(data);
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
    <Container sx={{ display: "flex", flexDirection: "column", mt: 4 }}>
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          px: 8,
          my: 4,
        }}
      >
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          style={{ width: "100%", objectFit: "cover" }}
        />
      </Box>
      <Typography variant="h1">{exercise.name}</Typography>
      <Box
        sx={{
          maxWidth: 600,
          p: 3,
          border: "1px solid",
          borderColor: "primary.light",
          borderRadius: 4,
          my: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Exercise Profile
        </Typography>
        <Divider sx={{ my: 1 }} />

        <List
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <ListItem>
            <ListItemText primary="Body Part" secondary={exercise.bodyPart} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Equipment" secondary={exercise.equipment} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Primary Muscles"
              secondary={exercise.target}
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}
