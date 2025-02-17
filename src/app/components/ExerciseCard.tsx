import { Box, Typography } from "@mui/material";
import type { Exercise } from "../../../shared/shared_types";
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
            fontWeight: "bold",
          }}
          variant="h6"
        >
          {exercise.name}
        </Typography>
      </Box>
    </Link>
  );
}
