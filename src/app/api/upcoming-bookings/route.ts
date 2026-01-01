import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Booking, Driver, Cab } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    const upcomingBookings = await Booking.find({ 
      bookingStatus: 'UPCOMING',
      scheduledDateTime: { $gte: new Date() } // Only future bookings
    }).sort({ scheduledDateTime: 1 }); // Sort by scheduled time

    const bookingsWithDetails = await Promise.all(
      upcomingBookings.map(async (booking) => {
        const driver = await Driver.findOne({ driverId: booking.driverId });
        const cab = await Cab.findOne({ cabId: booking.cabId });
        
        return {
          ...booking.toObject(),
          driverName: driver?.fullName || 'Unknown Driver',
          cabModel: cab?.model || 'Unknown Model',
          licensePlate: cab?.licensePlate || 'Unknown Plate'
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      bookings: bookingsWithDetails 
    });
    
  } catch (error) {
    console.error('Upcoming bookings fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch upcoming bookings' 
    }, { status: 500 });
  }
}
