import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import { ChartLine, User, HelpCircle, ChevronDown } from 'lucide-react';

interface HealthCatalystNavbarProps {
  appIcon?: string;
  brandIcon?: string | React.ReactNode;
  cobrandIcon?: string;
  homeUri?: string;
  linkContent?: React.ReactNode[];
  rightContent?: React.ReactNode[];
}

export function HealthCatalystNavbar({ 
  appIcon = "https://cashmere.healthcatalyst.net/assets/CashmereAppLogo.svg",
  brandIcon = "https://cashmere.healthcatalyst.net/assets/TriFlame.svg",
  cobrandIcon,
  homeUri = "/",
  linkContent = [],
  rightContent = []
}: HealthCatalystNavbarProps) {
  
  const renderIcon = (iconSrc: string | React.ReactNode, size: number = 32) => {
    if (typeof iconSrc === 'string') {
      return (
        <img 
          src={iconSrc} 
          alt="Icon" 
          style={{ 
            width: size, 
            height: size, 
            objectFit: 'contain'
          }} 
        />
      );
    }
    return iconSrc;
  };

  const defaultRightContent = [
    <IconButton key="help" size="small" sx={{ color: 'white' }}>
      <HelpCircle size={18} />
    </IconButton>,
    <Divider key="separator" orientation="vertical" flexItem sx={{ 
      backgroundColor: 'rgba(255,255,255,0.3)', 
      mx: 1,
      height: '24px',
      alignSelf: 'center'
    }} />,
    <Box key="user" sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 0.5, 
      color: 'white',
      cursor: 'pointer',
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
      px: 1,
      py: 0.5,
      borderRadius: 1
    }}>
      <Box>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
          Christine K.
        </Typography>
        <Typography variant="caption" sx={{ 
          fontSize: '0.75rem', 
          opacity: 0.8,
          lineHeight: 1.2 
        }}>
          Millrock Hospital
        </Typography>
      </Box>
      <ChevronDown size={16} />
    </Box>
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#384655', // charcoal-blue from Health Catalyst colors
        zIndex: 1300,
        boxShadow: '0 2px 4px rgba(56,70,85,0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: '53px !important', px: 2, gap: 2 }}>
        {/* Brand Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link href={homeUri} sx={{ display: 'flex', alignItems: 'center' }}>
            {renderIcon(brandIcon, 28)}
          </Link>
          {renderIcon(appIcon, 120)}
          {cobrandIcon && (
            <>
              <Divider orientation="vertical" flexItem sx={{ 
                backgroundColor: 'rgba(255,255,255,0.3)', 
                mx: 1,
                height: '32px' 
              }} />
              {renderIcon(cobrandIcon, 80)}
            </>
          )}
        </Box>

        {/* Navigation Links */}
        {linkContent.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            ml: 2,
            overflow: 'hidden',
            flex: 1,
            maxWidth: 'calc(100vw - 600px)' // Reserve space for brand and right content
          }}>
            {linkContent.map((link, index) => (
              <Box key={index} sx={{
                '& .navbar-link': {
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                  },
                  '&.force-active': {
                    backgroundColor: 'rgba(0,174,255,0.2)', // Health Catalyst primary with alpha
                    color: 'white',
                    fontWeight: 600,
                  }
                }
              }}>
                {link}
              </Box>
            ))}
          </Box>
        )}

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right Content */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          '& .hc-navbar-icon': {
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          },
          '& .hc-navbar-vertical-separator': {
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            margin: '0 8px'
          },
          '& .hc-navbar-username': {
            color: 'white',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            },
            '& .hc-navbar-username-subtext': {
              fontSize: '0.75rem',
              opacity: 0.8
            }
          }
        }}>
          {rightContent.length > 0 ? rightContent : defaultRightContent}
        </Box>
      </Toolbar>
    </AppBar>
  );
}