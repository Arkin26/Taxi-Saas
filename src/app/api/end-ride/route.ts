// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB, Booking, Driver, Cab } from '@/lib/db';

// export async function POST(req: NextRequest) {
//   try {
//     const { bookingId, driverId, cabId } = await req.json();
    
//     if (!bookingId || !driverId || !cabId) {
//       return NextResponse.json({ 
//         success: false, 
//         error: 'Missing required fields' 
//       }, { status: 400 });
//     }

//     await connectDB();
    
//     // Check if booking exists and is active
//     const booking = await Booking.findOne({ 
//       bookingId,
//       status: { $nin: ['completed', 'cancelled'] }
//     }).lean();
    
//     if (!booking) {
//       return NextResponse.json({ 
//         success: false, 
//         error: 'Active booking not found' 
//       }, { status: 404 });
//     }

//     // Check current driver and cab status BEFORE update
//     const currentDriver = await Driver.findOne({ driverId });
//     const currentCab = await Cab.findOne({ cabId });
    
//     console.log('BEFORE UPDATE:');
//     console.log('Driver availability:', currentDriver?.availabilityStatus);
//     console.log('Cab status:', currentCab?.status);
    
//     // Perform all updates
//     const [bookingUpdate, driverUpdate, cabUpdate] = await Promise.all([
//       // Update booking status to completed
//       Booking.updateOne(
//         { bookingId },
//         { 
//           $set: { 
//             status: 'completed',
//             updatedAt: new Date()
//           }
//         }
//       ),
      
//       // Update driver availability to 'free'
//       Driver.updateOne(
//         { driverId },
//         { 
//           $set: { 
//             availabilityStatus: 'free' 
//           }
//         }
//       ),
      
//       // Update cab status to 'available'
//       Cab.updateOne(
//         { cabId },
//         { 
//           $set: { 
//             status: 'available' 
//           }
//         }
//       )
//     ]);
    
//     // Enhanced logging with matchedCount and acknowledged
//     console.log('DETAILED UPDATE RESULTS:', { 
//       booking: {
//         matched: bookingUpdate.matchedCount,
//         modified: bookingUpdate.modifiedCount,
//         acknowledged: bookingUpdate.acknowledged
//       },
//       driver: {
//         matched: driverUpdate.matchedCount,
//         modified: driverUpdate.modifiedCount,
//         acknowledged: driverUpdate.acknowledged
//       },
//       cab: {
//         matched: cabUpdate.matchedCount,
//         modified: cabUpdate.modifiedCount,
//         acknowledged: cabUpdate.acknowledged
//       }
//     });

//     // Verify updates by reading back the documents
//     const updatedDriver = await Driver.findOne({ driverId });
//     const updatedCab = await Cab.findOne({ cabId });
    
//     console.log('AFTER UPDATE:');
//     console.log('Driver availability:', updatedDriver?.availabilityStatus);
//     console.log('Cab status:', updatedCab?.status);
    
//     // Check for update failures
//     if (driverUpdate.matchedCount === 0) {
//       console.error('❌ Driver not found with driverId:', driverId);
//     }
//     if (cabUpdate.matchedCount === 0) {
//       console.error('❌ Cab not found with cabId:', cabId);
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Ride ended successfully. Driver and cab are now available.',
//       updates: {
//         booking: bookingUpdate.modifiedCount > 0,
//         driver: driverUpdate.modifiedCount > 0,
//         cab: cabUpdate.modifiedCount > 0
//       },
//       debug: {
//         driverMatched: driverUpdate.matchedCount,
//         cabMatched: cabUpdate.matchedCount,
//         finalDriverStatus: updatedDriver?.availabilityStatus,
//         finalCabStatus: updatedCab?.status
//       }
//     });
    
//   } catch (error: any) {
//     console.error('End ride error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       error: `Server error: ${error.message}` 
//     }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Booking, Driver, Cab } from '@/lib/db';

/**
 * POST /api/end-ride
 * Ends an active ride and frees driver & cab
 */
export async function POST(req: NextRequest) {
  try {
    const { bookingId, driverId, cabId } = await req.json();

    if (!bookingId || !driverId || !cabId) {
      return NextResponse.json(
        { success: false, error: 'bookingId, driverId and cabId are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Ensure booking exists and is active
    const booking = await Booking.findOne({
      bookingId,
      status: { $nin: ['completed', 'cancelled'] },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Active booking not found' },
        { status: 404 }
      );
    }

    // Perform updates atomically (best-effort)
    const [bookingUpdate, driverUpdate, cabUpdate] = await Promise.all([
      Booking.updateOne(
        { bookingId },
        {
          $set: {
            status: 'completed',
            bookingStatus: 'COMPLETED',
            updatedAt: new Date(),
          },
        }
      ),

      Driver.updateOne(
        { driverId },
        { $set: { availabilityStatus: 'free' } }
      ),

      Cab.updateOne(
        { cabId },
        { $set: { status: 'available' } }
      ),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Ride ended successfully',
        updates: {
          bookingUpdated: bookingUpdate.modifiedCount > 0,
          driverUpdated: driverUpdate.modifiedCount > 0,
          cabUpdated: cabUpdate.modifiedCount > 0,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('POST /api/end-ride error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to end ride' },
      { status: 500 }
    );
  }
}
