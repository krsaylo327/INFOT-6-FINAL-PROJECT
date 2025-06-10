import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Appointment {
  _id: string;
  user: any;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

const AdminDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteAptId, setDeleteAptId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error',
      });
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch appointments',
        severity: 'error',
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/create-admin',
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: 'Admin user created successfully',
        severity: 'success',
      });
      setOpenDialog(false);
      fetchUsers();
      setNewUser({ name: '', email: '', password: '', role: 'admin' });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to create admin user',
        severity: 'error',
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (user?.id === id) {
      setSnackbar({ open: true, message: "You can't delete yourself.", severity: 'error' });
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      fetchUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: 'Appointment deleted', severity: 'success' });
      fetchAppointments();
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to delete appointment', 
        severity: 'error' 
      });
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      console.log('Updating appointment status:', { id, status });
      const response = await axios.patch(
        `http://localhost:5000/api/appointments/${id}/admin`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Status update response:', response.data);
      setSnackbar({ open: true, message: `Status updated to ${status}`, severity: 'success' });
      fetchAppointments();
    } catch (error: any) {
      console.error('Error updating status:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to update status', 
        severity: 'error' 
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create New Admin
        </Button>
      </Box>

      {/* Users Table */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Users</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((userRow) => (
                <TableRow key={userRow.id}>
                  <TableCell>{userRow.name}</TableCell>
                  <TableCell>{userRow.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={userRow.role}
                      color={userRow.role === 'admin' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteUserId(userRow.id)}
                      disabled={user?.id === userRow.id}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Appointments Table */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Appointments</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt._id}>
                  <TableCell>{apt.user?.name || 'N/A'}</TableCell>
                  <TableCell>{apt.service}</TableCell>
                  <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                  <TableCell>{apt.startTime} - {apt.endTime}</TableCell>
                  <TableCell>
                    <Select
                      value={apt.status}
                      onChange={(e) => handleStatusChange(apt._id, e.target.value as any)}
                      size="small"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{apt.notes}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => setDeleteAptId(apt._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete User Dialog */}
      <Dialog open={!!deleteUserId} onClose={() => setDeleteUserId(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)}>Cancel</Button>
          <Button color="error" onClick={() => { if (deleteUserId) { handleDeleteUser(deleteUserId); setDeleteUserId(null); } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Appointment Dialog */}
      <Dialog open={!!deleteAptId} onClose={() => setDeleteAptId(null)}>
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>Are you sure you want to delete this appointment?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAptId(null)}>Cancel</Button>
          <Button color="error" onClick={() => { if (deleteAptId) { handleDeleteAppointment(deleteAptId); setDeleteAptId(null); } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Admin User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

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
  );
};

export default AdminDashboard; 