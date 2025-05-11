import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Newsletter() {
  return (
    <Box sx={{ py: 6, background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)' }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url(https://source.unsplash.com/random/1920x1080/?newspaper)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                textAlign: 'center',
              }}
            >
              Subscribe to Our Newsletter
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                textAlign: 'center',
                maxWidth: '700px',
                mx: 'auto',
                opacity: 0.9,
              }}
            >
              Stay updated with the latest news and insights delivered directly to your inbox.
              We respect your privacy and will never share your information.
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              <TextField
                placeholder="Your email address"
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '30px',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: 1.5,
                  },
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<SendIcon />}
                sx={{ 
                  borderRadius: '30px',
                  px: 4,
                  py: 1.5,
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(255,64,129,0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(255,64,129,0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Newsletter; 