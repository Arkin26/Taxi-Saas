import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    licenseExpiry: {
      type: Date,
      required: true,
    },

    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },

    aadharImage: {
      type: String,
      required: true,
    },

    licenseImage: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    availabilityStatus: {
      type: String,
      enum: ['free', 'busy'],
      default: 'free', // Default status
    },

    profilePhoto: {
      type: String,
      default: '', // Optional: set default to empty string
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Driver || mongoose.model('Driver', driverSchema);
