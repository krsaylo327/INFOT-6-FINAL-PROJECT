import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'primary.main' }}>
      <Toolbar>
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <span style={{ color: 'secondary.main' }}>Click</span>&Care
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Navigation links for larger screens */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Tooltip title="Browse our healthcare services">
              <Button
                color="primary"
                component={RouterLink}
                to="/services"
                sx={{ fontWeight: 500 }}
              >
                Our Services
              </Button>
            </Tooltip>
            {user && user.role === 'admin' && (
              <>
                <Tooltip title="Admin Dashboard">
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                    sx={{ fontWeight: 600 }}
                  >
                    Admin
                  </Button>
                </Tooltip>
                <Tooltip title="Confirmed Bookings Overview">
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => navigate('/admin/confirmed')}
                    sx={{ fontWeight: 600 }}
                  >
                    Confirmed Bookings
                  </Button>
                </Tooltip>
              </>
            )}
            {user ? (
              <>
                <Tooltip title="Schedule your next appointment">
                  <Button
                    color="primary"
                    component={RouterLink}
                    to="/book-appointment"
                    variant="contained"
                    sx={{ 
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </Tooltip>
                <Tooltip title="View your appointments and profile">
                  <Button
                    color="primary"
                    component={RouterLink}
                    to="/dashboard"
                    sx={{ fontWeight: 500 }}
                  >
                    My Dashboard
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Sign in to your account">
                  <Button 
                    color="primary" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ fontWeight: 500 }}
                  >
                    Login
                  </Button>
                </Tooltip>
                <Tooltip title="Create a new account">
                  <Button 
                    color="primary" 
                    component={RouterLink} 
                    to="/register"
                    variant="contained"
                    sx={{ 
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                  >
                    Register
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>

          {/* Account Icon (visible on all screen sizes) */}
          {user && (
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                aria-label="account settings"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="primary"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          )}

          {/* Hamburger Icon (visible on xs screens) */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
          </Box>

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
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/appointments'); }}>
              My Appointments
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <MenuItem onClick={() => { toggleDrawer(false)(null as any); navigate('/services'); }}>
            Our Services
          </MenuItem>
          {user && user.role === 'admin' && (
            <>
              <MenuItem onClick={() => { toggleDrawer(false)(null as any); navigate('/admin'); }}>
                Admin Dashboard
              </MenuItem>
              <MenuItem onClick={() => { toggleDrawer(false)(null as any); navigate('/admin/confirmed'); }}>
                Confirmed Bookings
              </MenuItem>
            </>
          )}
          {user ? (
            <>
              <MenuItem onClick={() => { toggleDrawer(false)(null as any); navigate('/book-appointment'); }}>
                Book Now
              </MenuItem>
              <MenuItem onClick={() => { toggleDrawer(false)(null as any); navigate('/dashboard'); }}>
                My Dashboard
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={() => { toggleDrawer(false)(null as any); navigate('/login'); }}>
                Login
              </MenuItem>
              <MenuItem onClick={() => { toggleDrawer(false)(null as any); navigate('/register'); }}>
                Register
              </MenuItem>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 