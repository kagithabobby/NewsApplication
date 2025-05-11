import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Link
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ article }) => {
  if (!article) return null;

  // Handle both NewsData.io and legacy format
  const {
    title,
    description,
    link,
    url,
    image_url,
    urlToImage,
    pubDate,
    publishedAt,
    source,
    category
  } = article;

  // Use the appropriate URL and image fields
  const articleUrl = link || url;
  const imageUrl = image_url || urlToImage;
  const publishDate = pubDate || publishedAt;

  const formattedDate = publishDate 
    ? formatDistanceToNow(new Date(publishDate), { addSuffix: true })
    : 'Date not available';

  const sourceName = source?.name || 'Unknown Source';

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <Link 
        href={articleUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        sx={{ textDecoration: 'none' }}
      >
        <CardMedia
          component="img"
          height="200"
          image={imageUrl || 'https://via.placeholder.com/400x200?text=No+Image+Available'}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={sourceName} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            {category && (
              <Chip 
                label={category} 
                size="small" 
                color="secondary" 
                variant="outlined"
              />
            )}
          </Box>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              lineHeight: 1.4,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 2
            }}
          >
            {description}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {formattedDate}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

export default NewsCard;