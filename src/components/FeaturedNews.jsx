import { Box, Container, Typography, Grid, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState, useEffect } from 'react';
import { getTopHeadlines } from '../services/newsApi';
import { formatDistanceToNow } from 'date-fns';

function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const articles = await getTopHeadlines();
        
        // Validate and clean articles data
        const validArticles = articles
          .filter(article => article && article.title && (article.link || article.url))
          .map(article => ({
            ...article,
            title: article.title.trim(),
            description: (article.description || article.content || '').trim(),
            url: article.link || article.url,
            urlToImage: article.image_url || article.urlToImage,
            publishedAt: article.pubDate || article.publishedAt
          }))
          .slice(0, 3);

        setFeaturedNews(validArticles);
      } catch (err) {
        console.error('Error fetching featured news:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNews();
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
        <Alert severity="error">Error loading featured news: {error}</Alert>
      </Box>
    );
  }

  if (featuredNews.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">No featured news available at the moment.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2,
            }
          }}
        >
          Featured News
        </Typography>
        
        <Grid container spacing={3}>
          {featuredNews.map((news, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative',
                    height: 200,
                    overflow: 'hidden',
                  }}
                >
                  <Box 
                    component="img" 
                    src={news.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image+Available'} 
                    alt={news.title}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  />
                  <Chip 
                    label={news.category?.[0] || 'General'}
                    color="primary"
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      fontWeight: 600,
                      backgroundColor: 'rgba(33, 150, 243, 0.9)',
                    }}
                  />
                </Box>
                <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {news.publishedAt ? formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true }) : 'Date not available'}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      lineHeight: 1.3,
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {news.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {news.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturedNews; 