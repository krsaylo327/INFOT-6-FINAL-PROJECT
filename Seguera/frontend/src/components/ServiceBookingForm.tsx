import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

const services: Service[] = [
  {
    id: '1',
    name: 'Haircut & Styling',
    description: 'Professional haircut and styling service',
    price: 2520,
    duration: 60,
    category: 'Hair',
  },
  {
    id: '2',
    name: 'Full Body Massage',
    description: 'Relaxing full body massage therapy',
    price: 4480,
    duration: 90,
    category: 'Massage',
  },
  {
    id: '3',
    name: 'Facial Treatment',
    description: 'Rejuvenating facial treatment',
    price: 3640,
    duration: 45,
    category: 'Skincare',
  },
];

const steps = ['Select Service', 'Choose Date & Time', 'Personal Details', 'Confirmation'];

const ServiceBookingForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    // Get service ID from URL
    const params = new URLSearchParams(location.search);
    const serviceId = params.get('service');
    
    if (serviceId) {
      setSelectedService(serviceId);
      // If service is pre-selected, start from date selection step
      setActiveStep(1);
    }
  }, [location]);

  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      setSnackbar({
        open: true,
        message: 'Please select a service to continue',
        severity: 'error',
      });
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    const selectedServiceDetails = services.find(s => s.id === selectedService);
    if (!selectedServiceDetails) {
      setSnackbar({
        open: true,
        message: 'Invalid service selection',
        severity: 'error',
      });
      return;
    }

    // Calculate end time based on service duration
    const endTime = new Date(selectedTime);
    endTime.setMinutes(endTime.getMinutes() + selectedServiceDetails.duration);

    const appointmentData = {
      service: selectedServiceDetails.name,
      date: selectedDate.toISOString().split('T')[0],
      startTime: selectedTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
      notes: formData.notes,
    };

    try {
      await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbar({
        open: true,
        message: 'Booking confirmed! We will send you a confirmation email shortly.',
        severity: 'success',
      });

      // Navigate to dashboard after successful booking
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to book appointment. Please try again.',
        severity: 'error',
      });
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <FormLabel>Select a Service</FormLabel>
              <RadioGroup value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                <Grid container spacing={2}>
                  {services.map((service) => (
                    <Grid item xs={12} sm={6} md={4} key={service.id}>
                      <Paper
                        key={service.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          cursor: 'pointer',
                          border: selectedService === service.id ? '2px solid #2196f3' : '1px solid #e0e0e0',
                          '&:hover': {
                            borderColor: '#2196f3',
                          },
                        }}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <FormControlLabel
                          value={service.id}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="h6">{service.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.description}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="h6" color="primary">
                                  ₱{service.price.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {service.duration} min
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Select Time"
                  value={selectedTime}
                  onChange={(newValue) => setSelectedTime(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        const selectedServiceDetails = services.find(s => s.id === selectedService);
        return (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Booking Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Service: {selectedServiceDetails?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedServiceDetails?.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Date: {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
                  </Typography>
                  <Typography variant="subtitle1">
                    Time: {selectedTime ? format(selectedTime, 'p') : 'Not selected'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Customer Details
                  </Typography>
                  <Typography variant="body2">
                    Name: {formData.name}
                  </Typography>
                  <Typography variant="body2">
                    Email: {formData.email}
                  </Typography>
                  <Typography variant="body2">
                    Phone: {formData.phone}
                  </Typography>
                </Grid>
                {formData.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Additional Notes
                    </Typography>
                    <Typography variant="body2">
                      {formData.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Book Your Service
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              color="primary"
            >
              {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default ServiceBookingForm; 