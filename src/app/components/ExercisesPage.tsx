"use client";

import { Box, Typography, Input, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard";

interface Exercise {
  id: number;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
}

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3001/api/exercises?search=${search}`
        );
        if (res.ok) {
          const data = await res.json();
          setExercises(data);
        } else {
          console.error("Failed to fetch exercises");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch exercises after user stops typing (debouncing)
    const debounceTimeout = setTimeout(() => {
      fetchExercises();
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimeout);
  }, [search]); // Trigger whenever `search` changes

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography>Search Exercises</Typography>
      <Input
        type="text"
        placeholder="Search by name, body part, or target..."
        value={search}
        disableUnderline
        onChange={(e) => setSearch(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        sx={{
          borderRadius: 12,
          border: "1px solid #ccc",
          p: 2,
          width: { xs: "80%", md: "50%" },
          mx: "auto",
        }}
      />

      {loading && <Typography>Loading...</Typography>}

      {!loading && exercises.length === 0 && search && (
        <Typography>No exercises found</Typography>
      )}

      <Grid container spacing={2} justifyContent={"center"} sx={{ mt: 4 }}>
        {exercises.slice(0, 12).map((exercise: Exercise) => (
          <Grid key={exercise.id} xs={12} sm={6} md={4} lg={3}>
            <ExerciseCard exercise={exercise} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
