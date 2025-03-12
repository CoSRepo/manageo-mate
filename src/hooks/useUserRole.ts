
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type UserRole = "admin" | "user" | null;
type UserGroup = string | null;

interface UserRoleData {
  role: UserRole;
  group: UserGroup;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  user: User | null;
}

export const useUserRole = (): UserRoleData => {
  const [role, setRole] = useState<UserRole>(null);
  const [group, setGroup] = useState<UserGroup>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setGroup(null);
          setUser(null);
          return;
        }

        setUser(user);
        
        // Access the role from the user metadata
        const userRole = user.user_metadata?.role as UserRole;
        const userGroup = user.user_metadata?.group as UserGroup;
        
        setRole(userRole || "user"); // Default to 'user' if no role specified
        setGroup(userGroup);
      } catch (err) {
        console.error("Error fetching user role:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch user role"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userRole = session.user.user_metadata?.role as UserRole;
        const userGroup = session.user.user_metadata?.group as UserGroup;
        
        setRole(userRole || "user");
        setGroup(userGroup);
      } else {
        setRole(null);
        setGroup(null);
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    role,
    group,
    isAdmin: role === "admin",
    isLoading,
    error,
    user
  };
};
