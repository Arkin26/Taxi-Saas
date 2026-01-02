// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB, Payment, Booking } from '@/lib/db';

// // Simple Payment interface
// interface PaymentRecord {
//   _id?: any;
//   paymentId: string;
//   bookingId: string;
//   customerName: string;
//   amountPaid: number;
//   paymentMethod: string;
//   paymentDate: Date;
//   paymentTime: string;
//   paymentType: 'ADVANCE' | 'FINAL'; // ✅ Changed from TRIP_COMPLETION to FINAL
//   notes?: string;
//   createdAt?: Date;
// }

// // Booking interface to match your model
// interface BookingRecord {
//   _id?: any;
//   bookingId: string;
//   customerName: string;
//   advancePayment: string;
//   bookingMode?: string;
//   [key: string]: any; // Allow other fields
// }

// // GET - Fetch all payments
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(req.url);
//     const fetchAll = searchParams.get('all');
//     const customerName = searchParams.get('customerName');
    
//     let query: any = {};
    
//     if (customerName) {
//       query.customerName = { $regex: customerName, $options: 'i' };
//     }
    
//     console.log('=== PAYMENT FETCH DEBUG ===');
//     console.log('Query:', query);
    
//     // Fetch payments and sort by newest first - properly typed
//     const rawPayments = await Payment.find(query)
//       .sort({ createdAt: -1 })
//       .lean();
    
//     // Type assertion to our interface
//     const payments = rawPayments as unknown as PaymentRecord[];
    
//     console.log('Found payments:', payments.length);
    
//     // Calculate simple summary
//     const totalAdvancePayments = payments
//       .filter(p => p.paymentType === 'ADVANCE')
//       .reduce((sum, p) => sum + p.amountPaid, 0);
    
//     const totalFinalPayments = payments
//       .filter(p => p.paymentType === 'FINAL')
//       .reduce((sum, p) => sum + p.amountPaid, 0);
    
//     const summary = {
//       totalPayments: payments.length,
//       totalAdvancePayments,
//       totalFinalPayments, // ✅ Changed from totalTripCompletionPayments
//       totalAmount: totalAdvancePayments + totalFinalPayments
//     };
    
//     console.log('Summary:', summary);
//     console.log('=== END PAYMENT FETCH DEBUG ===');
    
//     return NextResponse.json({
//       success: true,
//       payments,
//       count: payments.length,
//       summary
//     });
    
//   } catch (error) {
//     console.error('Payment fetch error:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Failed to fetch payments'
//     }, { status: 500 });
//   }
// }

// // POST - Handle both advance and final payments
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const requestData = await req.json();
//     console.log('=== PAYMENT CREATION DEBUG ===');
//     console.log('Request data:', requestData);
    
//     // Check if this is a final payment (from ride completion)
//     if (requestData.isRideCompletion || requestData.finalPaymentAmount) {
//       return await handleFinalPayment(requestData);
//     } else {
//       // Handle advance payment (from booking creation)
//       return await handleAdvancePayment(requestData.bookingId);
//     }
    
//   } catch (error) {
//     console.error('Payment creation error:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Failed to create payment record'
//     }, { status: 500 });
//   }
// }

// // Helper function for advance payment creation
// async function handleAdvancePayment(bookingId: string) {
//   if (!bookingId) {
//     return NextResponse.json({
//       success: false,
//       error: 'Booking ID is required'
//     }, { status: 400 });
//   }
  
//   console.log('Creating ADVANCE payment for booking:', bookingId);
  
//   // Get booking details
//   const rawBooking = await Booking.findOne({ bookingId }).lean();
  
//   if (!rawBooking) {
//     return NextResponse.json({
//       success: false,
//       error: 'Booking not found'
//     }, { status: 404 });
//   }
  
//   const booking = rawBooking as unknown as BookingRecord & {
//     totalAmount: string;
//     bookingMode?: string;
//   };
  
//   console.log('Found booking:', {
//     bookingId: booking.bookingId,
//     customerName: booking.customerName,
//     advancePayment: booking.advancePayment,
//     totalAmount: booking.totalAmount
//   });
  
//   // Check if advance payment exists and is greater than 0
//   const advanceAmount = parseFloat(booking.advancePayment || '0');
//   const totalBookingAmount = parseFloat(booking.totalAmount || '0');
  
//   if (advanceAmount <= 0) {
//     return NextResponse.json({
//       success: false,
//       error: 'No advance payment found for this booking'
//     }, { status: 400 });
//   }
  
//   // Check if ADVANCE payment record already exists
//   const existingAdvancePayment = await Payment.findOne({ 
//     bookingId, 
//     paymentType: 'ADVANCE' 
//   });
  
//   if (existingAdvancePayment) {
//     return NextResponse.json({
//       success: false,
//       error: 'Advance payment record already exists for this booking'
//     }, { status: 400 });
//   }
  
//   // Calculate remaining amount
//   const remainingAmount = totalBookingAmount - advanceAmount;
  
//   // Generate payment ID
//   const paymentId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
//   // Create ADVANCE payment record
//   const paymentRecord = new Payment({
//     paymentId,
//     bookingId: booking.bookingId,
//     customerName: booking.customerName,
//     amountPaid: advanceAmount,
//     remainingAmount: remainingAmount,
//     totalBookingAmount: totalBookingAmount,
//     paymentMethod: 'CASH',
//     paymentDate: new Date(),
//     paymentTime: new Date().toLocaleTimeString('en-IN', { 
//       hour12: true, 
//       timeZone: 'Asia/Kolkata' 
//     }),
//     paymentStatus: 'COMPLETED',
//     paymentSequence: 1,
//     receivedBy: 'SYSTEM',
//     paymentType: 'ADVANCE',
//     notes: `Advance payment for ${booking.bookingMode?.toLowerCase() || 'booking'}`
//   });
  
//   const savedPayment = await paymentRecord.save();
  
//   console.log('ADVANCE payment created successfully:', {
//     paymentId: savedPayment.paymentId,
//     amount: savedPayment.amountPaid
//   });
  
//   return NextResponse.json({
//     success: true,
//     payment: savedPayment,
//     message: `Advance payment of ₹${advanceAmount} recorded successfully`
//   });
// }

// // Helper function for final payment creation
// async function handleFinalPayment(requestData: any) {
//   const { bookingId, finalPaymentAmount, paymentMethod, receivedBy } = requestData;
  
//   if (!bookingId || !finalPaymentAmount) {
//     return NextResponse.json({
//       success: false,
//       error: 'Booking ID and final payment amount are required'
//     }, { status: 400 });
//   }
  
//   console.log('Creating FINAL payment for booking:', bookingId);
//   console.log('Final payment amount:', finalPaymentAmount);
  
//   // Get booking details
//   const rawBooking = await Booking.findOne({ bookingId }).lean();
  
//   if (!rawBooking) {
//     return NextResponse.json({
//       success: false,
//       error: 'Booking not found'
//     }, { status: 404 });
//   }
  
//   const booking = rawBooking as unknown as BookingRecord & {
//     totalAmount: string;
//   };
  
//   // Check if there's an existing advance payment
//   const existingAdvancePayment = await Payment.findOne({ 
//     bookingId, 
//     paymentType: 'ADVANCE' 
//   });
  
//   // Check if final payment already exists
//   const existingFinalPayment = await Payment.findOne({ 
//     bookingId, 
//     paymentType: 'FINAL' 
//   });
  
//   if (existingFinalPayment) {
//     return NextResponse.json({
//       success: false,
//       error: 'Final payment record already exists for this booking'
//     }, { status: 400 });
//   }
  
//   const totalBookingAmount = parseFloat(booking.totalAmount || '0');
//   const advanceAmount = existingAdvancePayment ? existingAdvancePayment.amountPaid : 0;
//   const paymentSequence = existingAdvancePayment ? 2 : 1;
  
//   console.log('Payment details:', {
//     totalBookingAmount,
//     advanceAmount,
//     finalPaymentAmount,
//     paymentSequence
//   });
  
//   // Generate payment ID
//   const paymentId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
  
//   // Create FINAL payment record
//   const finalPaymentRecord = new Payment({
//     paymentId,
//     bookingId: booking.bookingId,
//     customerName: booking.customerName,
//     amountPaid: finalPaymentAmount,
//     remainingAmount: 0, // Final payment, so remaining is 0
//     totalBookingAmount: totalBookingAmount,
//     paymentMethod: paymentMethod || 'CASH',
//     paymentDate: new Date(),
//     paymentTime: new Date().toLocaleTimeString('en-IN', { 
//       hour12: true, 
//       timeZone: 'Asia/Kolkata' 
//     }),
//     paymentStatus: 'COMPLETED',
//     paymentSequence: paymentSequence,
//     receivedBy: receivedBy || 'DRIVER',
//     paymentType: 'FINAL', // ✅ Set as FINAL payment
//     notes: existingAdvancePayment 
//       ? `Final payment on ride completion (Advance: ₹${advanceAmount})`
//       : 'Full payment on ride completion'
//   });
  
//   const savedPayment = await finalPaymentRecord.save();
  
//   console.log('FINAL payment created successfully:', {
//     paymentId: savedPayment.paymentId,
//     amount: savedPayment.amountPaid,
//     linkedToAdvance: !!existingAdvancePayment
//   });
  
//   return NextResponse.json({
//     success: true,
//     payment: savedPayment,
//     message: `Final payment of ₹${finalPaymentAmount} recorded successfully`
//   });
// }

// // PUT - Update payment method
// export async function PUT(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const { paymentId, paymentMethod } = await req.json();
    
//     if (!paymentId) {
//       return NextResponse.json({
//         success: false,
//         error: 'Payment ID is required'
//       }, { status: 400 });
//     }
    
//     const updates: any = {};
    
//     if (paymentMethod) {
//       updates.paymentMethod = paymentMethod;
//     }
    
//     if (Object.keys(updates).length > 0) {
//       await Payment.updateOne({ paymentId }, updates);
      
//       const updatedPayment = await Payment.findOne({ paymentId });
      
//       return NextResponse.json({
//         success: true,
//         payment: updatedPayment,
//         message: 'Payment updated successfully'
//       });
//     }
    
//     return NextResponse.json({
//       success: false,
//       error: 'No updates provided'
//     }, { status: 400 });
    
//   } catch (error) {
//     console.error('Payment update error:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Failed to update payment'
//     }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Payment, Booking } from '@/lib/db';

/* ===================== TYPES ===================== */

interface BookingLean {
  bookingId: string;
  customerName: string;
  advancePayment?: string;
  totalAmount: string;
  bookingMode?: string;
}

interface PaymentLean {
  paymentType: 'ADVANCE' | 'FINAL';
  amountPaid: number;
}

/* ===================== GET ===================== */

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const customerName = searchParams.get('customerName');

    const query: any = {};
    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }

    const payments = (await Payment.find(query)
      .sort({ createdAt: -1 })
      .lean()) as unknown as PaymentLean[];

    const totalAdvancePayments = payments
      .filter(p => p.paymentType === 'ADVANCE')
      .reduce((sum, p) => sum + p.amountPaid, 0);

    const totalFinalPayments = payments
      .filter(p => p.paymentType === 'FINAL')
      .reduce((sum, p) => sum + p.amountPaid, 0);

    return NextResponse.json(
      {
        success: true,
        payments,
        count: payments.length,
        summary: {
          totalPayments: payments.length,
          totalAdvancePayments,
          totalFinalPayments,
          totalAmount: totalAdvancePayments + totalFinalPayments,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('GET /api/payments error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

/* ===================== POST ===================== */

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    if (data.finalPaymentAmount) {
      return handleFinalPayment(data);
    }

    return handleAdvancePayment(data.bookingId);
  } catch (err: any) {
    console.error('POST /api/payments error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

/* ===================== HELPERS ===================== */

async function handleAdvancePayment(bookingId: string) {
  if (!bookingId) {
    return NextResponse.json(
      { success: false, error: 'Booking ID is required' },
      { status: 400 }
    );
  }

  const booking = (await Booking.findOne({ bookingId }).lean()) as BookingLean | null;

  if (!booking) {
    return NextResponse.json(
      { success: false, error: 'Booking not found' },
      { status: 404 }
    );
  }

  const advanceAmount = Number(booking.advancePayment || 0);
  const totalBookingAmount = Number(booking.totalAmount || 0);

  if (advanceAmount <= 0) {
    return NextResponse.json(
      { success: false, error: 'No advance payment found' },
      { status: 400 }
    );
  }

  const existing = await Payment.findOne({
    bookingId,
    paymentType: 'ADVANCE',
  });

  if (existing) {
    return NextResponse.json(
      { success: false, error: 'Advance payment already exists' },
      { status: 409 }
    );
  }

  const payment = await Payment.create({
    paymentId: `PAY${Date.now()}`,
    bookingId,
    customerName: booking.customerName,
    amountPaid: advanceAmount,
    remainingAmount: totalBookingAmount - advanceAmount,
    totalBookingAmount,
    paymentMethod: 'CASH',
    paymentSequence: 1,
    receivedBy: 'SYSTEM',
    paymentType: 'ADVANCE',
    paymentStatus: 'COMPLETED',
  });

  return NextResponse.json(
    { success: true, payment },
    { status: 201 }
  );
}

async function handleFinalPayment(data: any) {
  const { bookingId, finalPaymentAmount, paymentMethod, receivedBy } = data;

  if (!bookingId || !finalPaymentAmount) {
    return NextResponse.json(
      { success: false, error: 'bookingId and finalPaymentAmount required' },
      { status: 400 }
    );
  }

  const booking = (await Booking.findOne({ bookingId }).lean()) as BookingLean | null;

  if (!booking) {
    return NextResponse.json(
      { success: false, error: 'Booking not found' },
      { status: 404 }
    );
  }

  const existingFinal = await Payment.findOne({
    bookingId,
    paymentType: 'FINAL',
  });

  if (existingFinal) {
    return NextResponse.json(
      { success: false, error: 'Final payment already exists' },
      { status: 409 }
    );
  }

  const existingAdvance = await Payment.findOne({
    bookingId,
    paymentType: 'ADVANCE',
  });

  const payment = await Payment.create({
    paymentId: `PAY${Date.now()}`,
    bookingId,
    customerName: booking.customerName,
    amountPaid: Number(finalPaymentAmount),
    remainingAmount: 0,
    totalBookingAmount: Number(booking.totalAmount),
    paymentMethod: paymentMethod || 'CASH',
    paymentSequence: existingAdvance ? 2 : 1,
    receivedBy: receivedBy || 'DRIVER',
    paymentType: 'FINAL',
    paymentStatus: 'COMPLETED',
  });

  return NextResponse.json(
    { success: true, payment },
    { status: 201 }
  );
}

/* ===================== PUT ===================== */

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { paymentId, paymentMethod } = await req.json();

    if (!paymentId || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'paymentId and paymentMethod required' },
        { status: 400 }
      );
    }

    await Payment.updateOne(
      { paymentId },
      { $set: { paymentMethod } }
    );

    const payment = await Payment.findOne({ paymentId });

    return NextResponse.json(
      { success: true, payment },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('PUT /api/payments error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}
