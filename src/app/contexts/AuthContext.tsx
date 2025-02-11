"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../../../backend/auth/supabaseClient";
import { User as CustomUser } from "../../../backend/types";
import axios from "axios";

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const fetchUserDetails = async (userId: string): Promise<CustomUser | null> => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/dashboard?type=recovery",
    });
    if (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
    return data;
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        let fullUser = await fetchUserDetails(session.user.id);
        if (!fullUser) {
          await axios.post("http://localhost:3001/api/users/create", {
            id: session.user.id,
            nick: session.user.user_metadata.full_name,
            email: session.user.email,
            avatar: session.user.user_metadata.picture,
            password: "",
          });
          fullUser = await fetchUserDetails(session.user.id);
        }
        setUser(fullUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUserDetails(session.user.id).then((fullUser) => {
          setUser(fullUser);
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
