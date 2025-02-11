"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  darken,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useParams } from "next/navigation";
import { completeUser, fullWorkoutPlan } from "../../../../../backend/types";
import WorkoutCard from "../../../components/WorkoutCard";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import FollowListPopup from "../../../components/FollowListPopup";

export default function ExercisePage() {
  const { id } = useParams();
  const { user: loggedUser } = useAuth();
  const [user, setUser] = useState<completeUser | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<fullWorkoutPlan[]>([]);

  const [followStateLoading, setFollowStateLoading] = useState(true);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("Followers");
  const [popupUsers, setPopupUsers] = useState<any[]>([]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

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
            throw new Error("Failed to fetch data");
          }
          const userData = (await response1.json()) as completeUser;
          const workouts = (await response2.json()) as fullWorkoutPlan[];

          setUser(userData);
          setWorkoutPlans(workouts);
          setFollowStateLoading(false);
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

  const isFollowing = loggedUser
    ? user.followers.some((f: any) => f.follower.id === loggedUser.id)
    : false;

  const handleOpenPopup = (mode: "followers" | "following") => {
    if (mode === "followers") {
      setPopupTitle("Followers");

      setPopupUsers(user.followers.map((f: any) => f.follower));
    } else {
      setPopupTitle("Following");

      setPopupUsers(user.following.map((f: any) => f.following));
    }
    setPopupOpen(true);
  };

  const handleFollow = async () => {
    if (!loggedUser || !user) return;
    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/follow`,
        {
          followingId: user.id,
          followerId: loggedUser.id,
        }
      );

      setSnackbar({
        open: true,
        message: "User followed successfully!",
        severity: "success",
      });

      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          followers: [
            ...prevUser.followers,
            {
              followerId: loggedUser.id,
              followingId: user.id,
              follower: loggedUser,
            },
          ],
        };
      });
    } catch (error) {
      console.error("Error following user:", error);
      setSnackbar({
        open: true,
        message: "Error following user.",
        severity: "error",
      });
    }
  };

  const handleUnfollow = async () => {
    if (!loggedUser || !user) return;
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/users/unfollow`,

        {
          data: {
            followerId: loggedUser.id,
            followingId: user.id,
          },
        }
      );

      setSnackbar({
        open: true,
        message: "User unfollowed successfully!",
        severity: "success",
      });

      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          followers: prevUser.followers.filter(
            (f: any) => f.follower.id !== loggedUser.id
          ),
        };
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setSnackbar({
        open: true,
        message: "Error unfollowing user.",
        severity: "error",
      });
    }
  };

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
      <Box sx={{ display: "flex", gap: 2, cursor: "pointer" }}>
        <Typography
          variant="body1"
          onClick={() => handleOpenPopup("followers")}
        >
          Followers: {user.followers.length}
        </Typography>
        <Typography variant="body1">|</Typography>
        <Typography
          variant="body1"
          onClick={() => handleOpenPopup("following")}
        >
          Following: {user.following.length}
        </Typography>
      </Box>
      {loggedUser && loggedUser?.id !== user.id && !followStateLoading && (
        <>
          {isFollowing ? (
            <Button
              onClick={handleUnfollow}
              sx={{
                bgcolor: "#f44336",
                color: "secondary.main",
                mt: 1,
                "&:hover": { bgcolor: darken("#f44336", 0.1) },
                px: 2,
                py: 1,
                borderRadius: 12,
              }}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
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
          )}
        </>
      )}
      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"stretch"}
        sx={{ mt: 2, width: "100%" }}
      >
        {workoutPlans.map((workout: fullWorkoutPlan) => (
          <Grid key={workout.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <WorkoutCard workoutPlan={workout} />
          </Grid>
        ))}
      </Grid>

      <FollowListPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        users={popupUsers}
        title={popupTitle}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
