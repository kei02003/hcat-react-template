import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { HealthCatalystNavbar } from './health-catalyst-navbar';
import { HealthCatalystIcon } from './health-catalyst-icon';

interface HealthCatalystWrapperProps {
  children?: React.ReactNode;
  showDemo?: boolean;
}

export function HealthCatalystWrapper({ children, showDemo = false }: HealthCatalystWrapperProps) {
  if (showDemo) {
    return (
      <Box>
        <HealthCatalystNavbar
          appIcon="My App"
          brandIcon={<HealthCatalystIcon icon="hci-catalyst-logo" size="large" />}
          rightContent={
            <Box sx={{ p: 2, color: 'white' }}>
              Welcome, User!
            </Box>
          }
        />
        
        <Box sx={{ mt: '53px', p: 2 }}>
          <Typography variant="h1" sx={{ pb: 2 }}>
            Hello Cashmere!
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            This app is using React, Material UI and themed with Health Catalyst colors.
          </Typography>
          
          <Typography variant="h2" sx={{ pt: 3, mb: 2 }}>
            Buttons
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="contained" color="secondary">
              Secondary Button
            </Button>
          </Box>
          
          <Typography variant="h2" sx={{ pt: 3, mb: 2 }}>
            Icons
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1">Font Awesome style:</Typography>
              <HealthCatalystIcon icon="fa-cog" size="large" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1">Health Catalyst Logo:</Typography>
              <HealthCatalystIcon icon="hci-catalyst-logo" size="large" />
            </Box>
          </Box>
          
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <HealthCatalystNavbar />
      <Box sx={{ mt: '53px' }}>
        {children}
      </Box>
    </Box>
  );
}