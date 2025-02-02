"use client";

import { usePathname } from "next/navigation";
import { Box, Typography, Input, InputAdornment, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import axios from "axios";
import WorkoutCard from "./WorkoutCard";
import UserCard from "./UserCard";
import { fullWorkoutPlan, User } from "../../../backend/types";
import Link from "next/link";

export default function ExplorePage() {
  const pathname = usePathname();
  const view = pathname.split("/").pop();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [workouts, setWorkouts] = useState<fullWorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!view) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/${view}`, {
          params: { search },
        });
        if (view === "users") setUsers(response.data);
        else if (view === "workouts") setWorkouts(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [search, view]);

  if (view !== "users" && view !== "workouts") {
    return <Typography>Invalid page</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h1" sx={{ my: 2, textAlign: "center" }}>
        Let us find{" "}
        <span style={{ color: "#2196F3" }}>{view.slice(0, -1)}</span> you are
        looking for
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
        <Link href="/explore/workouts">
          <Button
            sx={{
              bgcolor: view == "workouts" ? "black" : "white",
              color: view == "workouts" ? "white" : "black",
              borderRadius: 3,
              fontSize: 12,
            }}
          >
            Workouts
          </Button>
        </Link>
        <Link href="/explore/users ">
          <Button
            sx={{
              bgcolor: view == "workouts" ? "white" : "black",
              color: view == "workouts" ? "black" : "white",
              borderRadius: 3,
              fontSize: 12,
            }}
          >
            Users
          </Button>
        </Link>
      </Box>

      {loading && <Typography>Loading...</Typography>}

      {!loading && view === "workouts" && workouts.length === 0 && search && (
        <Typography>No workouts found</Typography>
      )}

      {!loading && view === "users" && users.length === 0 && search && (
        <Typography>No users found</Typography>
      )}

      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"stretch"}
        sx={{ mt: 4, width: "70%" }}
      >
        {view === "workouts" &&
          workouts.slice(0, 12).map((workout: fullWorkoutPlan) => (
            <Grid key={workout.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <WorkoutCard workoutPlan={workout} ifLink />
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
