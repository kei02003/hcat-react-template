import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import { ChartLine, User } from 'lucide-react';

interface HealthCatalystNavbarProps {
  appIcon?: string;
  brandIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function HealthCatalystNavbar({ 
  appIcon = "RevenueCycle", 
  brandIcon,
  rightContent 
}: HealthCatalystNavbarProps) {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#384655', // charcoal-blue from Health Catalyst colors
        zIndex: 1300,
        boxShadow: '0 2px 4px rgba(56,70,85,0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: '53px !important', px: 2 }}>
        {/* Brand Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {brandIcon || (
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#00aeff',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <ChartLine size={20} />
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            {appIcon}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right Content */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {rightContent || (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                Welcome, User!
              </Typography>
              <IconButton size="small" sx={{ color: 'white' }}>
                <User size={18} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}