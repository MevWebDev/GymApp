"use client";

import { Box, Typography, Input, InputAdornment, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import axios from "axios";
import WorkoutCard from "./WorkoutCard";
import { fullWorkoutPlan, User } from "../../../backend/types";
import UserCard from "./UserCard";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [view, setTypes] = useState<"workouts" | "users">("workouts");
  const [users, setUsers] = useState<User[]>([]);
  const [workouts, setWorkouts] = useState<fullWorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/${view}`, {
          params: { search },
        });
        if (view === "users") setUsers(response.data);
        else setWorkouts(response.data);
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
  }, [search, view]);
  console.log(workouts);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h1" sx={{ my: 2, textAlign: "center" }}>
        Let us find
        <span className="text-blue-400"> {view}</span> <br />
        you are looking for
      </Typography>
      <Input
        type="text"
        placeholder={`Search for ${view}`}
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
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button
          sx={{
            bgcolor: view == "workouts" ? "black" : "white",
            color: view == "workouts" ? "white" : "black",
            borderRadius: 3,
            fontSize: 12,
          }}
          onClick={() => setTypes("workouts")}
        >
          Workouts
        </Button>
        <Button
          sx={{
            bgcolor: view == "workouts" ? "white" : "black",
            color: view == "workouts" ? "black" : "white",
            borderRadius: 3,
            fontSize: 12,
          }}
          onClick={() => setTypes("users")}
        >
          Users
        </Button>
      </Box>

      {loading && <Typography>Loading...</Typography>}

      {!loading && workouts.length === 0 && search && (
        <Typography>No exercises found</Typography>
      )}

      <Grid container spacing={2} justifyContent={"center"} sx={{ mt: 4 }}>
        {view === "workouts" &&
          workouts.slice(0, 12).map((workout: fullWorkoutPlan) => (
            <Grid key={workout.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <WorkoutCard workoutPlan={workout} />
            </Grid>
          ))}

        {view === "users" &&
          users.slice(0, 12).map((user: User) => (
            <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <UserCard user={user} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
