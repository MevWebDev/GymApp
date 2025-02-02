"use client";
import { Container, Typography, Box, Button, darken } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User, fullWorkoutPlan } from "../../../../../backend/types";
import WorkoutCard from "../../../components/WorkoutCard";

export default function ExercisePage() {
  const { id } = useParams();
  console.log(id);
  const [user, setUser] = useState<User | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<fullWorkoutPlan[]>([]);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response1 = await fetch(
            `http://localhost:3001/api/users/${id}`
          );
          const response2 = await fetch(
            `http://localhost:3001/api/users/${id}/workouts`
          );
          if (!response1.ok || !response2.ok) {
            throw new Error("Failed to fetch exercise");
          }
          const user = (await response1.json()) as User;
          const workouts = (await response2.json()) as fullWorkoutPlan[];

          setUser(user);
          setWorkoutPlans(workouts);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUser();
    }
  }, [id]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 4,
        gap: 1,
      }}
    >
      <Box
        sx={{
          aspectRatio: "1/1",
          width: { xs: 150, md: 200 },
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src={user.avatar}
          alt={user.avatar}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography variant="h1">{user.nick}</Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography variant="body1">Followers: {user.followers} </Typography>
        <Typography>|</Typography>
        <Typography variant="body1">Following: {user.following}</Typography>
      </Box>
      <Button
        sx={{
          bgcolor: "#2196F3",
          color: "secondary.main",
          mt: 1,
          "&:hover": { bgcolor: darken("#2196F3", 0.1) },
          px: 2,
          py: 1,
          borderRadius: 12,
        }}
      >
        Follow
      </Button>
      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"stretch"}
        sx={{ mt: 2 }}
      >
        {workoutPlans.slice(0, 12).map((workout: fullWorkoutPlan) => (
          <Grid key={workout.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <WorkoutCard workoutPlan={workout} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
