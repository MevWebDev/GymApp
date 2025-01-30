"use client";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Exercise } from "../../../../backend/types";

export default function ExercisePage() {
  const { id } = useParams();

  const fakeExercise = {
    id: Number(id),
    name: "Bench Press",
    bodyPart: "Chest",
    target: "Pectorals",
    equipment: "Barbell",
    gifUrl: "https://v2.exercisedb.io/image/BXrZhlUNxPHhOy",
  };

  // const [exercise, setExercise] = useState<Exercise | null>(null);
  // setExercise(fakeExercise);

  // useEffect(() => {
  //   if (id) {
  //     console.log(`Fetchinf from URL: http://localhost:3001/exercises/${id}`);
  //     const fetchExercise = async () => {
  //       try {
  //         const response = await fetch(
  //           `http://localhost:3001/api/exercises/${id}`
  //         );
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch exercise");
  //         }
  //         const data = (await response.json()) as Exercise;
  //         setExercise(data);
  //         console.log(data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     fetchExercise();
  //   }
  // }, [id]);

  if (!fakeExercise) {
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
          // border: "1px solid",
          borderColor: "primary.light",
          overflow: "hidden",
          px: 8,
          my: 4,
        }}
      >
        <img
          src={fakeExercise.gifUrl}
          alt={fakeExercise.name}
          style={{ width: "100%", objectFit: "cover" }}
        />
      </Box>
      <Typography variant="h1">{fakeExercise.name}</Typography>
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
            <ListItemText
              primary="Body Part"
              secondary={fakeExercise.bodyPart}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Equipment"
              secondary={fakeExercise.equipment}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Primary Muscles"
              secondary={fakeExercise.target}
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}
