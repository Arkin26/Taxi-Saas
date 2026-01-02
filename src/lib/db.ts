import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGO_URI is not defined');
}

/**
 * Global cache to prevent multiple connections in Vercel
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* ===================== SCHEMAS ===================== */

const inviteSchema = new mongoose.Schema({
  email: String,
  token: String,
  companyTokenId: String,
  used: Boolean,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  companyTokenId: String,
  password: String,
});

const cabSchema = new mongoose.Schema({
  cabId: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true, unique: true },
  model: String,
  brand: String,
  capacity: Number,
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
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

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  fullName: String,
  phoneNumber: String,
  licenseNumber: String,
  licenseExpiry: Date,
  aadharNumber: String,
  aadharImage: String,
  licenseImage: String,
  address: String,
  availabilityStatus: {
    type: String,
    enum: ['free', 'busy'],
    default: 'free',
  },
  profilePhoto: String,
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  bookingType: String,
  bookingMode: String,
  driverId: String,
  cabId: String,
  customerName: String,
  customerPhone: String,
  customerNumber: String,
  pickupLocation: String,
  dropLocation: String,
  bookingDate: String,
  bookingTime: String,
  scheduledDateTime: Date,
  duration: Number,
  totalAmount: String,
  advancePayment: String,
  duePayment: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },
  bookingStatus: {
    type: String,
    enum: ['UPCOMING', 'CONFIRMED', 'ONGOING', 'COMPLETED'],
    default: 'UPCOMING',
  },
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  bookingId: String,
  customerName: String,
  amountPaid: Number,
  remainingAmount: Number,
  totalBookingAmount: Number,
  paymentMethod: String,
  paymentSequence: Number,
  receivedBy: String,
  paymentType: String,
}, { timestamps: true });

/* ===================== MODELS ===================== */

export const Invite = mongoose.models.Invite || mongoose.model('Invite', inviteSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Cab = mongoose.models.Cab || mongoose.model('Cab', cabSchema);
export const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
