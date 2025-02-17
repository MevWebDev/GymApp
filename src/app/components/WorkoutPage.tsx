"use client";

import { Box, Typography, Input, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import axios from "axios";
import ExerciseCard from "./ExerciseCard";
import type { Exercise } from "../../../shared/shared_types";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://gymapp-backend-production.up.railway.app/api/exercises`,
          {
            params: { search },
          }
        );
        setExercises(response.data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchExercises();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [search]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
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

      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        sx={{ mt: 4, width: "70%" }}
      >
        {exercises.slice(0, 12).map((exercise: Exercise) => (
          <Grid key={exercise.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ExerciseCard exercise={exercise} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
