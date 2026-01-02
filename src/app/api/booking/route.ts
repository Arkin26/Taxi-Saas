

// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB, Driver, Cab, Booking } from '@/lib/db';

// /**
//  * GET /api/booking
//  * Returns all available drivers and cabs for booking
//  */
// export async function GET() {
//   try {
//     await connectDB();

//     // Get all free drivers
//     const drivers = await Driver.find({ 
//       availabilityStatus: 'free' 
//     }).select('driverId fullName phoneNumber profilePhoto');

//     // Get all available cabs
//     const cabs = await Cab.find({ 
//       status: 'available' 
//     }).select('cabId licensePlate model brand capacity fuelType');

//     const formattedDrivers = drivers.map(driver => ({
//       driverId: driver.driverId,
//       name: driver.fullName,
//       phone: driver.phoneNumber,
//       profilePhoto: driver.profilePhoto
//     }));

//     const formattedCabs = cabs.map(cab => ({
//       cabId: cab.cabId,
//       type: cab.brand,
//       model: cab.model,
//       fuelType: cab.fuelType,
//       numberPlate: cab.licensePlate,
//       seatingCapacity: cab.capacity
//     }));

//     return NextResponse.json({
//       success: true,
//       drivers: formattedDrivers,
//       cabs: formattedCabs,
//       message: `Found ${formattedDrivers.length} drivers and ${formattedCabs.length} cabs available`
//     }, { status: 200 });

//   } catch (error: any) {
//     console.error('Error fetching available resources:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Failed to fetch available drivers and cabs',
//       details: error.message
//     }, { status: 500 });
//   }
// }

// /**
//  * POST /api/booking
//  * Creates a new booking and automatically creates payment record if advance is paid
//  */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const bookingData = await req.json();
//     console.log('Received booking data:', bookingData);

//     // Validate required fields
//     const requiredFields = [
//       'driverId', 'cabId', 'customerName', 'customerPhone', 
//       'pickupLocation', 'dropLocation', 'bookingDate', 
//       'bookingTime', 'totalAmount', 'bookingMode'
//     ];

//     for (const field of requiredFields) {
//       if (!bookingData[field]) {
//         return NextResponse.json({
//           success: false,
//           error: `Missing required field: ${field}`
//         }, { status: 400 });
//       }
//     }

//     // Validate bookingMode
//     if (!['SCHEDULE', 'IMMEDIATE'].includes(bookingData.bookingMode)) {
//       return NextResponse.json({
//         success: false,
//         error: 'Invalid booking mode. Must be SCHEDULE or IMMEDIATE'
//       }, { status: 400 });
//     }

//     // Check if driver exists and is available
//     const driver = await Driver.findOne({ 
//       driverId: bookingData.driverId,
//       availabilityStatus: 'free'
//     });

//     if (!driver) {
//       return NextResponse.json({
//         success: false,
//         error: 'Driver not found or not available'
//       }, { status: 400 });
//     }

//     // Check if cab exists and is available
//     const cab = await Cab.findOne({ 
//       cabId: bookingData.cabId,
//       status: 'available'
//     });

//     if (!cab) {
//       return NextResponse.json({
//         success: false,
//         error: 'Cab not found or not available'
//       }, { status: 400 });
//     }

//     // Create scheduled date/time
//     const scheduledDateTime = new Date(`${bookingData.bookingDate}T${bookingData.bookingTime}`);

//     // For scheduled bookings, validate that the scheduled time is in the future
//     if (bookingData.bookingMode === 'SCHEDULE') {
//       const now = new Date();
//       if (scheduledDateTime <= now) {
//         return NextResponse.json({
//           success: false,
//           error: 'Scheduled time must be in the future'
//         }, { status: 400 });
//       }
//     }

//     // Create the booking - Let the model's default functions handle bookingStatus and isConfirmed
//     const newBooking = new Booking({
//       bookingId: bookingData.bookingId,
//       customerName: bookingData.customerName,
//       customerPhone: bookingData.customerPhone,
//       customerNumber: bookingData.customerNumber,
//       pickupLocation: bookingData.pickupLocation,
//       dropLocation: bookingData.dropLocation,
//       bookingDate: bookingData.bookingDate,
//       bookingTime: bookingData.bookingTime,
//       scheduledDateTime: scheduledDateTime,
//       duration: bookingData.duration || undefined,
//       totalAmount: bookingData.totalAmount,
//       advancePayment: bookingData.advancePayment || '0',
//       duePayment: bookingData.duePayment || bookingData.totalAmount,
//       bookingType: bookingData.bookingType,
//       bookingMode: bookingData.bookingMode,
//       driverId: bookingData.driverId,
//       cabId: bookingData.cabId,
//       status: bookingData.bookingMode === 'IMMEDIATE' ? 'confirmed' : 'pending',
//       alertSent: false
//     });

//     // Save the booking
//     const savedBooking = await newBooking.save();

//     // Debug logging
//     console.log('=== BOOKING SAVED DEBUG ===');
//     console.log('Booking ID:', savedBooking.bookingId);
//     console.log('Booking Mode:', savedBooking.bookingMode);
//     console.log('Status:', savedBooking.status);
//     console.log('Booking Status:', savedBooking.bookingStatus);
//     console.log('Customer Name:', savedBooking.customerName);
//     console.log('Advance Payment:', savedBooking.advancePayment);
//     console.log('========================');

//     // 🔥 NEW: Auto-create payment record if advance payment exists
//     const advanceAmount = parseFloat(bookingData.advancePayment || '0');
//     let paymentRecord = null;
    
//     if (advanceAmount > 0) {
//       try {
//         console.log('Creating payment record for advance payment:', advanceAmount);
        
//         // Create payment record directly (internal API call)
//         const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin}/api/payments`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ bookingId: savedBooking.bookingId })
//         });
        
//         if (paymentResponse.ok) {
//           const paymentData = await paymentResponse.json();
//           paymentRecord = paymentData.payment;
//           console.log('Auto-created payment record:', paymentRecord?.paymentId);
//         } else {
//           const errorData = await paymentResponse.json();
//           console.warn('Failed to auto-create payment record:', errorData.error);
//         }
//       } catch (paymentError) {
//         console.warn('Payment record creation error:', paymentError);
//         // Don't fail the booking if payment record creation fails
//       }
//     }

//     // Only update driver and cab status for IMMEDIATE bookings
//     if (bookingData.bookingMode === 'IMMEDIATE') {
//       await Driver.findOneAndUpdate(
//         { driverId: bookingData.driverId },
//         { availabilityStatus: 'busy' }
//       );

//       await Cab.findOneAndUpdate(
//         { cabId: bookingData.cabId },
//         { status: 'busy' }
//       );
//     }

//     const responseMessage = bookingData.bookingMode === 'IMMEDIATE' 
//       ? 'Immediate booking created and ride started!'
//       : 'Booking scheduled successfully!';

//     const response: any = {
//       success: true,
//       booking: savedBooking,
//       message: responseMessage,
//       bookingStatus: savedBooking.bookingStatus,
//       resourcesReserved: bookingData.bookingMode === 'IMMEDIATE'
//     };

//     // Add payment info to response if payment was processed
//     if (paymentRecord) {
//       response.payment = {
//         paymentId: paymentRecord.paymentId,
//         amountPaid: paymentRecord.amountPaid,
//         paymentMethod: paymentRecord.paymentMethod,
//         message: `Advance payment of ₹${paymentRecord.amountPaid} recorded successfully`
//       };
//     }

//     return NextResponse.json(response, { status: 201 });

//   } catch (error: any) {
//     console.error('Error creating booking:', error);
    
//     if (error.code === 11000) {
//       return NextResponse.json({
//         success: false,
//         error: 'Booking ID already exists'
//       }, { status: 400 });
//     }

//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map((err: any) => err.message);
//       return NextResponse.json({
//         success: false,
//         error: 'Validation failed',
//         details: validationErrors
//       }, { status: 400 });
//     }

//     return NextResponse.json({
//       success: false,
//       error: 'Failed to create booking',
//       details: error.message
//     }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Driver, Cab, Booking, Payment } from '@/lib/db';

/**
 * GET /api/booking
 * Returns all available drivers and cabs
 */
export async function GET() {
  try {
    await connectDB();

    const drivers = await Driver.find({
      availabilityStatus: 'free',
    }).select('driverId fullName phoneNumber profilePhoto');

    const cabs = await Cab.find({
      status: 'available',
    }).select('cabId licensePlate model brand capacity fuelType');

    return NextResponse.json(
      {
        success: true,
        drivers: drivers.map((d) => ({
          driverId: d.driverId,
          name: d.fullName,
          phone: d.phoneNumber,
          profilePhoto: d.profilePhoto,
        })),
        cabs: cabs.map((c) => ({
          cabId: c.cabId,
          type: c.brand,
          model: c.model,
          fuelType: c.fuelType,
          numberPlate: c.licensePlate,
          seatingCapacity: c.capacity,
        })),
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/booking
 * Creates booking + payment (NO internal API calls)
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    const requiredFields = [
      'driverId',
      'cabId',
      'customerName',
      'customerPhone',
      'pickupLocation',
      'dropLocation',
      'bookingDate',
      'bookingTime',
      'totalAmount',
      'bookingMode',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const driver = await Driver.findOne({
      driverId: data.driverId,
      availabilityStatus: 'free',
    });

    if (!driver) {
      return NextResponse.json(
        { success: false, error: 'Driver not available' },
        { status: 400 }
      );
    }

    const cab = await Cab.findOne({
      cabId: data.cabId,
      status: 'available',
    });

    if (!cab) {
      return NextResponse.json(
        { success: false, error: 'Cab not available' },
        { status: 400 }
      );
    }

    const scheduledDateTime = new Date(
      `${data.bookingDate}T${data.bookingTime}`
    );

    const booking = await Booking.create({
      ...data,
      scheduledDateTime,
      advancePayment: data.advancePayment || '0',
      duePayment: data.duePayment || data.totalAmount,
      status: data.bookingMode === 'IMMEDIATE' ? 'confirmed' : 'pending',
    });

    const advanceAmount = Number(data.advancePayment || '0');
    let payment = null;

    if (advanceAmount > 0) {
      payment = await Payment.create({
        paymentId: `PAY${Date.now()}`,
        bookingId: booking.bookingId,
        customerName: booking.customerName,
        amountPaid: advanceAmount,
        remainingAmount:
          Number(booking.totalAmount) - advanceAmount,
        totalBookingAmount: Number(booking.totalAmount),
        paymentMethod: 'CASH',
        paymentSequence: 1,
        receivedBy: 'SYSTEM',
        paymentType: 'ADVANCE',
      });
    }

    if (data.bookingMode === 'IMMEDIATE') {
      await Driver.updateOne(
        { driverId: data.driverId },
        { availabilityStatus: 'busy' }
      );

      await Cab.updateOne(
        { cabId: data.cabId },
        { status: 'busy' }
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking,
        payment,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
