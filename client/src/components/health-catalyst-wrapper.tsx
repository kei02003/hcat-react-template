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
          appIcon="https://cashmere.healthcatalyst.net/assets/CashmereAppLogo.svg"
          brandIcon="https://cashmere.healthcatalyst.net/assets/TriFlame.svg"
          cobrandIcon="https://static.wixstatic.com/media/d6aae0_4e754588d0214c17bac9bff8ef52f69b~mv2.png/v1/fill/w_310,h_105,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/HYBRID-Cloud-allGray_edited.png"
          homeUri="/"
          linkContent={[
            <a key="home" className="navbar-link force-active" href="/" title="Home">Home</a>,
            <a key="reports" className="navbar-link" href="/" title="Reports">Reports</a>
          ]}
          rightContent={[
            <HealthCatalystIcon key="help" icon="fa-question-circle-o" size="small" sx={{ cursor: 'pointer' }} />,
            <span key="separator" className="hc-navbar-vertical-separator"/>,
            <div key="user" className="hc-navbar-username">
              <span>
                <span>Christine K.</span>
                <br />
                <span className="hc-navbar-username-subtext">Millrock Hospital</span>
              </span> 
              <HealthCatalystIcon icon="fa-angle-down" size="small" />
            </div>
          ]}
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