import { Box, Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { getTopHeadlines } from '../services/newsApi';

function HeroSection() {
  const [heroNews, setHeroNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroNews = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching hero news...');
        
        const articles = await getTopHeadlines();
        console.log('Received articles:', articles);
        
        if (!articles || articles.length === 0) {
          console.log('No articles received from API');
          setError('No featured news available at the moment. Please try again later.');
          return;
        }
        
        // Validate and clean articles data
        const validArticles = articles
          .filter(article => {
            const isValid = article && article.title && article.url;
            if (!isValid) {
              console.log('Invalid article:', article);
            }
            return isValid;
          })
          .map(article => ({
            ...article,
            title: article.title?.trim(),
            description: (article.description || article.content || '').trim(),
            url: article.url,
            urlToImage: article.urlToImage || null,
            publishedAt: article.publishedAt
          }));

        console.log('Valid articles:', validArticles);

        if (validArticles.length > 0) {
          console.log('Setting hero news:', validArticles[0]);
          setHeroNews(validArticles[0]);
        } else {
          console.log('No valid articles found after filtering');
          setError('No featured news available at the moment. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching hero news:', err);
        setError(err.message || 'Failed to load featured news');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroNews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Error loading hero news: {error}</Alert>
      </Box>
    );
  }

  if (!heroNews) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">No featured news available at the moment.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '70vh',
        minHeight: '500px',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {heroNews.urlToImage && (
        <Box
          component="img"
          src={heroNews.urlToImage}
          alt={heroNews.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.7,
          }}
        />
      )}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 700,
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {heroNews.title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            maxWidth: '800px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {heroNews.description}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => window.open(heroNews.url, '_blank')}
          sx={{
            backgroundColor: '#6366F1',
            '&:hover': {
              backgroundColor: '#4F46E5',
            },
            alignSelf: 'flex-start',
          }}
        >
          Read More
        </Button>
      </Container>
    </Box>
  );
}

export default HeroSection; 