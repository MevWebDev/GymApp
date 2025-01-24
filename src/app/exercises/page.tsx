import { Container } from "@mui/material";
import ExercisesPage from "../components/ExercisesPage";

export default function Home() {
  return (
    <Container maxWidth={false} sx={{ bgcolor: "secondary.main" }}>
      <ExercisesPage />
    </Container>
  );
}
