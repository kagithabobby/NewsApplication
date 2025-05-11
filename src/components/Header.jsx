import { AppBar, Toolbar, Typography, Box, Container, InputBase, IconButton, Drawer, List, ListItem, ListItemText, Button, Avatar, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchNews } from '../services/newsApi';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setUser(null);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const articles = await searchNews(searchQuery);
      setSearchResults(articles);
      setIsDrawerOpen(true);
    }
  };

  const handleArticleClick = (url) => {
    window.open(url, '_blank');
    setIsDrawerOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    handleUserMenuClose();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Articles', path: '/articles' },
  ];

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          backgroundColor: '#0A0A0A',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '1.5rem',
              }}
            >
              The Verified Vision
            </Typography>

            {/* Navigation Menu */}
            {isMobile ? (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={handleMobileMenuClose}
                >
                  {navItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={handleMobileMenuClose}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                  {!user ? (
                    <>
                      <MenuItem
                        component={Link}
                        to="/login"
                        onClick={handleMobileMenuClose}
                      >
                        Login
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/register"
                        onClick={handleMobileMenuClose}
                      >
                        Register
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  )}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                  >
                    {item.label}
                  </Button>
                ))}
                {!user ? (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/register"
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <>
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{ ml: 1 }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {user.name?.[0]?.toUpperCase() || <AccountCircle />}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                    >
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            )}

            {/* Search Bar */}
            <Box 
              component="form"
              onSubmit={handleSearch}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#1E1E1E',
                borderRadius: 1,
                px: 2,
                py: 0.5,
              }}
            >
              <InputBase
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: '#F8FAFC',
                  '& input::placeholder': {
                    color: '#94A3B8',
                    opacity: 0.7,
                  },
                }}
              />
              <IconButton type="submit" sx={{ color: '#94A3B8', p: 1 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Search Results Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 400,
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
          }
        }}
      >
        <List sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ px: 2, py: 1, color: '#6366F1' }}>
            Search Results
          </Typography>
          {searchResults.map((article, index) => (
            <ListItem 
              key={index}
              button
              onClick={() => handleArticleClick(article.url)}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                }
              }}
            >
              <ListItemText
                primary={article.title}
                secondary={article.description}
                primaryTypographyProps={{
                  sx: { color: '#FFFFFF', fontWeight: 500 }
                }}
                secondaryTypographyProps={{
                  sx: { color: '#94A3B8' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Header; 