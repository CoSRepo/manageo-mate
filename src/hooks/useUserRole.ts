
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
        
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role, groups(name)')
          .eq('user_id', user.id)
          .single();
        
        setRole(roleData?.role || "user");
        // Fix for TypeScript error - access the first item in the groups array if it exists
        setGroup(roleData?.groups && Array.isArray(roleData.groups) && roleData.groups[0]?.name || null);
      } catch (err) {
        console.error("Error fetching user role:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch user role"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role, groups(name)')
          .eq('user_id', session.user.id)
          .single();
        
        setRole(roleData?.role || "user");
        // Fix for TypeScript error - access the first item in the groups array if it exists
        setGroup(roleData?.groups && Array.isArray(roleData.groups) && roleData.groups[0]?.name || null);
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
