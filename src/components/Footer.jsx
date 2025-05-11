import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        pt: 6,
        pb: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'primary.main',
              }}
            >
              The Verified Vision
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We are committed to delivering accurate, unbiased, and timely news from around the world.
              Our team of experienced journalists and fact-checkers ensures the highest standards of reporting.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">Top Stories</Link>
              <Link href="#" color="text.secondary" underline="hover">World</Link>
              <Link href="#" color="text.secondary" underline="hover">Business</Link>
              <Link href="#" color="text.secondary" underline="hover">Technology</Link>
              <Link href="#" color="text.secondary" underline="hover">Entertainment</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">About Us</Link>
              <Link href="#" color="text.secondary" underline="hover">Careers</Link>
              <Link href="#" color="text.secondary" underline="hover">Contact</Link>
              <Link href="#" color="text.secondary" underline="hover">Press</Link>
              <Link href="#" color="text.secondary" underline="hover">Partners</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">Blog</Link>
              <Link href="#" color="text.secondary" underline="hover">Newsletter</Link>
              <Link href="#" color="text.secondary" underline="hover">Events</Link>
              <Link href="#" color="text.secondary" underline="hover">Help Center</Link>
              <Link href="#" color="text.secondary" underline="hover">Privacy Policy</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">Terms of Service</Link>
              <Link href="#" color="text.secondary" underline="hover">Privacy Policy</Link>
              <Link href="#" color="text.secondary" underline="hover">Cookie Policy</Link>
              <Link href="#" color="text.secondary" underline="hover">Accessibility</Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} The Verified Vision. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Terms
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Privacy
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 