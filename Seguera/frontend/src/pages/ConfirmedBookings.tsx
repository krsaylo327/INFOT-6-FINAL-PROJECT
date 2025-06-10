import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Appointment {
  _id: string;
  user: { name: string; email: string };
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

const ConfirmedBookings: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchConfirmed = async () => {
      const res = await axios.get('http://localhost:5000/api/appointments/confirmed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    };
    fetchConfirmed();
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Confirmed Bookings Overview
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt._id}>
                  <TableCell>{apt.user?.name || 'N/A'}</TableCell>
                  <TableCell>{apt.user?.email || 'N/A'}</TableCell>
                  <TableCell>{apt.service}</TableCell>
                  <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                  <TableCell>{apt.startTime} - {apt.endTime}</TableCell>
                  <TableCell>{apt.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ConfirmedBookings; 