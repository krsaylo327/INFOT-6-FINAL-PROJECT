import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SpaIcon from '@mui/icons-material/Spa';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 3,
            }}
          >
            Welcome to Click&Care
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 4,
            }}
          >
            Your One-Stop Booking Hub for Health & Wellness!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            At Click&Care, we make it effortless to book appointments for all your self-care and medical needs. 
            Whether you're scheduling a haircut, a dental checkup, or a relaxing massage, our platform connects 
            you with trusted professionals in just a few clicks.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/services')}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 2,
            }}
          >
            Book Now
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              component="h3"
              gutterBottom
              sx={{
                textAlign: 'center',
                fontWeight: 600,
                color: 'primary.main',
                mb: 4,
              }}
            >
              ✨ Why Choose Us?
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Fast & Easy Booking
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No more phone tag! Book your appointments in seconds with our intuitive platform.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <SpaIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Wide Range of Services
              </Typography>
              <Typography variant="body1" color="text.secondary">
                From clinics to salons, we've got you covered with a comprehensive selection of services.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Reliable Providers
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quality care, every time. We work with trusted professionals to ensure the best service.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              mb: 3,
              fontWeight: 500,
            }}
          >
            Ready to simplify your routine?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/services')}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 2,
            }}
          >
            Book now and care for yourself with a click!
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 