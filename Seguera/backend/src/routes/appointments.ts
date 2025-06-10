import express from 'express';
import { Appointment } from '../models/Appointment';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Valid appointment statuses
const VALID_STATUSES = ['pending', 'confirmed', 'cancelled'];

// Create new appointment
router.post('/', auth, async (req: any, res) => {
  try {
    const { date, startTime, endTime, service, notes } = req.body;

    // Validate required fields
    if (!date || !startTime || !endTime || !service) {
      return res.status(400).json({ 
        error: 'Missing required fields: date, startTime, endTime, and service are required' 
      });
    }

    // Validate date is not in the past
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ error: 'Cannot book appointments in the past' });
    }

    const appointment = new Appointment({
      date,
      startTime,
      endTime,
      service,
      notes,
      user: req.user._id,
      status: 'pending'
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get user's appointments
router.get('/my-appointments', auth, async (req: any, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .sort({ date: 1, startTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get all appointments (admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .sort({ date: 1, startTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all appointments' });
  }
});

// Get all confirmed appointments (admin only)
router.get('/confirmed', adminAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'confirmed' })
      .populate('user', 'name email')
      .sort({ date: 1, startTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch confirmed appointments' });
  }
});

// Update appointment status (user can only update their own appointments)
router.patch('/:id/status', auth, async (req: any, res) => {
  try {
    const { status } = req.body;
    console.log('Updating status:', { appointmentId: req.params.id, newStatus: status });

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!appointment) {
      console.log('Appointment not found:', { appointmentId: req.params.id, userId: req.user._id });
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log('Current appointment:', appointment);
    appointment.status = status;
    await appointment.save();
    console.log('Updated appointment:', appointment);
    
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ 
      error: 'Failed to update appointment status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Admin route to update any appointment
router.patch('/:id/admin', adminAuth, async (req: any, res) => {
  try {
    const { status, date, startTime, endTime, service, notes } = req.body;
    console.log('Admin updating appointment:', { id: req.params.id, status, date, startTime, endTime, service, notes });

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      console.log('Appointment not found:', req.params.id);
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update only provided fields
    if (status) appointment.status = status;
    if (date) appointment.date = date;
    if (startTime) appointment.startTime = startTime;
    if (endTime) appointment.endTime = endTime;
    if (service) appointment.service = service;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();
    console.log('Updated appointment:', appointment);
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      error: 'Failed to update appointment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete appointment
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Admin route to delete any appointment
router.delete('/:id/admin', adminAuth, async (req: any, res) => {
  try {
    console.log('Admin deleting appointment:', req.params.id);
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      console.log('Appointment not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log('Appointment deleted successfully:', req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      error: 'Failed to delete appointment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 