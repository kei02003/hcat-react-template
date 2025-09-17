import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  RefreshCw,
  Shield,
  Building,
  Phone,
  Mail,
  Loader2
} from "lucide-react";
import { getRoleDisplayInfo } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DemoUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  employeeId: string;
  department: string;
  jobTitle: string;
  phoneNumber: string;
  roles: string[];
}

export function DemoUserSelector() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);

  // Fetch demo users
  const { data: demoUsers = [], isLoading, error } = useQuery<DemoUser[]>({
    queryKey: ['/api/demo-users'],
    retry: false,
  });

  // Create demo users mutation
  const createUsersMutation = useMutation({
    mutationFn: () => apiRequest('/api/demo-users/create', { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Demo users created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/demo-users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create demo users",
        variant: "destructive",
      });
    },
  });

  // Remove demo users mutation
  const removeUsersMutation = useMutation({
    mutationFn: () => apiRequest('/api/demo-users', { method: 'DELETE' }),
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Demo users removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/demo-users'] });
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove demo users",
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <Card className="healthcare-card">
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Failed to load demo users. This feature is only available in development mode.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="healthcare-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <CardTitle>Demo Users Management</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Manage healthcare staff demo accounts for testing RBAC functionality
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/demo-users'] })}
                variant="outline"
                size="sm"
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => createUsersMutation.mutate()}
                disabled={createUsersMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
                data-testid="button-create-users"
              >
                {createUsersMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Create Demo Users
              </Button>
              {demoUsers.length > 0 && (
                <Button
                  onClick={() => removeUsersMutation.mutate()}
                  disabled={removeUsersMutation.isPending}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  size="sm"
                  data-testid="button-remove-users"
                >
                  {removeUsersMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Remove All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <Card className="healthcare-card">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading demo users...</p>
          </CardContent>
        </Card>
      ) : demoUsers.length === 0 ? (
        <Card className="healthcare-card">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Demo Users Found</h3>
            <p className="text-gray-600 mb-4">
              Create demo users to test the role-based access control system with different healthcare staff positions.
            </p>
            <Button
              onClick={() => createUsersMutation.mutate()}
              disabled={createUsersMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-create-initial-users"
            >
              {createUsersMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Create Demo Users
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle>Healthcare Staff ({demoUsers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {demoUsers.map((user, index) => (
                  <div key={user.id}>
                    <div 
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'bg-[#006d9a]/10 border-r-4 border-[#006d9a]' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedUser(user)}
                      data-testid={`user-card-${user.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-[#006d9a]/20 text-[#006d9a]">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <div className="flex space-x-1">
                              {user.roles.slice(0, 2).map((roleName, roleIndex) => {
                                const roleInfo = getRoleDisplayInfo(roleName);
                                return (
                                  <Badge 
                                    key={roleIndex}
                                    className={`text-xs ${roleInfo.color}`}
                                  >
                                    {roleInfo.displayName.split(' ')[0]}
                                  </Badge>
                                );
                              })}
                              {user.roles.length > 2 && (
                                <Badge className="text-xs bg-gray-100 text-gray-600">
                                  +{user.roles.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                          <p className="text-xs text-gray-500 truncate">{user.jobTitle} • {user.department}</p>
                        </div>
                      </div>
                    </div>
                    {index < demoUsers.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Details */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-6">
                  {/* User Header */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedUser.profileImageUrl} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
                      <AvatarFallback className="text-lg bg-[#006d9a]/20 text-[#006d9a]">
                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <p className="text-gray-600">{selectedUser.jobTitle}</p>
                      <p className="text-sm text-gray-500">ID: {selectedUser.employeeId}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedUser.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedUser.phoneNumber}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        {selectedUser.department}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Roles */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Assigned Roles ({selectedUser.roles.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedUser.roles.map((roleName, index) => {
                        const roleInfo = getRoleDisplayInfo(roleName);
                        return (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <span className="font-medium">{roleInfo.displayName}</span>
                            <div className="flex items-center space-x-2">
                              <Badge className={roleInfo.color}>
                                Level {roleInfo.level}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Login Instructions */}
                  <div className="bg-[#006d9a]/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Testing Instructions</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Use <strong>{selectedUser.email}</strong> to test this role</p>
                      <p>• Login via the authentication system to see role-specific access</p>
                      <p>• Each role has different dashboard permissions and features</p>
                      <p>• Multi-role users inherit combined permissions</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a user from the list to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Instructions */}
      <Card className="healthcare-card bg-gray-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Demo Users Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Role Hierarchy</h4>
              <ul className="space-y-1">
                <li>• <strong>System Admin</strong> - Full system access</li>
                <li>• <strong>Clinical Director</strong> - Clinical oversight</li>
                <li>• <strong>Revenue Manager</strong> - Complete RCM access</li>
                <li>• <strong>Specialists</strong> - Department-specific access</li>
                <li>• <strong>Read Only</strong> - View permissions only</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Testing Features</h4>
              <ul className="space-y-1">
                <li>• Each role has different dashboard tabs available</li>
                <li>• Permission-based component visibility</li>
                <li>• Role-based API endpoint access</li>
                <li>• Multi-role users get combined permissions</li>
                <li>• Audit logging for all user actions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}