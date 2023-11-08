'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NavBar from './NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import './globals.css';

const theme = createTheme({});

export default function RootLayout({ children, title }) {
  const { data: session, status }  = useSession();
  const isLoggedIn = status === 'authenticated';
  const isLoginPage = usePathname() === '/login';
  console.log("isLoginPage: ", isLoginPage);
  console.log("Pathname: ", usePathname());

  if (isLoginPage) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box component="main" sx={{ p: 0 }}>
          {children}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar className="fullNav" position="static">
          <Container maxWidth="xl">
          
            <Toolbar disableGutters>
              
              <Typography variant="h5" component="a" href="/" className="title-text">
              Stronger<br />Together
              </Typography>
              <Typography variant="h6" component="a" href="/" className="slogan-text">
              Lift, Laugh, Love
              </Typography>

              <NavBar />
      
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Box component="main" sx={{ p: 3 }} className="main-content">
        {children}
      </Box>
    </ThemeProvider>
  );
}