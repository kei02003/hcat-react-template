import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Users, Settings } from "lucide-react";
import { getRoleDisplayInfo } from "@/lib/authUtils";

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

interface PersonaSwitcherProps {
  currentPersona?: DemoUser;
  onPersonaChange?: (persona: DemoUser) => void;
}

export function PersonaSwitcher({ currentPersona, onPersonaChange }: PersonaSwitcherProps) {
  const [selectedPersona, setSelectedPersona] = useState<DemoUser | null>(currentPersona || null);

  // Fetch demo users
  const { data: demoUsers = [], isLoading, error } = useQuery<DemoUser[]>({
    queryKey: ['/api/demo-users'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handlePersonaSwitch = (persona: DemoUser) => {
    setSelectedPersona(persona);
    onPersonaChange?.(persona);
  };

  const getPersonaInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getPersonaRole = (roles: string[]) => {
    if (roles.length === 0) return { label: "No Role", color: "bg-gray-100 text-gray-800" };
    
    const primaryRole = roles[0];
    const roleInfo = getRoleDisplayInfo(primaryRole);
    return {
      label: roleInfo?.displayName || primaryRole,
      color: roleInfo?.color || "bg-gray-100 text-gray-800"
    };
  };

  // Handle production environment where demo users are not available
  if (error || (demoUsers.length === 0 && !isLoading)) {
    // In production, return a simple user indicator without the demo user functionality
    return (
      <div className="flex items-center space-x-3 px-3 py-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-600 text-white text-sm">
            U
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-white">
            Healthcare User
          </span>
          <Badge 
            className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 border-0"
          >
            Staff
          </Badge>
        </div>
      </div>
    );
  }

  // Default to first demo user if none selected
  const currentUser = selectedPersona || demoUsers[0];
  
  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  const currentRole = getPersonaRole(currentUser.roles);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-3 px-3 py-2 h-auto text-white hover:bg-gray-700 rounded-md"
          data-testid="persona-switcher"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.profileImageUrl} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {getPersonaInitials(currentUser.firstName, currentUser.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-white">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <Badge 
              className={`text-xs px-2 py-0.5 ${currentRole.color} border-0`}
              data-testid="current-role-badge"
            >
              {currentRole.label}
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-300" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-2" align="end">
        <DropdownMenuLabel className="flex items-center space-x-2 px-3 py-2">
          <Users className="h-4 w-4" />
          <span>Switch Demo Persona</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-96 overflow-y-auto">
          {demoUsers.map((user) => {
            const role = getPersonaRole(user.roles);
            const isSelected = selectedPersona?.id === user.id;
            
            return (
              <DropdownMenuItem
                key={user.id}
                onClick={() => handlePersonaSwitch(user)}
                className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 rounded-md ${
                  isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                data-testid={`persona-option-${user.employeeId}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {getPersonaInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {isSelected && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">Current</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.jobTitle}</p>
                  <p className="text-xs text-gray-400 truncate">{user.department}</p>
                  <div className="mt-1">
                    <Badge className={`text-xs px-2 py-0.5 ${role.color} border-0`}>
                      {role.label}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center space-x-2 p-3 text-gray-600">
          <Settings className="h-4 w-4" />
          <span className="text-sm">Manage Demo Users</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}