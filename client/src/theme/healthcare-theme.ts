import { createTheme } from '@mui/material/styles';

// Health Catalyst authentic color palette from colors.ts
const healthCatalystColors = {
  primary: {
    main: '#00aeff', // primary-brand
    light: 'rgb(51, 190, 255)',
    dark: 'rgb(0, 139, 204)',
    contrastText: '#fff',
  },
  secondary: {
    main: '#6d6e70', // secondary/neutral gray
    light: 'rgb(138, 139, 140)',
    dark: 'rgb(87, 88, 89)',
    contrastText: '#fff',
  },
  primaryAction: {
    main: '#00a859', // primary-action green
    light: 'rgb(51, 185, 122)',
    dark: 'rgb(0, 134, 71)',
    contrastText: '#fff',
  },
  primaryAlt: {
    main: '#6e53a3', // primary-alt purple
    light: 'rgb(139, 117, 181)',
    dark: 'rgb(88, 66, 130)',
    contrastText: '#fff',
  },
  background: {
    default: '#f0f3f6', // slate-gray-100
    paper: '#fff',
    surface: '#f1f1f1', // gray-100
    blockText: '#f0f3f6', // block-text-background
  },
  text: {
    primary: '#333', // offblack
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  divider: '#d7dde4', // slate-gray-200
  success: {
    main: '#00a859', // green
    light: 'rgb(51, 185, 122)',
    dark: 'rgb(0, 134, 71)',
  },
  warning: {
    main: '#f8961d', // orange
    light: 'rgb(249, 171, 74)',
    dark: 'rgb(198, 120, 23)',
  },
  error: {
    main: '#f13c45', // red
    light: 'rgb(243, 99, 106)',
    dark: 'rgb(192, 48, 55)',
  },
  info: {
    main: '#00aeff', // blue
    light: 'rgb(51, 190, 255)',
    dark: 'rgb(0, 139, 204)',
  },
  // Additional Health Catalyst colors
  charcoalBlue: {
    main: '#384655',
    light: 'rgb(95, 107, 119)',
    dark: 'rgb(44, 56, 68)',
    contrastText: '#fff',
  },
  slateBlue: {
    main: '#262f34',
    light: 'rgb(81, 88, 92)',
    dark: 'rgb(30, 37, 41)',
    contrastText: '#fff',
  },
  darkBlue: {
    main: '#006d9a',
    light: 'rgb(51, 138, 174)',
    dark: 'rgb(0, 87, 123)',
    contrastText: '#fff',
  },
  slateGray: {
    100: '#f0f3f6',
    200: '#d7dde4',
    300: '#c0c5cc',
    400: '#708090',
    500: '#5e676f',
    600: '#4f565c',
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