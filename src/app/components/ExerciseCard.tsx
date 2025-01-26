import { Box, Typography } from "@mui/material";
import { Exercise } from "../../../backend/types";
import Link from "next/link";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Link href={`/exercises/${exercise.id}`} key={exercise.id}>
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
        }}
      >
        <img src={exercise.gifUrl} alt={exercise.name} />
        <Typography
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          variant="h6"
        >
          {exercise.name}
        </Typography>
        <Typography>{exercise.bodyPart}</Typography>
        <Typography>{exercise.target}</Typography>
        <Typography>{exercise.equipment}</Typography>
      </Box>
    </Link>
  );
}
