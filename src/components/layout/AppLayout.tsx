
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AppLayout = ({ children, requireAuth = true }: AppLayoutProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          if (requireAuth) navigate("/login");
        }
        
        setSession(data.session);
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session);
            if (!session && requireAuth) navigate("/login");
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [navigate, requireAuth]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session && requireAuth) {
    navigate("/login");
    return null;
  }

  return <>{children}</>;
};

export default AppLayout;
