import { Box, Typography } from "@mui/material";
import { fullWorkoutPlan } from "../../../backend/types";
import Link from "next/link";

export default function ExerciseCard({
  workoutPlan,
}: {
  workoutPlan: fullWorkoutPlan;
}) {
  return (
    <Link href={`/explore/${workoutPlan.id}`} key={workoutPlan.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid ",
          borderColor: "primary.light",
          borderRadius: 4,
          p: 4,
          textOverflow: "ellipsis",
          height: "100%",
          gap: 1,
        }}
      >
        <Typography variant="h1">{workoutPlan.title}</Typography>

        <Typography>{workoutPlan.user.nick}</Typography>
        <Box
          sx={{
            aspectRatio: "1/1",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={workoutPlan.image}
            alt={workoutPlan.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>
    </Link>
  );
}
