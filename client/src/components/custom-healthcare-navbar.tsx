import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle, ChevronDown, Home, FileText } from "lucide-react";

interface CustomHealthcareNavbarProps {
  appIcon?: string;
  brandIcon?: string;
  cobrandIcon?: string;
  homeUri?: string;
  userName?: string;
  userSubtext?: string;
  onHomeClick?: () => void;
  onReportsClick?: () => void;
  onHelpClick?: () => void;
}

export function CustomHealthcareNavbar({
  appIcon,
  brandIcon,
  cobrandIcon,
  homeUri = "/",
  userName = "Christine K.",
  userSubtext = "Millrock Hospital",
  onHomeClick,
  onReportsClick,
  onHelpClick,
}: CustomHealthcareNavbarProps) {
  const [activeLink, setActiveLink] = useState("home");

  return (
    <nav className="bg-[#00426a] text-white px-4 py-2 flex items-center justify-between">
      {/* Left Section - Branding and Navigation */}
      <div className="flex items-center space-x-6">
        {/* Brand Icons */}
        <div className="flex items-center space-x-3">
          {brandIcon && (
            <img src={brandIcon} alt="Brand" className="h-8 w-auto" />
          )}
          {appIcon && (
            <img src={appIcon} alt="App Logo" className="h-8 w-auto" />
          )}
          {cobrandIcon && (
            <img src={cobrandIcon} alt="Cobrand" className="h-8 w-auto" />
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/10 ${
              activeLink === "home" ? "bg-white/20" : ""
            }`}
            onClick={() => {
              setActiveLink("home");
              onHomeClick?.();
            }}
          >
            <Home className="h-4 w-4 mr-2" />
            Summary
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/10 ${
              activeLink === "reports" ? "bg-white/20" : ""
            }`}
            onClick={() => {
              setActiveLink("reports");
              onReportsClick?.();
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            AR Management
          </Button>
        </div>
      </div>

      {/* Right Section - Help and User */}
      <div className="flex items-center space-x-4">
        {/* Help Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 p-2"
          onClick={onHelpClick}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-white/30" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <div className="text-right">
                <div className="text-sm font-medium">{userName}</div>
                <div className="text-xs text-white/80">{userSubtext}</div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
