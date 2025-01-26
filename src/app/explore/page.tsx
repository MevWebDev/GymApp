import { Container } from "@mui/material";
import ExplorePage from "../components/ExplorePage";

export default function Home() {
  return (
    <Container maxWidth={false} sx={{ bgcolor: "secondary.main" }}>
      <ExplorePage />
    </Container>
  );
}
