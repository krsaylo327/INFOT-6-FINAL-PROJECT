import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  useTheme,
  Skeleton,
  Alert,
  Snackbar,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const ServiceCategories: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockServices: Service[] = [
          {
            id: '1',
            name: 'Haircut & Styling',
            description: 'Professional haircut and styling service',
            price: 2520, // 45 USD to PHP
            duration: 60,
            category: 'Hair',
          },
          {
            id: '2',
            name: 'Full Body Massage',
            description: 'Relaxing full body massage therapy',
            price: 4480, // 80 USD to PHP
            duration: 90,
            category: 'Massage',
          },
          {
            id: '3',
            name: 'Facial Treatment',
            description: 'Rejuvenating facial treatment',
            price: 3640, // 65 USD to PHP
            duration: 45,
            category: 'Skincare',
          },
        ];
        setServices(mockServices);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = ['all', ...Array.from(new Set(services.map(service => service.category)))];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

  const handleBookNow = (service: Service) => {
    // Navigate to booking form with service ID
    navigate(`/book?service=${service.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ 
          fontWeight: 700,
          color: 'primary.main',
          mb: 4,
          fontSize: isMobile ? '2rem' : '2.5rem',
        }}
      >
        Our Healthcare Services
      </Typography>
      
      <Box sx={{ 
        mb: 6, 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        flexWrap: 'wrap',
        px: isMobile ? 2 : 0,
      }}>
        {categories.map((category) => (
          <Tooltip 
            key={category} 
            title={`View ${category === 'all' ? 'all' : category} services`}
          >
            <Chip
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{ 
                textTransform: 'capitalize',
                fontSize: '1rem',
                padding: '20px 10px',
                '&.MuiChip-colorPrimary': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }
              }}
            />
          </Tooltip>
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {loading ? (
          // Loading skeletons
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))
        ) : filteredServices.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              No services found in this category. Please try another category.
            </Alert>
          </Grid>
        ) : (
          filteredServices.map((service) => (
            <Grid item key={service.id} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main'
                    }}
                  >
                    {service.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 3 }}
                  >
                    {service.description}
                  </Typography>
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon color="primary" />
                      <Typography 
                        variant="h5" 
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        ₱{service.price.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon color="primary" />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          backgroundColor: 'primary.light',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px'
                        }}
                      >
                        {service.duration} min
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<BookOnlineIcon />}
                    sx={{ 
                      mt: 2,
                      py: 1.5,
                      backgroundColor: 'secondary.main',
                      '&:hover': {
                        backgroundColor: 'secondary.dark',
                      }
                    }}
                    onClick={() => handleBookNow(service)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default ServiceCategories; 