import { Box, Typography } from "@mui/material";
import { fullWorkoutPlan } from "../../../backend/types";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ExerciseCard({
  workoutPlan,
  ifLink,
}: {
  workoutPlan: fullWorkoutPlan;
  ifLink?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,

        textOverflow: "ellipsis",
        gap: 0.5,
        cursor: "pointer",
      }}
      onClick={() => redirect(`/explore/workouts/${workoutPlan.id}`)}
    >
      <Box
        sx={{
          aspectRatio: "1/1",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        <img
          src={workoutPlan.image}
          alt={workoutPlan.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Typography variant="h3">{workoutPlan.title}</Typography>

      <Box
        sx={{ display: ifLink ? "flex" : "none", alignItems: "center", gap: 1 }}
      >
        <Box sx={{ width: 40, borderRadius: "50%", overflow: "hidden" }}>
          <img
            src={workoutPlan.user.avatar}
            alt={workoutPlan.user.nick}
            style={{ width: "100%", objectFit: "cover" }}
          />
        </Box>

        <Link
          href={`/explore/users/${workoutPlan.userId}`}
          passHref
          onClick={(e) => e.stopPropagation()}
        >
          <Typography
            component="span"
            sx={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {workoutPlan.user.nick}
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
