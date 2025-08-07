import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { healthCatalystTheme } from '@/theme/healthcare-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={healthCatalystTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}