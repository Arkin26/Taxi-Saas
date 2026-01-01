
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

// Enhanced connection function with timeout settings
export const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000 // 45 seconds
    });
    
    console.log('Connected to MongoDB Atlas successfully');
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    
    if (error.code === 'ETIMEOUT') {
      console.log('Connection timed out - check network and DNS settings');
    }
    
    throw error; // Don't exit process in Next.js API routes
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Disable buffering for immediate error feedback
mongoose.set('bufferCommands', false);

// Invite Schema
const inviteSchema = new mongoose.Schema({
  email: String,
  token: String,
  companyTokenId: String,
  used: Boolean,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  companyTokenId: String,
  password: String,
});

// Cab Schema
const cabSchema = new mongoose.Schema({
  cabId: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  brand: { type: String, required: true },
  capacity: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  notes: { type: String },
  status: {
    type: String,
    enum: ['available', 'busy', 'maintenance'],
    default: 'available',
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: true,
  },
}, { timestamps: true });

// Driver Schema
const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseExpiry: { type: Date, required: true },
  aadharNumber: { type: String, required: true, unique: true },
  aadharImage: { type: String, required: true },
  licenseImage: { type: String, required: true },
  address: { type: String, required: true },
  availabilityStatus: {
    type: String,
    enum: ['free', 'busy'],
    default: 'free',
  },
  profilePhoto: { type: String },
}, { timestamps: true });

// Updated Booking Schema (with missing fields from conversation history)
const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  bookingType: {
    type: String,
    enum: ['LOCATION', 'DURATION'],
    required: true
  },
  bookingMode: {
    type: String,
    enum: ['SCHEDULE', 'IMMEDIATE'],
    required: true
  },
  driverId: {
    type: String,
    required: true,
    ref: 'Driver'
  },
  cabId: {
    type: String,
    required: true,
    ref: 'Cab'
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerNumber: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true
  },
  bookingDate: {
    type: String, // Changed to String to match your route expectations
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in hours
    required: false,
    default: null
  },
  totalAmount: {
    type: String, // Changed to String to match your payment route
    required: true
  },
  advancePayment: {
    type: String, // Changed to String to match your payment route
    default: '0'
  },
  duePayment: {
    type: String, // Changed to String to match your payment route
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['UPCOMING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: function(this: any) {
      return this.bookingMode === 'IMMEDIATE' ? 'ONGOING' : 'UPCOMING';
    }
  },
  isConfirmed: {
    type: Boolean,
    default: function(this: any) {
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
}, { timestamps: true });

// Updated Payment Schema (simplified to match your payment route)
const paymentSchema = new mongoose.Schema({
  paymentId: { 
    type: String, 
    unique: true, 
    required: true,
    default: () => `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`
  },
  
  bookingId: { 
    type: String, 
    required: true, 
    ref: 'Booking',
    index: true
  },
  
  customerName: {
    type: String,
    required: true
  },
  
  amountPaid: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  remainingAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  totalBookingAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  paymentMethod: { 
    type: String, 
    enum: ['CASH', 'CARD', 'UPI', 'NET_BANKING', 'OTHER'],
    required: true 
  },
  
  paymentDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  
  paymentTime: { 
    type: String, 
    required: true,
    default: () => new Date().toLocaleTimeString('en-IN', { 
      hour12: true, 
      timeZone: 'Asia/Kolkata' 
    })
  },
  
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'COMPLETED',
    required: true
  },
  
  paymentSequence: { 
    type: Number, 
    required: true,
    min: 1
  },
  
  receivedBy: { 
    type: String, 
    required: true
  },
  
  paymentType: { 
    type: String, 
    enum: ['ADVANCE', 'FINAL'], // Simplified to match your payment route
    required: true 
  },
  
  notes: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

// Middleware to update 'updatedAt' on save
paymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient queries
paymentSchema.index({ bookingId: 1, paymentSequence: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ receivedBy: 1 });

// Export models
export const Invite = mongoose.models.Invite || mongoose.model('Invite', inviteSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Cab = mongoose.models.Cab || mongoose.model('Cab', cabSchema);
export const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
