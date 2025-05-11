import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip, IconButton, CircularProgress, Alert, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { getNewsByCategory, getTopHeadlines } from '../services/newsApi';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MovieIcon from '@mui/icons-material/Movie';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ScienceIcon from '@mui/icons-material/Science';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ComputerIcon from '@mui/icons-material/Computer';
import TextToSpeech from './TextToSpeech';

// Updated categories to match NewsData.io's supported categories
const categories = [
  {
    title: "Business",
    description: "Latest Indian business news, market updates, and financial insights.",
    category: "business",
    icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
    color: "#4CAF50"
  },
  {
    title: "Entertainment",
    description: "Indian entertainment news, Bollywood updates, and cultural events.",
    category: "entertainment",
    icon: <MovieIcon sx={{ fontSize: 32 }} />,
    color: "#9C27B0"
  },
  {
    title: "Health",
    description: "Indian healthcare news, medical breakthroughs, and wellness updates.",
    category: "health",
    icon: <HealthAndSafetyIcon sx={{ fontSize: 32 }} />,
    color: "#F44336"
  },
  {
    title: "Science",
    description: "Indian scientific discoveries, research breakthroughs, and innovations.",
    category: "science",
    icon: <ScienceIcon sx={{ fontSize: 32 }} />,
    color: "#2196F3"
  },
  {
    title: "Sports",
    description: "Indian sports highlights, cricket updates, and athlete news.",
    category: "sports",
    icon: <SportsSoccerIcon sx={{ fontSize: 32 }} />,
    color: "#FF9800"
  },
  {
    title: "Technology",
    description: "Indian tech trends, startup news, and digital transformation updates.",
    category: "technology",
    icon: <ComputerIcon sx={{ fontSize: 32 }} />,
    color: "#00BCD4"
  }
];

function CategoryGrid({ showFeatured = true, showCategories = true }) {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState({
    featured: false,
    categories: false
  });
  const [error, setError] = useState({
    featured: null,
    categories: null
  });

  // Fetch top headlines
  useEffect(() => {
    let isMounted = true;

    const fetchTopHeadlines = async () => {
      if (!showFeatured) return;

      try {
        setLoading(prev => ({ ...prev, featured: true }));
        setError(prev => ({ ...prev, featured: null }));
        console.log('Fetching top headlines...');
        const articles = await getTopHeadlines();
        
        if (!isMounted) return;

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
          .slice(0, 4);

        console.log('Top headlines fetched successfully:', validArticles.length);
        setFeaturedArticles(validArticles);
      } catch (err) {
        console.error('Error in fetchTopHeadlines:', err);
        if (isMounted) {
          setError(prev => ({ 
            ...prev, 
            featured: `Failed to load featured articles: ${err.message}` 
          }));
          setFeaturedArticles([]);
        }
      } finally {
        if (isMounted) {
          setLoading(prev => ({ ...prev, featured: false }));
        }
      }
    };

    fetchTopHeadlines();

    return () => {
      isMounted = false;
    };
  }, [showFeatured]);

  // Fetch category news
  useEffect(() => {
    let isMounted = true;

    const fetchCategoryNews = async () => {
      if (!showCategories) return;

      try {
        setLoading(prev => ({ ...prev, categories: true }));
        setError(prev => ({ ...prev, categories: null }));
        
        const categoryResults = {};
        console.log('Starting to fetch category news...');
        
        // Fetch all categories in parallel
        const categoryPromises = categories.map(async (category) => {
          try {
            console.log(`Fetching news for category: ${category.category}`);
            const articles = await getNewsByCategory(category.category);
            
            if (!isMounted) return;

            // Validate articles
            const validArticles = articles
              .filter(article => 
                article && 
                article.title && 
                (article.link || article.url)
              )
              .map(article => ({
                ...article,
                title: article.title.trim(),
                description: (article.description || article.content || '').trim(),
                url: article.link || article.url,
                urlToImage: article.image_url || article.urlToImage,
                publishedAt: article.pubDate || article.publishedAt
              }));
            
            console.log(`Found ${validArticles.length} valid articles for ${category.category}`);
            if (validArticles.length > 0) {
              categoryResults[category.category] = validArticles;
            }
          } catch (error) {
            console.error(`Error fetching ${category.category} news:`, error);
            // Continue with other categories even if one fails
          }
        });

        await Promise.all(categoryPromises);
        
        if (isMounted) {
          console.log('Category news fetch completed:', Object.keys(categoryResults).length, 'categories');
          setCategoryNews(categoryResults);
        }
      } catch (error) {
        console.error('Error fetching category news:', error);
        if (isMounted) {
          setError(prev => ({ 
            ...prev, 
            categories: `Failed to load category news: ${error.message}` 
          }));
        }
      } finally {
        if (isMounted) {
          setLoading(prev => ({ ...prev, categories: false }));
        }
      }
    };

    fetchCategoryNews();

    return () => {
      isMounted = false;
    };
  }, [showCategories]);

  const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress sx={{ color: '#6366F1' }} />
    </Box>
  );

  const ErrorMessage = ({ message }) => (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );

  const NoArticlesMessage = () => (
    <Alert severity="info" sx={{ mb: 2 }}>
      No articles available for this category at the moment. Please try again later.
    </Alert>
  );

  // Update the article rendering to handle missing data
  const renderArticle = (article, category) => {
    if (!article || !article.title || !article.url) return null;

    const handleArticleClick = () => {
      try {
        window.open(article.url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error opening article:', error);
      }
    };

    const formattedDate = article.publishedAt 
      ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'Date not available';

    return (
      <Box
        key={article.url}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: `${category.color}15`,
            '& .article-title': {
              color: category.color
            }
          }
        }}
        onClick={handleArticleClick}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            className="article-title"
            variant="body2"
            sx={{
              color: '#F8FAFC',
              fontWeight: 500,
              transition: 'color 0.2s ease-in-out',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {article.title}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mt: 0.5
          }}>
            <AccessTimeIcon sx={{ 
              fontSize: 14, 
              color: '#94A3B8' 
            }} />
            <Typography 
              variant="caption" 
              sx={{ color: '#94A3B8' }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={e => e.stopPropagation()}>
          <TextToSpeech text={article.description || article.title} title={article.title} />
        </Box>
        <IconButton 
          className="category-arrow"
          sx={{ 
            color: '#6366F1',
            transition: 'all 0.2s ease-in-out',
            p: 0.5
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    );
  };

  // Add error boundary for article rendering
  const renderArticleWithErrorBoundary = (article, category) => {
    try {
      return renderArticle(article, category);
    } catch (error) {
      console.error('Error rendering article:', error);
      return null;
    }
  };

  // Update the category news rendering to use error boundary
  const renderCategoryNews = (category) => {
    const articles = categoryNews[category.category] || [];
    if (!articles.length) return <NoArticlesMessage />;
    
    return articles.map((article, i) => renderArticleWithErrorBoundary(article, category));
  };

  return (
    <Box sx={{ 
      py: 6, 
      backgroundColor: '#000000',
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        {/* Main Categories */}
        {showCategories && (
          <>
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
              Indian News Categories
            </Typography>

            {error.categories && <ErrorMessage message={error.categories} />}
            
            {loading.categories ? (
              <LoadingSpinner />
            ) : (
              <Grid container spacing={4} sx={{ mb: showFeatured ? 8 : 0 }}>
                {categories.map((category, index) => (
                  <Grid 
                    key={index}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <Paper 
                      elevation={0}
                      sx={{ 
                        height: '100%',
                        backgroundColor: '#1A1A1A',
                        borderRadius: 4,
                        transition: 'all 0.3s ease-in-out',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 30px ${category.color}20`,
                          borderColor: category.color,
                          '& .category-icon': {
                            transform: 'scale(1.1)',
                            color: category.color,
                          },
                          '& .category-arrow': {
                            transform: 'translateX(4px)',
                            color: category.color,
                          }
                        },
                      }}
                    >
                      <Box sx={{ 
                        p: 4,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 3,
                          gap: 2
                        }}>
                          <Box 
                            className="category-icon"
                            sx={{ 
                              color: '#FFFFFF',
                              transition: 'all 0.3s ease-in-out',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              backgroundColor: `${category.color}20`,
                            }}
                          >
                            {category.icon}
                          </Box>
                          <Typography 
                            variant="h5" 
                            component="h2"
                            sx={{ 
                              color: '#FFFFFF',
                              fontWeight: 600,
                            }}
                          >
                            {category.title}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: '#94A3B8',
                            lineHeight: 1.6,
                            mb: 3,
                            flexGrow: 1
                          }}
                        >
                          {category.description}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 2,
                        }}>
                          {renderCategoryNews(category)}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Featured Articles */}
        {showFeatured && (
          <>
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
              Featured Indian News
            </Typography>

            {error.featured && <ErrorMessage message={error.featured} />}

            {loading.featured ? (
              <LoadingSpinner />
            ) : featuredArticles.length > 0 ? (
              <Grid container spacing={4}>
                {featuredArticles.map((article, index) => (
                  <Grid 
                    key={index}
                    item
                    xs={12}
                    md={6}
                  >
                    <Paper 
                      elevation={0}
                      sx={{ 
                        height: '100%',
                        backgroundColor: '#1A1A1A',
                        borderRadius: 4,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 30px rgba(99, 102, 241, 0.2)',
                          borderColor: '#6366F1',
                          '& .article-image': {
                            transform: 'scale(1.05)',
                          }
                        }
                      }}
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      {article.urlToImage && (
                        <Box sx={{ 
                          position: 'relative',
                          height: 280,
                          overflow: 'hidden'
                        }}>
                          <CardMedia
                            className="article-image"
                            component="img"
                            height="280"
                            image={article.urlToImage}
                            alt={article.title}
                            sx={{ 
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease-in-out'
                            }}
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
                          }} />
                        </Box>
                      )}
                      <Box sx={{ p: 4 }}>
                        <Typography 
                          variant="h5" 
                          component="h3"
                          sx={{ 
                            color: '#FFFFFF',
                            fontWeight: 600,
                            mb: 2,
                            lineHeight: 1.4
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: '#94A3B8',
                            lineHeight: 1.6,
                            mb: 3
                          }}
                        >
                          {article.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <TextToSpeech text={article.description || article.title} title={article.title} />
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: '#6366F1'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Read More
                          </Typography>
                          <ArrowForwardIcon sx={{ fontSize: 20 }} />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <NoArticlesMessage />
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default CategoryGrid;