import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

export interface DemoUser {
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
  onPersonaChange: (persona: DemoUser) => void;
}

export function PersonaSwitcher({ currentPersona, onPersonaChange }: PersonaSwitcherProps) {
  const { data: demoUsers = [] } = useQuery<DemoUser[]>({
    queryKey: ['/api/demo-users'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handlePersonaSelect = (persona: DemoUser) => {
    onPersonaChange(persona);
  };

  const displayUser = currentPersona || demoUsers[0];

  if (!displayUser) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-3 text-white hover:text-white hover:bg-white/10"
          data-testid="persona-switcher"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayUser.profileImageUrl} alt={`${displayUser.firstName} ${displayUser.lastName}`} />
            <AvatarFallback className="text-sm bg-white/20 text-white">
              {displayUser.firstName.charAt(0)}{displayUser.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">
              {displayUser.firstName} {displayUser.lastName}
            </span>
            <span className="text-xs opacity-80">{displayUser.jobTitle}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {demoUsers.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => handlePersonaSelect(user)}
            className="flex items-center space-x-3 p-3"
            data-testid={`persona-option-${user.id}`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-sm">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start flex-1">
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">{user.jobTitle}</div>
              <div className="text-xs text-gray-400">{user.department}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs px-1 py-0">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}