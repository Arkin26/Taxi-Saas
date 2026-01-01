

import mongoose from 'mongoose';

const cabSchema = new mongoose.Schema({
  cabId: {
    type: String,
    required: true,
    unique: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available',
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'CNG', 'electric', 'hybrid'], // Added 'cng' here
    required: true,
  },
}, { timestamps: true });

// Prevent model overwrite error in dev environments
const Cab = mongoose.models.Cab || mongoose.model('Cab', cabSchema);

export default Cab;