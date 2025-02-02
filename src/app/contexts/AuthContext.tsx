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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const fetchUserDetails = async (userId: string): Promise<CustomUser | null> => {
  try {
    const response = await axios.get(`http://localhost:3001/api/users/14`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const fullUser = await fetchUserDetails(session.user.id);
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
    <AuthContext.Provider value={{ user, loading }}>
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
