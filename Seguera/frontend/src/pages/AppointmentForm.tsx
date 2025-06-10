import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const services = [
  'General Checkup',
  'Dental Cleaning',
  'Eye Examination',
  'Physical Therapy',
  'Massage Therapy',
  'Haircut',
  'Manicure',
  'Pedicure',
];

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    service: '',
    date: null as Date | null,
    startTime: null as Date | null,
    endTime: null as Date | null,
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const appointment = response.data;
      setFormData({
        service: appointment.service,
        date: new Date(appointment.date),
        startTime: new Date(`2000-01-01T${appointment.startTime}`),
        endTime: new Date(`2000-01-01T${appointment.endTime}`),
        notes: appointment.notes || '',
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Error fetching appointment details');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    const appointmentData = {
      service: formData.service,
      date: formData.date.toISOString().split('T')[0],
      startTime: formData.startTime.toTimeString().slice(0, 5),
      endTime: formData.endTime.toTimeString().slice(0, 5),
      notes: formData.notes,
    };

    try {
      if (id) {
        await axios.patch(
          `http://localhost:5000/api/appointments/${id}`,
          appointmentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/appointments',
          appointmentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Edit Appointment' : 'Book Appointment'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            margin="normal"
          >
            {services.map((service) => (
              <MenuItem key={service} value={service}>
                {service}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(newValue) => setFormData({ ...formData, date: newValue })}
            sx={{ width: '100%', mt: 2 }}
          />

          <TimePicker
            label="Start Time"
            value={formData.startTime}
            onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
            sx={{ width: '100%', mt: 2 }}
          />

          <TimePicker
            label="End Time"
            value={formData.endTime}
            onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
            sx={{ width: '100%', mt: 2 }}
          />

          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {id ? 'Update Appointment' : 'Book Appointment'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AppointmentForm; 