// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB, Booking, Driver, Cab } from '@/lib/db';

// export async function POST(req: NextRequest) {
//   try {
//     const { bookingId } = await req.json();
    
//     await connectDB();
    
//     const booking = await Booking.findOne({ 
//       bookingId,
//       bookingStatus: 'UPCOMING' 
//     });
    
//     if (!booking) {
//       return NextResponse.json({ 
//         success: false, 
//         error: 'Upcoming booking not found' 
//       }, { status: 404 });
//     }

//     // Update booking status to ongoing
//     await Booking.updateOne(
//       { bookingId },
//       { 
//         $set: { 
//           bookingStatus: 'ONGOING',
//           isConfirmed: true,
//           confirmationTime: new Date()
//         }
//       }
//     );

//     // Update driver and cab status to busy
//     await Promise.all([
//       Driver.updateOne(
//         { driverId: booking.driverId },
//         { $set: { availabilityStatus: 'busy' } }
//       ),
//       Cab.updateOne(
//         { cabId: booking.cabId },
//         { $set: { status: 'busy' } }
//       )
//     ]);

//     return NextResponse.json({ 
//       success: true, 
//       message: 'Booking confirmed and moved to ongoing rides!' 
//     });
    
//   } catch (error) {
//     console.error('Booking confirmation error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       error: 'Failed to confirm booking' 
//     }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Booking, Driver, Cab } from '@/lib/db';

/**
 * POST /api/confirm-booking
 * Confirms an upcoming booking and moves it to ongoing
 */
export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'bookingId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await Booking.findOne({
      bookingId,
      bookingStatus: 'UPCOMING',
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Upcoming booking not found' },
        { status: 404 }
      );
    }

    // Update booking to ongoing
    await Booking.updateOne(
      { bookingId },
      {
        $set: {
          bookingStatus: 'ONGOING',
          isConfirmed: true,
          confirmationTime: new Date(),
        },
      }
    );

    // Mark driver and cab as busy
    await Promise.all([
      Driver.updateOne(
        { driverId: booking.driverId },
        { $set: { availabilityStatus: 'busy' } }
      ),
      Cab.updateOne(
        { cabId: booking.cabId },
        { $set: { status: 'busy' } }
      ),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Booking confirmed and moved to ongoing rides',
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('POST /api/confirm-booking error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to confirm booking' },
      { status: 500 }
    );
  }
}
