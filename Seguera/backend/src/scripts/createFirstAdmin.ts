import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const createFirstAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment-app');

    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('An admin user already exists');
      process.exit(0);
    }

    // Create first admin user
    const admin = new User({
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      name: 'Admin User',
      role: 'admin',
    });

    await admin.save();
    console.log('First admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Please change the password after first login');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createFirstAdmin(); 