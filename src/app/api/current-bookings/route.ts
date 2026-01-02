// // import { NextResponse } from 'next/server';
// // import { connectDB, Booking, Cab, Driver } from '@/lib/db';

// // /* narrow the .lean() result so TS knows these fields exist */
// // type CabLean    = { model?: string; licensePlate?: string };
// // type DriverLean = { fullName?: string };

// // export async function GET() {
// //   try {
// //     await connectDB();

// //     const raw = await Booking.find({ status: { $ne: 'cancelled' } })
// //       .sort({ createdAt: -1 })
// //       .lean();

// //     const bookings = await Promise.all(
// //       raw.map(async (b: any) => {
// //         const cab = await Cab.findOne({ cabId: b.cabId })
// //           .select('model licensePlate')
// //           .lean<CabLean>();

// //         const driver = await Driver.findOne({ driverId: b.driverId })
// //           .select('fullName')
// //           .lean<DriverLean>();

// //         return {
// //           ...b,
// //           cabModel:     cab?.model        ?? '',
// //           licensePlate: cab?.licensePlate ?? '',
// //           driverName:   driver?.fullName  ?? '',
// //         };
// //       })
// //     );

// //     return NextResponse.json({ success: true, bookings });
// //   } catch (err: any) {
// //     console.error(err);
// //     return NextResponse.json(
// //       { success: false, error: 'Failed to fetch bookings', details: err.message },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextResponse } from 'next/server';
// import { connectDB, Booking, Cab, Driver } from '@/lib/db';

// /* narrow the .lean() result so TS knows these fields exist */
// type CabLean = { model?: string; licensePlate?: string };
// type DriverLean = { fullName?: string };

// export async function GET() {
//   try {
//     await connectDB();

//     // Only fetch confirmed ongoing bookings (not upcoming, completed, or cancelled)
//     const raw = await Booking.find({ 
//       $and: [
//         {
//           $or: [
//             { bookingStatus: 'ONGOING' }, // New field
//             { 
//               $and: [
//                 { status: { $nin: ['completed', 'cancelled'] } }, // Backward compatibility
//                 { bookingStatus: { $exists: false } } // Handle old bookings without bookingStatus
//               ]
//             }
//           ]
//         },
//         {
//           $or: [
//             { isConfirmed: true }, // New field
//             { isConfirmed: { $exists: false } } // Handle old bookings without isConfirmed
//           ]
//         }
//       ]
//     })
//       .sort({ createdAt: -1 })
//       .lean();

//     const bookings = await Promise.all(
//       raw.map(async (b: any) => {
//         const cab = await Cab.findOne({ cabId: b.cabId })
//           .select('model licensePlate')
//           .lean<CabLean>();

//         const driver = await Driver.findOne({ driverId: b.driverId })
//           .select('fullName')
//           .lean<DriverLean>();

//         return {
//           ...b,
//           cabModel: cab?.model ?? '',
//           licensePlate: cab?.licensePlate ?? '',
//           driverName: driver?.fullName ?? '',
//         };
//       })
//     );

//     return NextResponse.json({ 
//       success: true, 
//       bookings,
//       count: bookings.length,
//       message: `Found ${bookings.length} ongoing rides`
//     });
//   } catch (err: any) {
//     console.error('Current bookings fetch error:', err);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to fetch current bookings', 
//         details: err.message 
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { connectDB, Booking, Cab, Driver } from '@/lib/db';

/* Lean result helpers */
type CabLean = { model?: string; licensePlate?: string };
type DriverLean = { fullName?: string };

export async function GET() {
  try {
    await connectDB();

    // Fetch only ongoing / active bookings
    const rawBookings = await Booking.find({
      $and: [
        {
          $or: [
            { bookingStatus: 'ONGOING' },
            {
              $and: [
                { status: { $nin: ['completed', 'cancelled'] } },
                { bookingStatus: { $exists: false } },
              ],
            },
          ],
        },
        {
          $or: [
            { isConfirmed: true },
            { isConfirmed: { $exists: false } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const bookings = await Promise.all(
      rawBookings.map(async (b: any) => {
        const cab = await Cab.findOne({ cabId: b.cabId })
          .select('model licensePlate')
          .lean<CabLean>();

        const driver = await Driver.findOne({ driverId: b.driverId })
          .select('fullName')
          .lean<DriverLean>();

        return {
          ...b,
          cabModel: cab?.model ?? '',
          licensePlate: cab?.licensePlate ?? '',
          driverName: driver?.fullName ?? '',
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        bookings,
        count: bookings.length,
        message: `Found ${bookings.length} ongoing rides`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('GET /api/current-bookings error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch current bookings',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
