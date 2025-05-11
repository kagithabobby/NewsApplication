import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Business', path: '/category/business' },
  { name: 'Entertainment', path: '/category/entertainment' },
  { name: 'Health', path: '/category/health' },
  { name: 'Science', path: '/category/science' },
  { name: 'Sports', path: '/category/sports' },
  { name: 'Technology', path: '/category/technology' }
];

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoryClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {categories.map((category) => (
          <ListItem 
            button 
            key={category.name}
            onClick={() => handleCategoryClick(category.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                '& .MuiListItemText-primary': {
                  color: 'primary.main',
                }
              }
            }}
          >
            <ListItemText 
              primary={category.name}
              primaryTypographyProps={{
                fontWeight: 500,
                transition: 'color 0.2s ease-in-out'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              color: 'text.primary',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.2s ease-in-out'
            }}
            onClick={() => navigate('/')}
          >
            NewsApp
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  color="inherit"
                  onClick={() => handleCategoryClick(category.path)}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navigation; 