import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Payment, Booking } from '@/lib/db';

// Simple Payment interface
interface PaymentRecord {
  _id?: any;
  paymentId: string;
  bookingId: string;
  customerName: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDate: Date;
  paymentTime: string;
  paymentType: 'ADVANCE' | 'FINAL'; // ✅ Changed from TRIP_COMPLETION to FINAL
  notes?: string;
  createdAt?: Date;
}

// Booking interface to match your model
interface BookingRecord {
  _id?: any;
  bookingId: string;
  customerName: string;
  advancePayment: string;
  bookingMode?: string;
  [key: string]: any; // Allow other fields
}

// GET - Fetch all payments
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get('all');
    const customerName = searchParams.get('customerName');
    
    let query: any = {};
    
    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }
    
    console.log('=== PAYMENT FETCH DEBUG ===');
    console.log('Query:', query);
    
    // Fetch payments and sort by newest first - properly typed
    const rawPayments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    // Type assertion to our interface
    const payments = rawPayments as unknown as PaymentRecord[];
    
    console.log('Found payments:', payments.length);
    
    // Calculate simple summary
    const totalAdvancePayments = payments
      .filter(p => p.paymentType === 'ADVANCE')
      .reduce((sum, p) => sum + p.amountPaid, 0);
    
    const totalFinalPayments = payments
      .filter(p => p.paymentType === 'FINAL')
      .reduce((sum, p) => sum + p.amountPaid, 0);
    
    const summary = {
      totalPayments: payments.length,
      totalAdvancePayments,
      totalFinalPayments, // ✅ Changed from totalTripCompletionPayments
      totalAmount: totalAdvancePayments + totalFinalPayments
    };
    
    console.log('Summary:', summary);
    console.log('=== END PAYMENT FETCH DEBUG ===');
    
    return NextResponse.json({
      success: true,
      payments,
      count: payments.length,
      summary
    });
    
  } catch (error) {
    console.error('Payment fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payments'
    }, { status: 500 });
  }
}

// POST - Handle both advance and final payments
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const requestData = await req.json();
    console.log('=== PAYMENT CREATION DEBUG ===');
    console.log('Request data:', requestData);
    
    // Check if this is a final payment (from ride completion)
    if (requestData.isRideCompletion || requestData.finalPaymentAmount) {
      return await handleFinalPayment(requestData);
    } else {
      // Handle advance payment (from booking creation)
      return await handleAdvancePayment(requestData.bookingId);
    }
    
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create payment record'
    }, { status: 500 });
  }
}

// Helper function for advance payment creation
async function handleAdvancePayment(bookingId: string) {
  if (!bookingId) {
    return NextResponse.json({
      success: false,
      error: 'Booking ID is required'
    }, { status: 400 });
  }
  
  console.log('Creating ADVANCE payment for booking:', bookingId);
  
  // Get booking details
  const rawBooking = await Booking.findOne({ bookingId }).lean();
  
  if (!rawBooking) {
    return NextResponse.json({
      success: false,
      error: 'Booking not found'
    }, { status: 404 });
  }
  
  const booking = rawBooking as unknown as BookingRecord & {
    totalAmount: string;
    bookingMode?: string;
  };
  
  console.log('Found booking:', {
    bookingId: booking.bookingId,
    customerName: booking.customerName,
    advancePayment: booking.advancePayment,
    totalAmount: booking.totalAmount
  });
  
  // Check if advance payment exists and is greater than 0
  const advanceAmount = parseFloat(booking.advancePayment || '0');
  const totalBookingAmount = parseFloat(booking.totalAmount || '0');
  
  if (advanceAmount <= 0) {
    return NextResponse.json({
      success: false,
      error: 'No advance payment found for this booking'
    }, { status: 400 });
  }
  
  // Check if ADVANCE payment record already exists
  const existingAdvancePayment = await Payment.findOne({ 
    bookingId, 
    paymentType: 'ADVANCE' 
  });
  
  if (existingAdvancePayment) {
    return NextResponse.json({
      success: false,
      error: 'Advance payment record already exists for this booking'
    }, { status: 400 });
  }
  
  // Calculate remaining amount
  const remainingAmount = totalBookingAmount - advanceAmount;
  
  // Generate payment ID
  const paymentId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
  // Create ADVANCE payment record
  const paymentRecord = new Payment({
    paymentId,
    bookingId: booking.bookingId,
    customerName: booking.customerName,
    amountPaid: advanceAmount,
    remainingAmount: remainingAmount,
    totalBookingAmount: totalBookingAmount,
    paymentMethod: 'CASH',
    paymentDate: new Date(),
    paymentTime: new Date().toLocaleTimeString('en-IN', { 
      hour12: true, 
      timeZone: 'Asia/Kolkata' 
    }),
    paymentStatus: 'COMPLETED',
    paymentSequence: 1,
    receivedBy: 'SYSTEM',
    paymentType: 'ADVANCE',
    notes: `Advance payment for ${booking.bookingMode?.toLowerCase() || 'booking'}`
  });
  
  const savedPayment = await paymentRecord.save();
  
  console.log('ADVANCE payment created successfully:', {
    paymentId: savedPayment.paymentId,
    amount: savedPayment.amountPaid
  });
  
  return NextResponse.json({
    success: true,
    payment: savedPayment,
    message: `Advance payment of ₹${advanceAmount} recorded successfully`
  });
}

// Helper function for final payment creation
async function handleFinalPayment(requestData: any) {
  const { bookingId, finalPaymentAmount, paymentMethod, receivedBy } = requestData;
  
  if (!bookingId || !finalPaymentAmount) {
    return NextResponse.json({
      success: false,
      error: 'Booking ID and final payment amount are required'
    }, { status: 400 });
  }
  
  console.log('Creating FINAL payment for booking:', bookingId);
  console.log('Final payment amount:', finalPaymentAmount);
  
  // Get booking details
  const rawBooking = await Booking.findOne({ bookingId }).lean();
  
  if (!rawBooking) {
    return NextResponse.json({
      success: false,
      error: 'Booking not found'
    }, { status: 404 });
  }
  
  const booking = rawBooking as unknown as BookingRecord & {
    totalAmount: string;
  };
  
  // Check if there's an existing advance payment
  const existingAdvancePayment = await Payment.findOne({ 
    bookingId, 
    paymentType: 'ADVANCE' 
  });
  
  // Check if final payment already exists
  const existingFinalPayment = await Payment.findOne({ 
    bookingId, 
    paymentType: 'FINAL' 
  });
  
  if (existingFinalPayment) {
    return NextResponse.json({
      success: false,
      error: 'Final payment record already exists for this booking'
    }, { status: 400 });
  }
  
  const totalBookingAmount = parseFloat(booking.totalAmount || '0');
  const advanceAmount = existingAdvancePayment ? existingAdvancePayment.amountPaid : 0;
  const paymentSequence = existingAdvancePayment ? 2 : 1;
  
  console.log('Payment details:', {
    totalBookingAmount,
    advanceAmount,
    finalPaymentAmount,
    paymentSequence
  });
  
  // Generate payment ID
  const paymentId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
  // Create FINAL payment record
  const finalPaymentRecord = new Payment({
    paymentId,
    bookingId: booking.bookingId,
    customerName: booking.customerName,
    amountPaid: finalPaymentAmount,
    remainingAmount: 0, // Final payment, so remaining is 0
    totalBookingAmount: totalBookingAmount,
    paymentMethod: paymentMethod || 'CASH',
    paymentDate: new Date(),
    paymentTime: new Date().toLocaleTimeString('en-IN', { 
      hour12: true, 
      timeZone: 'Asia/Kolkata' 
    }),
    paymentStatus: 'COMPLETED',
    paymentSequence: paymentSequence,
    receivedBy: receivedBy || 'DRIVER',
    paymentType: 'FINAL', // ✅ Set as FINAL payment
    notes: existingAdvancePayment 
      ? `Final payment on ride completion (Advance: ₹${advanceAmount})`
      : 'Full payment on ride completion'
  });
  
  const savedPayment = await finalPaymentRecord.save();
  
  console.log('FINAL payment created successfully:', {
    paymentId: savedPayment.paymentId,
    amount: savedPayment.amountPaid,
    linkedToAdvance: !!existingAdvancePayment
  });
  
  return NextResponse.json({
    success: true,
    payment: savedPayment,
    message: `Final payment of ₹${finalPaymentAmount} recorded successfully`
  });
}

// PUT - Update payment method
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    const { paymentId, paymentMethod } = await req.json();
    
    if (!paymentId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID is required'
      }, { status: 400 });
    }
    
    const updates: any = {};
    
    if (paymentMethod) {
      updates.paymentMethod = paymentMethod;
    }
    
    if (Object.keys(updates).length > 0) {
      await Payment.updateOne({ paymentId }, updates);
      
      const updatedPayment = await Payment.findOne({ paymentId });
      
      return NextResponse.json({
        success: true,
        payment: updatedPayment,
        message: 'Payment updated successfully'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'No updates provided'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update payment'
    }, { status: 500 });
  }
}
