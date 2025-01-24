"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Exercise {
  id: string;
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
    <Box className="bg-white text-black">
      <Typography>Search Exercises</Typography>
      <input
        type="text"
        placeholder="Search by name, body part, or target..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />

      {loading && <Typography>Loading...</Typography>}

      {!loading && exercises.length === 0 && search && (
        <Typography>No exercises found</Typography>
      )}

      <ul>
        {exercises.map((exercise) => (
          <Link href={`/exercises/${exercise.id}`} key={exercise.id}>
            <li key={exercise.id}>
              <Typography>{exercise.name}</Typography>
              <Typography>Body Part: {exercise.bodyPart}</Typography>
              <Typography>Target: {exercise.target}</Typography>
              <Typography>Equipment: {exercise.equipment}</Typography>
              <img src={exercise.gifUrl} alt={exercise.name} width="150" />
            </li>
          </Link>
        ))}
      </ul>
    </Box>
  );
}
