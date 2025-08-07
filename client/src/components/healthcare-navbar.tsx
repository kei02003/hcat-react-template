import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  ExitToApp,
  Dashboard,
  LocalHospital,
  Assessment,
} from '@mui/icons-material';

interface HealthcareNavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export function HealthcareNavbar({ user, onLogout }: HealthcareNavbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    if (onLogout) onLogout();
  };

  return (
    <AppBar position="fixed" elevation={2}>
      <Toolbar>
        <LocalHospital sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Healthcare Revenue Cycle
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            sx={{ textTransform: 'none' }}
          >
            Dashboard
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Assessment />}
            sx={{ textTransform: 'none' }}
          >
            Analytics
          </Button>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={user.role}
                size="small"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontSize: '0.75rem',
                }}
              />
              
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                
                <Divider />
                
                <MenuItem onClick={handleClose}>
                  <Settings sx={{ mr: 2 }} />
                  Settings
                </MenuItem>
                
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}