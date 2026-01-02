// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB, Booking, Driver, Cab } from '@/lib/db';

// export async function GET() {
//   try {
//     await connectDB();
    
//     const upcomingBookings = await Booking.find({ 
//       bookingStatus: 'UPCOMING',
//       scheduledDateTime: { $gte: new Date() } // Only future bookings
//     }).sort({ scheduledDateTime: 1 }); // Sort by scheduled time

//     const bookingsWithDetails = await Promise.all(
//       upcomingBookings.map(async (booking) => {
//         const driver = await Driver.findOne({ driverId: booking.driverId });
//         const cab = await Cab.findOne({ cabId: booking.cabId });
        
//         return {
//           ...booking.toObject(),
//           driverName: driver?.fullName || 'Unknown Driver',
//           cabModel: cab?.model || 'Unknown Model',
//           licensePlate: cab?.licensePlate || 'Unknown Plate'
//         };
//       })
//     );

//     return NextResponse.json({ 
//       success: true, 
//       bookings: bookingsWithDetails 
//     });
    
//   } catch (error) {
//     console.error('Upcoming bookings fetch error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       error: 'Failed to fetch upcoming bookings' 
//     }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { connectDB, Booking, Driver, Cab } from '@/lib/db';

/* ===================== TYPES ===================== */

interface BookingLean {
  bookingId: string;
  driverId: string;
  cabId: string;
  scheduledDateTime: Date;
  [key: string]: any;
}

interface DriverLean {
  fullName?: string;
}

interface CabLean {
  model?: string;
  licensePlate?: string;
}

/* ===================== GET ===================== */

export async function GET() {
  try {
    await connectDB();

    const upcomingBookings = (await Booking.find({
      bookingStatus: 'UPCOMING',
      scheduledDateTime: { $gte: new Date() },
    })
      .sort({ scheduledDateTime: 1 })
      .lean()) as unknown as BookingLean[];

    const bookingsWithDetails = await Promise.all(
      upcomingBookings.map(async (booking) => {
        const driver = (await Driver.findOne({ driverId: booking.driverId })
          .select('fullName')
          .lean()) as unknown as DriverLean | null;

        const cab = (await Cab.findOne({ cabId: booking.cabId })
          .select('model licensePlate')
          .lean()) as unknown as CabLean | null;

        return {
          ...booking,
          driverName: driver?.fullName ?? 'Unknown Driver',
          cabModel: cab?.model ?? 'Unknown Model',
          licensePlate: cab?.licensePlate ?? 'Unknown Plate',
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        bookings: bookingsWithDetails,
        count: bookingsWithDetails.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('GET /api/upcoming-bookings error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch upcoming bookings',
      },
      { status: 500 }
    );
  }
}
