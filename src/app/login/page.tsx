"use client";
import { useEffect } from "react";
import AuthComponent from "../components/Auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return <AuthComponent />;
}

export default Home;
