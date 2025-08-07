import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  TrendingUp,
  AccountBalance,
  Collections,
  Schedule,
  LocalHospital,
  Psychology,
  Gavel,
  Assessment,
  ShowChart,
} from '@mui/icons-material';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  active?: boolean;
  section?: string;
}

interface HealthcareSidebarProps {
  open: boolean;
  onItemClick: (itemId: string) => void;
  activeItem?: string;
}

const menuItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <Dashboard />,
    section: 'Dashboard',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: <Assignment />,
    badge: 23,
    section: 'Core Modules',
  },
  {
    id: 'predictive',
    label: 'Predictive Analytics',
    icon: <TrendingUp />,
    section: 'Core Modules',
  },
  {
    id: 'ar-management',
    label: 'AR Management',
    icon: <AccountBalance />,
    badge: 8,
    section: 'Core Modules',
  },
  {
    id: 'collections',
    label: 'Collections',
    icon: <Collections />,
    section: 'Core Modules',
  },
  {
    id: 'timely-filing',
    label: 'Timely Filing',
    icon: <Schedule />,
    badge: 12,
    section: 'Core Modules',
  },
  {
    id: 'clinical-denials',
    label: 'Clinical Denials',
    icon: <LocalHospital />,
    badge: 15,
    section: 'Core Modules',
  },
  {
    id: 'pre-authorization',
    label: 'Pre-Authorization',
    icon: <Assessment />,
    badge: 6,
    section: 'RFP Modules',
  },
  {
    id: 'clinical-decision',
    label: 'Clinical Decision Support',
    icon: <Psychology />,
    badge: 4,
    section: 'RFP Modules',
  },
  {
    id: 'appeal-generation',
    label: 'Appeal Generation',
    icon: <Gavel />,
    section: 'RFP Modules',
  },
  {
    id: 'analytics',
    label: 'Advanced Analytics',
    icon: <ShowChart />,
    section: 'Analytics',
  },
];

export function HealthcareSidebar({ open, onItemClick, activeItem = 'overview' }: HealthcareSidebarProps) {
  const drawerWidth = 280;

  const renderSection = (sectionName: string, items: SidebarItem[]) => (
    <Box key={sectionName}>
      <Typography
        variant="overline"
        sx={{
          px: 2,
          py: 1,
          fontWeight: 600,
          color: 'text.secondary',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
        }}
      >
        {sectionName}
      </Typography>
      <List dense>
        {items.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeItem === item.id}
              onClick={() => onItemClick(item.id)}
              sx={{
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: activeItem === item.id ? 'inherit' : 'primary.main',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: activeItem === item.id ? 600 : 500,
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  color="secondary"
                  sx={{
                    height: 20,
                    '& .MuiChip-label': {
                      fontSize: '0.75rem',
                      padding: '0 6px',
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const groupedItems = menuItems.reduce((acc, item) => {
    const section = item.section || 'Other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: '64px', // Height of AppBar
          height: 'calc(100vh - 64px)',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', py: 1 }}>
        {Object.entries(groupedItems).map(([sectionName, items], index) => (
          <React.Fragment key={sectionName}>
            {index > 0 && <Divider sx={{ my: 1 }} />}
            {renderSection(sectionName, items)}
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
}