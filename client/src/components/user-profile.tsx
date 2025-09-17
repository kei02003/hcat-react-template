import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  User, 
  Shield, 
  Building, 
  Phone, 
  Mail, 
  Calendar,
  Activity,
  LogOut,
  Settings
} from "lucide-react";
import { getRoleDisplayInfo, getCategoryDisplayName, getPermissionLevelColor } from "@/lib/authUtils";

export function UserProfile() {
  const { user, hasRole, getPrimaryRole } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
          <Button 
            className="mt-4 bg-[#006d9a] hover:bg-[#006d9a]/90 text-white"
            onClick={() => window.location.href = "/api/login"}
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const primaryRole = getPrimaryRole();
  const roleInfo = primaryRole ? getRoleDisplayInfo(primaryRole.name) : null;

  // Group permissions by category
  const permissionsByCategory = user.permissions?.reduce((acc, permission) => {
    const category = permission.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, typeof user.permissions>) || {};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* User Header */}
      <Card className="healthcare-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg font-semibold bg-[#006d9a]/20 text-[#006d9a]">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" data-testid="button-settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => window.location.href = "/api/logout"}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  {user.department || "Not specified"}
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {user.jobTitle || "Not specified"}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.phoneNumber || "Not provided"}
                </div>
              </div>
              
              {primaryRole && (
                <div className="mt-4">
                  <Badge className={roleInfo?.color}>
                    <Shield className="h-3 w-3 mr-1" />
                    {roleInfo?.displayName}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Profile Details */}
        <TabsContent value="profile">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="font-medium">{user.employeeId || "Not assigned"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{user.phoneNumber || "Not provided"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Organization Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{user.department || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Title:</span>
                      <span className="font-medium">{user.jobTitle || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Assigned Roles ({user.roles?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.roles?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.roles.map((role, index) => {
                    const displayInfo = getRoleDisplayInfo(role.name);
                    return (
                      <div 
                        key={index} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={displayInfo.color}>
                            {displayInfo.displayName}
                          </Badge>
                          <span className="text-xs text-gray-500">Level {role.level}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                        {role.department && (
                          <div className="text-xs text-gray-500">
                            Department: {role.department}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No roles assigned</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Permissions ({user.permissions?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(permissionsByCategory).length ? (
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        {getCategoryDisplayName(category)}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissions.map((permission, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-sm">{permission.displayName}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                            <Badge className={getPermissionLevelColor(permission.level)}>
                              {permission.level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No permissions assigned</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Account Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium">Last Login</p>
                    <p className="text-sm text-gray-500">
                      {user.lastLoginAt 
                        ? new Date(user.lastLoginAt).toLocaleString()
                        : "Never"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium">Account Created</p>
                    <p className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium">Last Profile Update</p>
                    <p className="text-sm text-gray-500">
                      {new Date(user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[#006d9a]/10 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Security Notice</h4>
                  <p className="text-sm text-blue-800">
                    Your account activity is monitored for security purposes. All actions are logged
                    in accordance with healthcare data protection regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}