
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

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        if (!user) {
          setRole(null);
          setGroup(null);
          setUser(null);
          return;
        }

        setUser(user);
        
        // Query the user_roles table directly with the user's ID
        // This takes advantage of the RLS policies we just set up
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role, group_id')
          .eq('user_id', user.id)
          .single();
        
        if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is okay
          console.warn("Error fetching user role:", roleError);
          // Default to "user" role if there's an error
          setRole("user");
        } else if (roleData) {
          setRole(roleData.role || "user");
          
          // If we have a group_id, fetch the group name
          if (roleData.group_id) {
            const { data: groupData } = await supabase
              .from('groups')
              .select('name')
              .eq('id', roleData.group_id)
              .single();
              
            setGroup(groupData?.name || null);
          }
        } else {
          // No role assigned, default to "user"
          setRole("user");
        }
      } catch (err) {
        console.error("Error in useUserRole hook:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch user role"));
        // Default to user role on error
        setRole("user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        try {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role, group_id')
            .eq('user_id', session.user.id)
            .single();
          
          if (roleError && roleError.code !== 'PGRST116') {
            console.warn("Error fetching user role:", roleError);
            setRole("user");
          } else if (roleData) {
            setRole(roleData.role || "user");
            
            if (roleData.group_id) {
              const { data: groupData } = await supabase
                .from('groups')
                .select('name')
                .eq('id', roleData.group_id)
                .single();
                
              setGroup(groupData?.name || null);
            } else {
              setGroup(null);
            }
          } else {
            setRole("user");
            setGroup(null);
          }
        } catch (err) {
          console.error("Error in auth state change:", err);
          setRole("user");
          setGroup(null);
        }
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
