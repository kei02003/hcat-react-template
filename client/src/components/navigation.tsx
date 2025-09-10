import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Activity, 
  User, 
  Users, 
  LogOut, 
  Settings,
  Shield,
  BarChart3,
  Home,
  RotateCcw
} from "lucide-react";
import { getRoleDisplayInfo } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const { user, isAuthenticated, getPrimaryRole } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();

  const handleDemoReset = async () => {
    try {
      const response: any = await apiRequest("/api/demo/reset", "POST");
      
      // Invalidate all appeal-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["appeal-cases"] });
      queryClient.invalidateQueries({ queryKey: ["challenge-letters"] });
      
      toast({
        title: "Demo Reset Successful",
        description: `Reset ${response.resetCount} appeal cases to initial state`,
      });
    } catch (error) {
      console.error("Demo reset failed:", error);
      toast({
        title: "Demo Reset Failed",
        description: "Failed to reset demo state. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const primaryRole = getPrimaryRole();
  const roleInfo = primaryRole ? getRoleDisplayInfo(primaryRole.name) : null;

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/demo-users", label: "Demo Users", icon: Users, devOnly: true },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Healthcare RCM
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              {navigationItems.map((item) => {
                // Skip dev-only items in production
                if (item.devOnly && process.env.NODE_ENV === 'production') {
                  return null;
                }

                const Icon = item.icon;
                const isActive = location === item.path;

                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`flex items-center space-x-2 ${
                        isActive 
                          ? "bg-blue-600 text-white" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      data-testid={`nav-link-${item.path.replace('/', '') || 'home'}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            {primaryRole && roleInfo && (
              <Badge className={`${roleInfo.color} hidden sm:inline-flex`}>
                <Shield className="h-3 w-3 mr-1" />
                {roleInfo.displayName}
              </Badge>
            )}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2"
                  data-testid="user-menu-trigger"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.department || "Healthcare Staff"}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.employeeId && (
                    <p className="text-xs text-gray-400">ID: {user.employeeId}</p>
                  )}
                </div>

                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer" data-testid="menu-profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem className="cursor-pointer" data-testid="menu-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>

                {/* Development-only items */}
                {import.meta.env.MODE === 'development' && (
                  <>
                    <DropdownMenuSeparator />
                    <Link href="/demo-users">
                      <DropdownMenuItem className="cursor-pointer text-orange-600" data-testid="menu-demo-users">
                        <Users className="h-4 w-4 mr-2" />
                        Demo Users
                      </DropdownMenuItem>
                    </Link>
                    
                    <DropdownMenuItem 
                      className="cursor-pointer text-blue-600" 
                      onClick={handleDemoReset}
                      data-testid="menu-demo-reset"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Demo
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                  className="cursor-pointer text-red-600"
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="menu-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}