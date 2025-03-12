
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Users, Settings } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";

const Dashboard = () => {
  const { user, isAdmin } = useUserRole();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active work orders</p>
            </CardContent>
          </Card>

          {isAdmin && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Total users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Settings</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Manage Settings
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Work Orders</CardTitle>
              <CardDescription>
                Your most recent work orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground">No recent work orders</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                View All Work Orders
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button>Create New Work Order</Button>
                <Button variant="outline">View My Work Orders</Button>
                {isAdmin && (
                  <Button variant="outline">Manage Users</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
