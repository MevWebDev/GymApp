"use client";
import { Container, Typography, Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "../../../../../backend/types";

export default function ExercisePage() {
  const { id } = useParams();
  console.log(id);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      const fetchExercise = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/users/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch exercise");
          }
          const data = (await response.json()) as User;
          setUser(data);
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchExercise();
    }
  }, [id]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h1">{user.nick}</Typography>
      <Box sx={{ aspectRatio: "16/9", width: "50%" }}>
        <img
          src={user.avatar}
          alt={user.avatar}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Typography variant="h3">{user.followers}</Typography>
    </Container>
  );
}
