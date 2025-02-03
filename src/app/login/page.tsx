"use client";
import { useEffect } from "react";
import AuthComponent from "../components/Auth";
import { redirect } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);

  return <AuthComponent />;
}

export default Home;
