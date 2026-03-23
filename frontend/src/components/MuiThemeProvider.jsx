import React from 'react';
import { ThemeProvider as MuiProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme, darkTheme } from '../assets/styles/theme';
import { useTheme } from '../context/ThemeContext';

const MuiThemeProvider = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <MuiProvider theme={isDark ? darkTheme : theme}>
      <CssBaseline />
      {children}
    </MuiProvider>
  );
};

export default MuiThemeProvider;
