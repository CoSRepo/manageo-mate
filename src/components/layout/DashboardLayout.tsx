
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Home, 
  ClipboardList,
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AppLayout from "./AppLayout";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserRole } from "@/hooks/useUserRole";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    navigate("/login");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Work Orders", href: "/workorders", icon: ClipboardList },
  ];

  const adminItems = [
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden border-r bg-white md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-1 pt-5">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center">
                <span className="text-xl font-bold">WorkOrder App</span>
              </div>
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                    {item.name}
                  </Link>
                ))}
                
                {isAdmin && (
                  <>
                    <Separator className="my-2" />
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                      Admin
                    </div>
                    {adminItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t p-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 flex-shrink-0 border-b bg-white md:hidden">
            <div className="flex flex-1 items-center justify-between px-4">
              <div className="flex items-center">
                <span className="text-xl font-bold">WorkOrder App</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="sm:max-w-xs">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-lg font-semibold">WorkOrder App</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <nav className="flex-1 space-y-1 py-4">
                        {navigationItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                            {item.name}
                          </Link>
                        ))}
                        
                        {isAdmin && (
                          <>
                            <Separator className="my-2" />
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                              Admin
                            </div>
                            {adminItems.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100"
                                onClick={() => setIsOpen(false)}
                              >
                                <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                                {item.name}
                              </Link>
                            ))}
                          </>
                        )}
                      </nav>
                      <div className="border-t pt-4">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardLayout;
