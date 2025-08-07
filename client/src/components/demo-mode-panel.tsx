import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Users, 
  ChevronRight,
  ChevronDown,
  Eye,
  Play,
  Building,
  Phone,
  Mail,
  Shield,
  UserCheck
} from "lucide-react";
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

interface DemoModePanelProps {
  currentPersona?: DemoUser;
  onPersonaChange?: (persona: DemoUser) => void;
}

export function DemoModePanel({ currentPersona, onPersonaChange }: DemoModePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<DemoUser | null>(currentPersona || null);

  // Fetch demo users
  const { data: demoUsers = [], isLoading } = useQuery<DemoUser[]>({
    queryKey: ['/api/demo-users'],
    retry: false,
  });

  const handlePersonaSwitch = (persona: DemoUser) => {
    setSelectedPersona(persona);
    onPersonaChange?.(persona);
  };

  const getPersonaInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getPersonaRole = (roles: string[]) => {
    if (roles.length === 0) return { label: "No Role", color: "bg-gray-100 text-gray-800", description: "" };
    
    const primaryRole = roles[0];
    const roleInfo = getRoleDisplayInfo(primaryRole);
    return {
      label: roleInfo?.label || primaryRole,
      color: roleInfo?.color || "bg-gray-100 text-gray-800",
      description: roleInfo?.description || ""
    };
  };

  const getScenarioDescription = (jobTitle: string, department: string) => {
    const scenarios: { [key: string]: string } = {
      "System Administrator": "See how IT manages user access, system settings, and security configurations",
      "Clinical Director": "Experience clinical oversight, denial reviews, and quality assurance workflows",
      "Revenue Cycle Manager": "Explore revenue optimization, KPI monitoring, and financial performance tracking",
      "Billing Manager": "Manage billing operations, payment processing, and insurance coordination",
      "Clinical Reviewer": "Review medical records, assess clinical documentation, and make coverage decisions",
      "Denial Specialist": "Handle claim denials, appeal generation, and payer communications",
      "AR Specialist": "Monitor accounts receivable, aging reports, and collection activities",
      "Collections Specialist": "Manage patient collections, payment plans, and discharge follow-up",
      "Financial Analyst": "Analyze financial trends, generate reports, and monitor budget performance"
    };
    
    return scenarios[jobTitle] || `Explore ${department} workflows and responsibilities`;
  };

  if (isLoading) {
    return (
      <div className="fixed right-4 top-20 z-50">
        <Card className="w-80 animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-20 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 bg-white shadow-lg hover:shadow-xl transition-shadow"
            data-testid="demo-mode-trigger"
          >
            <Users className="h-4 w-4" />
            <span>Demo Personas</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <Card className="w-96 max-w-sm shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5" />
                <span>Demo Personas</span>
              </CardTitle>
              <CardDescription>
                Switch between different healthcare roles to explore various workflows and permissions
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="space-y-3 p-4">
                  {demoUsers.map((user) => {
                    const role = getPersonaRole(user.roles);
                    const isSelected = selectedPersona?.id === user.id;
                    const scenario = getScenarioDescription(user.jobTitle, user.department);
                    
                    return (
                      <Card 
                        key={user.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handlePersonaSwitch(user)}
                        data-testid={`demo-persona-card-${user.employeeId}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getPersonaInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {user.firstName} {user.lastName}
                                </h3>
                                {isSelected && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 truncate">{user.jobTitle}</p>
                              
                              <div className="flex items-center space-x-1 mt-1">
                                <Building className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500 truncate">{user.department}</span>
                              </div>
                              
                              <div className="mt-2">
                                <Badge className={`text-xs px-2 py-1 ${role.color} border-0`}>
                                  <Shield className="h-3 w-3 mr-1" />
                                  {role.label}
                                </Badge>
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                {scenario}
                              </p>
                              
                              <div className="mt-3 flex justify-between items-center">
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{user.email}</span>
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  variant={isSelected ? "default" : "outline"}
                                  className="h-7 px-3 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePersonaSwitch(user);
                                  }}
                                >
                                  {isSelected ? (
                                    <>
                                      <Eye className="h-3 w-3 mr-1" />
                                      Current
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-3 w-3 mr-1" />
                                      Switch
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
              
              <Separator />
              <div className="p-4 bg-gray-50">
                <p className="text-xs text-gray-600 text-center">
                  Each persona has different permissions and access levels
                </p>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}