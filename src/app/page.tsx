"use client";
import { Container } from "@mui/material";
import { useAuth } from "./contexts/AuthContext";

import Chat from "./components/Chat";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <Container maxWidth={false} sx={{ bgcolor: "secondary.main" }}>
      {user ? <h1>Welcome, {user.nick}!</h1> : null}

      <Chat />
    </Container>
  );
}
