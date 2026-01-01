

import mongoose, { Document, Schema } from 'mongoose';

export interface BookingDocument extends Document {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerNumber: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  bookingTime: string;
  duration?: string;
  totalAmount: string;
  advancePayment: string;
  duePayment: string;
  bookingType: 'LOCATION' | 'DURATION';
  driverId: string;
  cabId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  
  // New fields for upcoming bookings
  bookingMode: 'SCHEDULE' | 'IMMEDIATE';
  scheduledDateTime: Date;
  bookingStatus: 'UPCOMING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isConfirmed: boolean;
  alertSent: boolean;
  confirmationTime?: Date;
}

const bookingSchema = new Schema<BookingDocument>({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerNumber: String,
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true
  },
  bookingDate: {
    type: String,
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  duration: String,
  totalAmount: {
    type: String,
    required: true
  },
  advancePayment: String,
  duePayment: String,
  bookingType: {
    type: String,
    enum: ['LOCATION', 'DURATION'],
    required: true
  },
  driverId: {
    type: String,
    required: true
  },
  cabId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

  // New fields
  bookingMode: {
    type: String,
    enum: ['SCHEDULE', 'IMMEDIATE'],
    required: true
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['UPCOMING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: function(this: BookingDocument) {
      return this.bookingMode === 'IMMEDIATE' ? 'ONGOING' : 'UPCOMING';
    }
  },
  isConfirmed: {
    type: Boolean,
    default: function(this: BookingDocument) {
      return this.bookingMode === 'IMMEDIATE';
    }
  },
  alertSent: {
    type: Boolean,
    default: false
  },
  confirmationTime: {
    type: Date
  }
}, {
  timestamps: true // This will automatically handle createdAt and updatedAt
});

// Create the model
const Booking = mongoose.models.Booking || mongoose.model<BookingDocument>('Booking', bookingSchema);

export default Booking;
