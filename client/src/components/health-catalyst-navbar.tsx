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
    <Box key="help" className="hc-navbar-icon">
      <HelpCircle size={18} />
    </Box>,
    <span key="separator" className="hc-navbar-vertical-separator"/>,
    <Box key="user" className="hc-navbar-username">
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2" sx={{ 
          fontSize: '0.875rem', 
          lineHeight: 1.2,
          fontWeight: 500
        }}>
          Christine K.
        </Typography>
        <Typography variant="caption" className="hc-navbar-username-subtext" sx={{ 
          fontSize: '0.75rem',
          lineHeight: 1.2,
          display: 'block'
        }}>
          Millrock Hospital
        </Typography>
      </Box>
      <ChevronDown size={14} />
    </Box>
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#495967', // Authentic Health Catalyst navbar color
        zIndex: 1300,
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar sx={{ 
        minHeight: '53px !important', 
        px: 3, 
        gap: 3,
        justifyContent: 'space-between'
      }}>
        {/* Brand Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href={homeUri} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #00aeff 0%, #0088cc 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              <Box sx={{
                width: 24,
                height: 24,
                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\'/%3E%3C/svg%3E") center/contain no-repeat'
              }} />
            </Box>
            <Typography sx={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}>
              Cashmere
            </Typography>
          </Link>
        </Box>

        {/* Navigation Links */}
        {linkContent.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0,
            flex: 1,
            maxWidth: '600px',
            justifyContent: 'center'
          }}>
            {linkContent.map((link, index) => (
              <Box key={index} sx={{
                position: 'relative',
                '& .navbar-link': {
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  position: 'relative',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                  '&.force-active': {
                    color: 'white',
                    fontWeight: 600,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#00aeff',
                      borderRadius: '2px 2px 0 0'
                    }
                  }
                }
              }}>
                {link}
              </Box>
            ))}
          </Box>
        )}

        {/* Right Content */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          '& .hc-navbar-icon': {
            color: 'rgba(255,255,255,0.8)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          },
          '& .hc-navbar-vertical-separator': {
            width: '1px',
            height: '20px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: '0 4px'
          },
          '& .hc-navbar-username': {
            color: 'white',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            },
            '& .hc-navbar-username-subtext': {
              fontSize: '0.75rem',
              opacity: 0.8,
              color: 'rgba(255,255,255,0.7)'
            }
          }
        }}>
          {rightContent.length > 0 ? rightContent : defaultRightContent}
        </Box>
      </Toolbar>
    </AppBar>
  );
}