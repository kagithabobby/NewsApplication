import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import FloatingChat from './components/FloatingChat';
import { Container, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    background: {
      default: '#000000',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
        },
      },
    },
  },
});

const HomePage = () => (
  <>
    <HeroSection />
    <CategoryGrid showFeatured={true} />
    <Newsletter />
  </>
);

const CategoriesPage = () => (
  <>
    <Box sx={{ pt: 4 }}>
      <CategoryGrid showFeatured={false} />
    </Box>
    <Newsletter />
  </>
);

const ArticlesPage = () => (
  <>
    <Box sx={{ pt: 4 }}>
      <CategoryGrid showFeatured={true} showCategories={false} />
    </Box>
    <Newsletter />
  </>
);

const AIChatPage = () => (
  <Box sx={{ pt: 4, pb: 8 }}>
    <Container maxWidth="lg">
      <Typography 
        variant="h2" 
        sx={{ 
          color: '#FFFFFF',
          fontWeight: 700,
          mb: 6,
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 4,
            background: 'linear-gradient(90deg, #6366F1, #818CF8)',
            borderRadius: 2,
          }
        }}
      >
        AI News Assistant
      </Typography>
      <AIChat />
    </Container>
  </Box>
);

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          minHeight: '100vh',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
          <FloatingChat />
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
