import { createTheme } from '@mui/material/styles';

// Health Catalyst inspired color palette
const healthCatalystColors = {
  primary: {
    main: '#00aeff', // Health Catalyst primary-brand
    light: '#33beff', // Lighter variant
    dark: '#008bcc', // Darker variant 
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#6d6e70', // Health Catalyst secondary/neutral
    light: '#8a8b8c', // Lighter variant
    dark: '#57585a', // Darker variant
    contrastText: '#ffffff',
  },
  tertiary: {
    main: '#708090', // Health Catalyst slate-gray-400
    light: '#8a9199',
    dark: '#5e676f', // Health Catalyst slate-gray-500
    contrastText: '#ffffff',
  },
  background: {
    default: '#f0f3f6', // Health Catalyst slate-gray-100
    paper: '#ffffff', // Health Catalyst white
    surface: '#f0f3f6', // Health Catalyst slate-gray-100
  },
  text: {
    primary: '#333333', // Health Catalyst text/offblack
    secondary: '#6d6e70', // Health Catalyst secondary
    disabled: '#c0c5cc', // Health Catalyst slate-gray-300
  },
  divider: '#d7dde4', // Health Catalyst slate-gray-200
  success: {
    main: '#00a859', // Health Catalyst success/primary-action
    light: '#33ba73', // Lighter success
    dark: '#008547', // Darker success
  },
  warning: {
    main: '#f8961d', // Health Catalyst warning/orange
    light: '#f9a745', // Lighter warning
    dark: '#e7841a', // Darker warning
  },
  error: {
    main: '#f13c45', // Health Catalyst error/destructive-action
    light: '#f45f66', // Lighter error
    dark: '#d12e35', // Darker error
  },
  info: {
    main: '#00aeff', // Health Catalyst info (same as primary)
    light: '#33beff', // Lighter info
    dark: '#008bcc', // Darker info
  },
};

// Create the Health Catalyst inspired theme
export const healthCatalystTheme = createTheme({
  palette: {
    mode: 'light',
    primary: healthCatalystColors.primary,
    secondary: healthCatalystColors.secondary,
    background: healthCatalystColors.background,
    text: healthCatalystColors.text,
    divider: healthCatalystColors.divider,
    success: healthCatalystColors.success,
    warning: healthCatalystColors.warning,
    error: healthCatalystColors.error,
    info: healthCatalystColors.info,
  },
  typography: {
    fontFamily: '"Noto Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: healthCatalystColors.text.primary,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: healthCatalystColors.text.primary,
      marginBottom: '0.875rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: healthCatalystColors.text.primary,
      marginBottom: '0.75rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: healthCatalystColors.text.primary,
      marginBottom: '0.75rem',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: healthCatalystColors.text.primary,
      marginBottom: '0.5rem',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: healthCatalystColors.text.primary,
      marginBottom: '0.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: healthCatalystColors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      color: healthCatalystColors.text.secondary,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      color: healthCatalystColors.text.secondary,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: healthCatalystColors.background.default,
          fontFamily: '"Noto Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
          },
        },
        containedPrimary: {
          backgroundColor: healthCatalystColors.primary.main,
          '&:hover': {
            backgroundColor: healthCatalystColors.primary.dark,
          },
        },
        containedSecondary: {
          backgroundColor: healthCatalystColors.secondary.main,
          '&:hover': {
            backgroundColor: healthCatalystColors.secondary.dark,
          },
        },
        outlined: {
          borderColor: healthCatalystColors.primary.main,
          color: healthCatalystColors.primary.main,
          '&:hover': {
            borderColor: healthCatalystColors.primary.dark,
            backgroundColor: `${healthCatalystColors.primary.main}08`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          border: `1px solid ${healthCatalystColors.divider}`,
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${healthCatalystColors.divider}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: healthCatalystColors.background.surface,
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: healthCatalystColors.text.primary,
            borderBottom: `2px solid ${healthCatalystColors.divider}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${healthCatalystColors.divider}`,
          padding: '12px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: `${healthCatalystColors.primary.main}04`,
          },
          '&:nth-of-type(even)': {
            backgroundColor: healthCatalystColors.background.surface,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: `${healthCatalystColors.primary.main}20`,
          color: healthCatalystColors.primary.dark,
        },
        colorSecondary: {
          backgroundColor: `${healthCatalystColors.secondary.main}20`,
          color: healthCatalystColors.secondary.dark,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: healthCatalystColors.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: healthCatalystColors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: healthCatalystColors.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: healthCatalystColors.primary.main,
            borderWidth: 2,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 600,
          color: healthCatalystColors.text.primary,
          borderBottom: `1px solid ${healthCatalystColors.divider}`,
          paddingBottom: '16px',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: healthCatalystColors.secondary.main,
          color: healthCatalystColors.secondary.contrastText,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: healthCatalystColors.primary.main,
          boxShadow: '0 2px 4px rgba(0,160,172,0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default healthCatalystTheme;