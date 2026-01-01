'use client';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Car,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface UpcomingBooking {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  scheduledDateTime: string;
  driverName: string;
  cabModel: string;
  licensePlate: string;
  totalAmount: string;
  bookingType: string;
  alertSent: boolean;
}

export default function UpcomingBookingsPage() {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingBookings();
    // Set up periodic refresh to check for alerts
    const interval = setInterval(checkForAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const res = await fetch('/api/upcoming-bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Failed to fetch upcoming bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForAlerts = () => {
    const now = new Date();
    bookings.forEach(booking => {
      const scheduledTime = new Date(booking.scheduledDateTime);
      const timeDiff = scheduledTime.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      
      // Show alert 15 minutes before scheduled time
      if (minutesDiff <= 15 && minutesDiff > 0 && !booking.alertSent) {
        showBookingAlert(booking, minutesDiff);
      }
    });
  };

  const showBookingAlert = (booking: UpcomingBooking, minutesRemaining: number) => {
    // Create browser notification
    if (Notification.permission === 'granted') {
      new Notification('Upcoming Booking Alert', {
        body: `Booking for ${booking.customerName} starts in ${minutesRemaining} minutes`,
        icon: '/favicon.ico',
      });
    }
    
    // You can also show in-app alert/toast here
    alert(`⏰ Booking Alert: ${booking.customerName}'s ride starts in ${minutesRemaining} minutes!`);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setConfirming(bookingId);
    try {
      const res = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });

      const data = await res.json();
      if (data.success) {
        alert('Booking confirmed and moved to ongoing rides!');
        // Remove from upcoming bookings list
        setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to confirm booking');
    } finally {
      setConfirming(null);
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center text-gray-900 mb-2">
            <Calendar className="mr-3 text-blue-600" />
            Upcoming Bookings
          </h1>
          <p className="text-gray-600">
            Scheduled bookings waiting for confirmation - {bookings.length} upcoming rides
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No Upcoming Bookings
            </h3>
            <p className="text-gray-500">
              All scheduled bookings will appear here 
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const scheduledTime = new Date(booking.scheduledDateTime);
              const now = new Date();
              const isUpcoming = scheduledTime.getTime() - now.getTime() <= 15 * 60 * 1000; // 15 minutes
              
              return (
                <div
                  key={booking.bookingId}
                  className={`bg-white rounded-xl shadow-lg border-l-4 p-6 ${
                    isUpcoming ? 'border-l-orange-500 bg-orange-50' : 'border-l-blue-500'
                  }`}
                >
                  {isUpcoming && (
                    <div className="flex items-center gap-2 mb-4 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Starting Soon!</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {booking.customerName}
                    </h3>
                    <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      ID: {booking.bookingId}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600 font-medium">From</p>
                        <p className="text-sm text-gray-800 truncate">{booking.pickupLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600 font-medium">To</p>
                        <p className="text-sm text-gray-800 truncate">{booking.dropLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Scheduled Time</p>
                        <p className="text-sm text-gray-800">
                          {scheduledTime.toLocaleDateString()} at {scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-800">{booking.driverName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-800">
                        {booking.cabModel} ({booking.licensePlate})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{booking.totalAmount}
                    </div>
                    
                    <button
                      onClick={() => handleConfirmBooking(booking.bookingId)}
                      disabled={confirming === booking.bookingId}
                      className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${
                        isUpcoming 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } disabled:bg-gray-400`}
                    >
                      {confirming === booking.bookingId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {confirming === booking.bookingId ? 'Confirming...' : 'Confirm Ride'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
