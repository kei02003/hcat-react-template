import React from 'react';
import { Box } from '@mui/material';
import * as LucideIcons from 'lucide-react';

interface HealthCatalystIconProps {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  sx?: any;
}

export function HealthCatalystIcon({ 
  icon, 
  size = 'medium', 
  color = 'currentColor',
  sx = {}
}: HealthCatalystIconProps) {
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const iconSize = sizeMap[size];

  // Handle Health Catalyst specific icons
  if (icon === 'hci-catalyst-logo') {
    return (
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          backgroundColor: '#00aeff',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: iconSize * 0.5,
          ...sx,
        }}
      >
        HC
      </Box>
    );
  }

  // Handle Font Awesome style icons by mapping to Lucide equivalents
  const iconMap: { [key: string]: keyof typeof LucideIcons } = {
    'fa-cog': 'Settings',
    'fa-user': 'User',
    'fa-home': 'Home',
    'fa-chart-bar': 'BarChart',
    'fa-chart-line': 'TrendingUp',
    'fa-file': 'File',
    'fa-folder': 'Folder',
    'fa-search': 'Search',
    'fa-plus': 'Plus',
    'fa-minus': 'Minus',
    'fa-edit': 'Edit',
    'fa-trash': 'Trash2',
    'fa-save': 'Save',
    'fa-download': 'Download',
    'fa-upload': 'Upload',
    'fa-print': 'Printer',
    'fa-envelope': 'Mail',
    'fa-phone': 'Phone',
    'fa-calendar': 'Calendar',
    'fa-clock': 'Clock',
    'fa-star': 'Star',
    'fa-heart': 'Heart',
    'fa-thumbs-up': 'ThumbsUp',
    'fa-thumbs-down': 'ThumbsDown',
    'fa-check': 'Check',
    'fa-times': 'X',
    'fa-arrow-left': 'ArrowLeft',
    'fa-arrow-right': 'ArrowRight',
    'fa-arrow-up': 'ArrowUp',
    'fa-arrow-down': 'ArrowDown',
  };

  const mappedIconName = iconMap[icon] || icon;
  
  // Get the icon component from Lucide
  const IconComponent = LucideIcons[mappedIconName as keyof typeof LucideIcons] as React.ComponentType<{
    size?: number;
    color?: string;
    style?: React.CSSProperties;
  }>;

  if (!IconComponent) {
    // Fallback to a default icon if not found
    const FallbackIcon = LucideIcons.HelpCircle;
    return (
      <FallbackIcon 
        size={iconSize} 
        color={color}
        style={sx}
      />
    );
  }

  return (
    <IconComponent 
      size={iconSize} 
      color={color}
      style={sx}
    />
  );
}