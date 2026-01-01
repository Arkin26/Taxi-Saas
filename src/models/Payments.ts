
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Unique identifier for each payment
  paymentId: { 
    type: String, 
    unique: true, 
    required: true,
    default: () => `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Your Requirements
  bookingId: { 
    type: String, 
    required: true, 
    ref: 'Booking',
    index: true // For faster queries
  },
  
  // NEW: Client information for easier querying
  clientName: { 
    type: String, 
    required: true,
    index: true // For faster client-based queries
  },
  
  clientId: { // Optional but recommended
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // If you have a Client model
    required: false
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
  
  paymentMethod: { 
    type: String, 
    enum: ['CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET', 'OTHER'],
    required: true 
  },
  
  // NEW: Transaction tracking for digital payments
  transactionId: {
    type: String,
    required: false,
    sparse: true // Allows multiple null values
  },
  
  transactionReference: {
    type: String,
    required: false
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
    enum: ['PENDING', 'PARTIAL', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'COMPLETED',
    required: true
  },
  
  // My Strong Recommendations
  paymentSequence: { 
    type: Number, 
    required: true,
    min: 1
  },
  
  receivedBy: { 
    type: String, 
    required: true // driver ID, admin ID, etc.
  },
  
  paymentType: { 
    type: String, 
    enum: ['ADVANCE', 'PARTIAL', 'FINAL', 'REFUND'],
    required: true 
  },
  
  totalBookingAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  notes: {
    type: String,
    maxlength: 500
  },
  
  // Audit fields
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Enhanced middleware to update 'updatedAt' on save and validate amounts
paymentSchema.pre('save', function(this: any, next: (err?: any) => void) {
  this.updatedAt = new Date();
  
  // Validate amounts consistency
  if (this.amountPaid + this.remainingAmount !== this.totalBookingAmount) {
    return next(new Error('Amount paid + remaining amount must equal total booking amount'));
  }
  
  // Auto-set payment status based on amounts
  if (this.remainingAmount === 0) {
    this.paymentStatus = 'COMPLETED';
  } else if (this.amountPaid > 0) {
    this.paymentStatus = 'PARTIAL';
  } else {
    this.paymentStatus = 'PENDING';
  }
  
  next();
});

// Enhanced indexes for efficient queries
paymentSchema.index({ bookingId: 1, paymentSequence: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ receivedBy: 1 });
paymentSchema.index({ clientName: 1 }); // New index for client queries
paymentSchema.index({ paymentStatus: 1 }); // New index for status filtering
paymentSchema.index({ createdAt: -1 }); // For chronological sorting

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
