import { usePathname } from 'next/navigation';
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { signOut } from 'next-auth/react';

const handleLogout = () => {
  signOut({ redirect: false });
};
 
export default function NavBar() {
  const pathname = usePathname();
  const links = [
    { path: '/', name: 'Home' },
    { path: '/profile', name: 'Profile' },
    { path: '/events', name: 'Events' },
    { path: '/equipment', name: 'Equipment' },
    { path: '/forum', name: 'Forum' }
  ];

  return (
    <Box className="navbar-container">
      {links.map((l) => {
        const isActive = l.path === pathname;
        return (
          <Link
            component={Link}
            href={l.path}
            className={`navbar-button ${isActive ? 'active' : ''}`}
            key={l.path}
          >
            {l.name}
          </Link>
        );
      })}
      <Button onClick={handleLogout} className="navbar-button">
        Logout
      </Button>
    </Box>
  );
}
