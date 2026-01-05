
// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Car, Hash, Loader2, User, X, MapPin, Calendar, CreditCard, History, CheckCircle, StopCircle, AlertTriangle } from 'lucide-react';

// type Booking = {
//   _id: string;
//   bookingId: string;
//   bookingType: 'LOCATION' | 'DURATION';
//   cabId: string;
//   cabModel: string;
//   licensePlate: string;
//   driverId: string;
//   driverName: string;
//   pickupLocation: string;
//   dropLocation: string;
//   bookingDate: string;
//   bookingTime: string;
//   totalAmount: number;
//   advancePayment: number;
//   duePayment: number;
// };

// type Payment = {
//   _id: string;
//   paymentId: string;
//   bookingId: string;
//   amountPaid: number;
//   remainingAmount: number;
//   paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'OTHER';
//   paymentDate: string;
//   paymentTime: string;
//   paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
//   paymentSequence: number;
//   receivedBy: string;
//   paymentType: 'ADVANCE' | 'PARTIAL' | 'FINAL' | 'REFUND';
//   totalBookingAmount: number;
//   notes?: string;
//   createdAt: string;
// };

// type FinalPaymentForm = {
//   isPaymentReceived: boolean;
//   paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'OTHER';
//   receivedBy: string;
// };

// export default function CurrentBookings() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [endRideLoading, setEndRideLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [modal, setModal] = useState<Booking | null>(null);
//   const [showPaymentHistory, setShowPaymentHistory] = useState(false);
//   const [showEndRideDialog, setShowEndRideDialog] = useState(false);

//   const [finalPaymentForm, setFinalPaymentForm] = useState<FinalPaymentForm>({
//     isPaymentReceived: false,
//     paymentMethod: 'CASH',
//     receivedBy: ''
//   });

//   // Fetch bookings
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('/api/current-bookings');
//         const data = await res.json();
//         if (data.success) setBookings(data.bookings);
//         else setError(data.error || 'Failed to load bookings');
//       } catch {
//         setError('Network error');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Fetch payment history when modal opens
//   useEffect(() => {
//     if (modal) {
//       fetchPaymentHistory(modal.bookingId);
//     }
//   }, [modal]);

//   const fetchPaymentHistory = async (bookingId: string) => {
//     try {
//       const res = await fetch(`/api/payments?bookingId=${bookingId}`);
//       const data = await res.json();
//       if (data.success) {
//         setPayments(data.payments || []);
//       }
//     } catch (error) {
//       console.error('Failed to fetch payment history:', error);
//     }
//   };

//   const handleEndRideClick = () => {
//     if (!modal) return;
    
//     // Reset the final payment form
//     setFinalPaymentForm({
//       isPaymentReceived: modal.duePayment > 0 ? false : true, // If no due payment, mark as received
//       paymentMethod: 'CASH',
//       receivedBy: ''
//     });
    
//     setShowEndRideDialog(true);
//   };

//   const handleConfirmEndRide = async () => {
//     if (!modal) return;

//     setEndRideLoading(true);
    
//     try {
//       // If there's a due payment and it was received, record it first
//       if (modal.duePayment > 0 && finalPaymentForm.isPaymentReceived) {
//         console.log('Recording final payment before ending ride...');
        
//         const finalPaymentData = {
//           bookingId: modal.bookingId,
//           finalPaymentAmount: modal.duePayment,
//           paymentMethod: finalPaymentForm.paymentMethod,
//           receivedBy: finalPaymentForm.receivedBy,
//           isRideCompletion: true
//         };

//         const paymentRes = await fetch('/api/payments', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(finalPaymentData)
//         });

//         if (!paymentRes.ok) {
//           const paymentError = await paymentRes.json();
//           throw new Error(paymentError.error || 'Failed to record final payment');
//         }

//         console.log('Final payment recorded successfully');
//       }

//       // Now end the ride
//       const requestData = {
//         bookingId: modal.bookingId,
//         driverId: modal.driverId,
//         cabId: modal.cabId,
//         finalPaymentStatus: modal.duePayment > 0 ? 
//           (finalPaymentForm.isPaymentReceived ? 'COMPLETED' : 'PENDING') : 'COMPLETED'
//       };

//       console.log('Ending ride with data:', requestData);

//       const res = await fetch('/api/end-ride', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestData)
//       });

//       const data = await res.json();
      
//       if (data.success) {
//         // Remove the booking from the list
//         const updatedBookings = bookings.filter(b => b.bookingId !== modal.bookingId);
//         setBookings(updatedBookings);
        
//         const paymentMessage = modal.duePayment > 0 ? 
//           (finalPaymentForm.isPaymentReceived ? 
//             ' Final payment recorded.' : 
//             ' Payment marked as pending.') : '';
        
//         alert(`Ride ended successfully!${paymentMessage} Driver and cab are now available.`);
//         handleModalClose();
//       } else {
//         console.error('End ride failed:', data);
//         alert(`Failed to end ride: ${data.error || 'Unknown error'}`);
//       }
//     } catch (error) {
//       console.error('End ride error:', error);
//       alert(`Error: ${error instanceof Error ? error.message : 'Network error occurred'}`);
//     } finally {
//       setEndRideLoading(false);
//       setShowEndRideDialog(false);
//     }
//   };

//   const handleModalClose = () => {
//     setModal(null);
//     setShowPaymentHistory(false);
//     setShowEndRideDialog(false);
//     setPayments([]);
//     setFinalPaymentForm({
//       isPaymentReceived: false,
//       paymentMethod: 'CASH',
//       receivedBy: ''
//     });
//   };

//   const getPaymentTypeColor = (type: string) => {
//     switch (type) {
//       case 'ADVANCE': return 'text-blue-600 bg-blue-100';
//       case 'PARTIAL': return 'text-orange-600 bg-orange-100';
//       case 'FINAL': return 'text-green-600 bg-green-100';
//       case 'REFUND': return 'text-red-600 bg-red-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
//           <Car className="mr-3 text-blue-600" />
//           Ongoing Rides
//         </h1>

//         {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

//         {bookings.length === 0 ? (
//           <p className="text-gray-600">No bookings found.</p>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {bookings.map((b) => (
//               <div
//                 key={b._id}
//                 onClick={() => setModal(b)}
//                 className="cursor-pointer bg-white rounded-xl shadow p-6 border hover:border-blue-500 transition"
//               >
//                 <div className="space-y-4">
//                   <div>
//                     <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booking ID</span>
//                     <p className="text-sm font-medium text-blue-600 mt-1">#{b.bookingId}</p>
//                   </div>
                  
//                   <div>
//                     <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Car Model</span>
//                     <h3 className="font-semibold text-black text-lg mt-1">{b.cabModel}</h3>
//                   </div>

//                   <div>
//                     <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cab ID</span>
//                     <p className="text-sm font-medium text-gray-800 mt-1 flex items-center">
//                       <Hash className="w-3 h-3 mr-1" />
//                       {b.cabId}
//                     </p>
//                   </div>

//                   <div>
//                     <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">License Plate</span>
//                     <p className="text-sm font-medium text-gray-800 mt-1">{b.licensePlate}</p>
//                   </div>

//                   <div>
//                     <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Driver</span>
//                     <p className="text-sm font-medium text-gray-800 mt-1 flex items-center">
//                       <User className="w-3 h-3 mr-1" />
//                       {b.driverName}
//                     </p>
//                     <p className="text-xs text-gray-600 ml-4">ID: {b.driverId}</p>
//                   </div>

//                   {/* Due Payment Indicator */}
//                   {b.duePayment > 0 && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-2">
//                       <span className="text-xs font-medium text-red-600">Due Amount: ₹{b.duePayment.toFixed(2)}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Enhanced Modal Dialog */}
//       {modal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={handleModalClose}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Header */}
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-black mb-2">
//                 Booking Details
//               </h2>
//               <p className="text-blue-600 font-medium">#{modal.bookingId}</p>
//             </div>

//             {!showPaymentHistory ? (
//               <>
//                 {/* Vehicle Information */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
//                     <Car className="w-5 h-5 mr-2 text-blue-600" />
//                     Vehicle Information
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Model:</span>
//                       <span className="font-medium text-black">{modal.cabModel}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Cab ID:</span>
//                       <span className="font-medium text-black">{modal.cabId}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">License Plate:</span>
//                       <span className="font-medium text-black">{modal.licensePlate}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Driver Information */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
//                     <User className="w-5 h-5 mr-2 text-green-600" />
//                     Driver Information
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium text-black">{modal.driverName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Driver ID:</span>
//                       <span className="font-medium text-black">{modal.driverId}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Trip Information */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
//                     <MapPin className="w-5 h-5 mr-2 text-purple-600" />
//                     Trip Information
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Type:</span>
//                       <span className="font-medium text-black">{modal.bookingType}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Pickup:</span>
//                       <p className="font-medium text-black mt-1">{modal.pickupLocation}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Drop:</span>
//                       <p className="font-medium text-black mt-1">{modal.dropLocation}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Schedule Information */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
//                     <Calendar className="w-5 h-5 mr-2 text-orange-600" />
//                     Schedule
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Date:</span>
//                       <span className="font-medium text-black">{modal.bookingDate.slice(0,10)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Time:</span>
//                       <span className="font-medium text-black">{modal.bookingTime}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Information */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
//                     <CreditCard className="w-5 h-5 mr-2 text-red-600" />
//                     Payment Details
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Total Amount:</span>
//                       <span className="font-bold text-black">₹{modal.totalAmount.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Advance Paid:</span>
//                       <span className="font-medium text-green-600">₹{modal.advancePayment.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Due Amount:</span>
//                       <span className="font-medium text-red-600">₹{modal.duePayment.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between space-x-3">
//                   <button
//                     onClick={() => setShowPaymentHistory(true)}
//                     className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
//                   >
//                     <History className="w-4 h-4 mr-2" />
//                     Payment History ({payments.length})
//                   </button>
                  
//                   <button
//                     onClick={handleEndRideClick}
//                     disabled={endRideLoading}
//                     className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
//                   >
//                     {endRideLoading ? (
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     ) : (
//                       <StopCircle className="w-4 h-4 mr-2" />
//                     )}
//                     {endRideLoading ? 'Ending...' : 'End Ride'}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               /* Payment History */
//               <div>
//                 <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
//                   <History className="w-5 h-5 mr-2 text-gray-600" />
//                   Payment History
//                 </h3>

//                 {payments.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     No payment records found
//                   </div>
//                 ) : (
//                   <div className="space-y-4 max-h-96 overflow-y-auto">
//                     {payments.map((payment) => (
//                       <div key={payment._id} className="bg-gray-50 rounded-lg p-4 border">
//                         <div className="flex justify-between items-start mb-3">
//                           <div>
//                             <h4 className="font-semibold text-gray-900">Payment #{payment.paymentSequence}</h4>
//                             <p className="text-xs text-gray-500">{payment.paymentId}</p>
//                           </div>
//                           <div className="text-right">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.paymentType)}`}>
//                               {payment.paymentType}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <span className="text-gray-600">Amount Paid:</span>
//                             <p className="font-bold text-green-600">₹{payment.amountPaid.toFixed(2)}</p>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Remaining:</span>
//                             <p className="font-medium">₹{payment.remainingAmount.toFixed(2)}</p>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Method:</span>
//                             <p className="font-medium">{payment.paymentMethod}</p>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Status:</span>
//                             <p className={`font-medium ${payment.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>
//                               {payment.paymentStatus}
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Received By:</span>
//                             <p className="font-medium">{payment.receivedBy}</p>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Date & Time:</span>
//                             <p className="font-medium">
//                               {new Date(payment.paymentDate).toLocaleDateString('en-IN')} {payment.paymentTime}
//                             </p>
//                           </div>
//                         </div>

//                         {payment.notes && (
//                           <div className="mt-3 pt-3 border-t border-gray-200">
//                             <span className="text-gray-600 text-sm">Notes:</span>
//                             <p className="text-sm font-medium text-gray-800 mt-1">{payment.notes}</p>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="flex justify-end mt-6">
//                   <button
//                     onClick={() => setShowPaymentHistory(false)}
//                     className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Back to Details
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* End Ride Dialog with Payment Collection */}
//       {showEndRideDialog && modal && (
//         <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
//             <div className="flex items-center mb-4">
//               <StopCircle className="w-6 h-6 text-red-600 mr-3" />
//               <h3 className="text-lg font-semibold text-gray-900">End Ride</h3>
//             </div>
            
//             <div className="mb-6">
//               <p className="text-gray-600 mb-4">
//                 Booking ID: <span className="font-medium">#{modal.bookingId}</span>
//               </p>
              
//               {modal.duePayment > 0 ? (
//                 <div className="space-y-4">
//                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                     <div className="flex items-center mb-2">
//                       <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
//                       <span className="font-medium text-yellow-800">Payment Pending</span>
//                     </div>
//                     <p className="text-yellow-800 text-sm mb-3">
//                       Due Amount: <span className="font-bold">₹{modal.duePayment.toFixed(2)}</span>
//                     </p>
                    
//                     {/* Payment Received Checkbox */}
//                     <div className="mb-4">
//                       <label className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={finalPaymentForm.isPaymentReceived}
//                           onChange={(e) => setFinalPaymentForm(prev => ({
//                             ...prev,
//                             isPaymentReceived: e.target.checked
//                           }))}
//                           className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <span className="text-sm font-medium text-gray-900">
//                           Payment has been received
//                         </span>
//                       </label>
//                     </div>
                    
//                     {/* Payment Details (only if payment received) */}
//                     {finalPaymentForm.isPaymentReceived && (
//                       <div className="space-y-3 border-t border-yellow-200 pt-3">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Payment Method
//                           </label>
//                           <select
//                             value={finalPaymentForm.paymentMethod}
//                             onChange={(e) => setFinalPaymentForm(prev => ({
//                               ...prev,
//                               paymentMethod: e.target.value as FinalPaymentForm['paymentMethod']
//                             }))}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                           >
//                             <option value="CASH">Cash</option>
//                             <option value="CARD">Card</option>
//                             <option value="UPI">UPI</option>
//                             <option value="NET_BANKING">Net Banking</option>
//                             <option value="OTHER">Other</option>
//                           </select>
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Received By
//                           </label>
//                           <input
//                             type="text"
//                             value={finalPaymentForm.receivedBy}
//                             onChange={(e) => setFinalPaymentForm(prev => ({
//                               ...prev,
//                               receivedBy: e.target.value
//                             }))}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                             placeholder="Driver name or staff ID"
//                             required={finalPaymentForm.isPaymentReceived}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//                   <div className="flex items-center">
//                     <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//                     <span className="text-green-800 text-sm font-medium">
//                       All payments completed
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowEndRideDialog(false)}
//                 className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmEndRide}
//                 disabled={endRideLoading || (modal.duePayment > 0 && finalPaymentForm.isPaymentReceived && !finalPaymentForm.receivedBy)}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg flex items-center transition-colors"
//               >
//                 {endRideLoading ? (
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 ) : (
//                   <StopCircle className="w-4 h-4 mr-2" />
//                 )}
//                 {endRideLoading ? 'Ending Ride...' : 'End Ride'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import React, { useEffect, useState } from 'react';
import { Car, Hash, Loader2, User, X, MapPin, Calendar, CreditCard, History, CheckCircle, StopCircle, AlertTriangle } from 'lucide-react';

type Booking = {
  _id: string;
  bookingId: string;
  bookingType: 'LOCATION' | 'DURATION';
  cabId: string;
  cabModel: string;
  licensePlate: string;
  driverId: string;
  driverName: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  bookingTime: string;
  totalAmount: number;
  advancePayment: number;
  duePayment: number;
};

type Payment = {
  _id: string;
  paymentId: string;
  bookingId: string;
  amountPaid: number;
  remainingAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'OTHER';
  paymentDate: string;
  paymentTime: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentSequence: number;
  receivedBy: string;
  paymentType: 'ADVANCE' | 'PARTIAL' | 'FINAL' | 'REFUND';
  totalBookingAmount: number;
  notes?: string;
  createdAt: string;
};

type FinalPaymentForm = {
  isPaymentReceived: boolean;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'OTHER';
  receivedBy: string;
};

export default function CurrentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [endRideLoading, setEndRideLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<Booking | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showEndRideDialog, setShowEndRideDialog] = useState(false);

  const [finalPaymentForm, setFinalPaymentForm] = useState<FinalPaymentForm>({
    isPaymentReceived: false,
    paymentMethod: 'CASH',
    receivedBy: ''
  });

  // Fetch bookings
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/current-bookings');
        const data = await res.json();
        if (data.success) setBookings(data.bookings);
        else setError(data.error || 'Failed to load bookings');
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch payment history when modal opens
  useEffect(() => {
    if (modal) {
      fetchPaymentHistory(modal.bookingId);
    }
  }, [modal]);

  const fetchPaymentHistory = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/payments?bookingId=${bookingId}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    }
  };

  const handleEndRideClick = () => {
    if (!modal) return;
    
    // Reset the final payment form
    setFinalPaymentForm({
      isPaymentReceived: Number(modal.duePayment) > 0 ? false : true, // If no due payment, mark as received
      paymentMethod: 'CASH',
      receivedBy: ''
    });
    
    setShowEndRideDialog(true);
  };

  const handleConfirmEndRide = async () => {
    if (!modal) return;

    setEndRideLoading(true);
    
    try {
      // If there's a due payment and it was received, record it first
      if (Number(modal.duePayment) > 0 && finalPaymentForm.isPaymentReceived) {
        console.log('Recording final payment before ending ride...');
        
        const finalPaymentData = {
          bookingId: modal.bookingId,
          finalPaymentAmount: modal.duePayment,
          paymentMethod: finalPaymentForm.paymentMethod,
          receivedBy: finalPaymentForm.receivedBy,
          isRideCompletion: true
        };

        const paymentRes = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPaymentData)
        });

        if (!paymentRes.ok) {
          const paymentError = await paymentRes.json();
          throw new Error(paymentError.error || 'Failed to record final payment');
        }

        console.log('Final payment recorded successfully');
      }

      // Now end the ride
      const requestData = {
        bookingId: modal.bookingId,
        driverId: modal.driverId,
        cabId: modal.cabId,
        finalPaymentStatus: Number(modal.duePayment) > 0 ? 
          (finalPaymentForm.isPaymentReceived ? 'COMPLETED' : 'PENDING') : 'COMPLETED'
      };

      console.log('Ending ride with data:', requestData);

      const res = await fetch('/api/end-ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await res.json();
      
      if (data.success) {
        // Remove the booking from the list
        const updatedBookings = bookings.filter(b => b.bookingId !== modal.bookingId);
        setBookings(updatedBookings);
        
        const paymentMessage = Number(modal.duePayment) > 0 ? 
          (finalPaymentForm.isPaymentReceived ? 
            ' Final payment recorded.' : 
            ' Payment marked as pending.') : '';
        
        alert(`Ride ended successfully!${paymentMessage} Driver and cab are now available.`);
        handleModalClose();
      } else {
        console.error('End ride failed:', data);
        alert(`Failed to end ride: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('End ride error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Network error occurred'}`);
    } finally {
      setEndRideLoading(false);
      setShowEndRideDialog(false);
    }
  };

  const handleModalClose = () => {
    setModal(null);
    setShowPaymentHistory(false);
    setShowEndRideDialog(false);
    setPayments([]);
    setFinalPaymentForm({
      isPaymentReceived: false,
      paymentMethod: 'CASH',
      receivedBy: ''
    });
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'ADVANCE': return 'text-blue-600 bg-blue-100';
      case 'PARTIAL': return 'text-orange-600 bg-orange-100';
      case 'FINAL': return 'text-green-600 bg-green-100';
      case 'REFUND': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Car className="mr-3 text-blue-600" />
          Ongoing Rides
        </h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((b) => (
              <div
                key={b._id}
                onClick={() => setModal(b)}
                className="cursor-pointer bg-white rounded-xl shadow p-6 border hover:border-blue-500 transition"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booking ID</span>
                    <p className="text-sm font-medium text-blue-600 mt-1">#{b.bookingId}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Car Model</span>
                    <h3 className="font-semibold text-black text-lg mt-1">{b.cabModel}</h3>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cab ID</span>
                    <p className="text-sm font-medium text-gray-800 mt-1 flex items-center">
                      <Hash className="w-3 h-3 mr-1" />
                      {b.cabId}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">License Plate</span>
                    <p className="text-sm font-medium text-gray-800 mt-1">{b.licensePlate}</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Driver</span>
                    <p className="text-sm font-medium text-gray-800 mt-1 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {b.driverName}
                    </p>
                    <p className="text-xs text-gray-600 ml-4">ID: {b.driverId}</p>
                  </div>

                  {/* Due Payment Indicator */}
                  {Number(b.duePayment) > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <span className="text-xs font-medium text-red-600">Due Amount: ₹{Number(b.duePayment).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal Dialog */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">
                Booking Details
              </h2>
              <p className="text-blue-600 font-medium">#{modal.bookingId}</p>
            </div>

            {!showPaymentHistory ? (
              <>
                {/* Vehicle Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <Car className="w-5 h-5 mr-2 text-blue-600" />
                    Vehicle Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium text-black">{modal.cabModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cab ID:</span>
                      <span className="font-medium text-black">{modal.cabId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Plate:</span>
                      <span className="font-medium text-black">{modal.licensePlate}</span>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Driver Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-black">{modal.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver ID:</span>
                      <span className="font-medium text-black">{modal.driverId}</span>
                    </div>
                  </div>
                </div>

                {/* Trip Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                    Trip Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-black">{modal.bookingType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Pickup:</span>
                      <p className="font-medium text-black mt-1">{modal.pickupLocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Drop:</span>
                      <p className="font-medium text-black mt-1">{modal.dropLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    Schedule
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-black">{modal.bookingDate.slice(0,10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-black">{modal.bookingTime}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-red-600" />
                    Payment Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-black">₹{Number(modal.totalAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Advance Paid:</span>
                      <span className="font-medium text-green-600">₹{Number(modal.advancePayment).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Amount:</span>
                      <span className="font-medium text-red-600">₹{Number(modal.duePayment).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between space-x-3">
                  <button
                    onClick={() => setShowPaymentHistory(true)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Payment History ({payments.length})
                  </button>
                  
                  <button
                    onClick={handleEndRideClick}
                    disabled={endRideLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                  >
                    {endRideLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <StopCircle className="w-4 h-4 mr-2" />
                    )}
                    {endRideLoading ? 'Ending...' : 'End Ride'}
                  </button>
                </div>
              </>
            ) : (
              /* Payment History */
              <div>
                <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
                  <History className="w-5 h-5 mr-2 text-gray-600" />
                  Payment History
                </h3>

                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payment records found
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {payments.map((payment) => (
                      <div key={payment._id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">Payment #{payment.paymentSequence}</h4>
                            <p className="text-xs text-gray-500">{payment.paymentId}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.paymentType)}`}>
                              {payment.paymentType}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Amount Paid:</span>
                            <p className="font-bold text-green-600">₹{Number(payment.amountPaid).toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Remaining:</span>
                            <p className="font-medium">₹{Number(payment.remainingAmount).toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Method:</span>
                            <p className="font-medium">{payment.paymentMethod}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <p className={`font-medium ${payment.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>
                              {payment.paymentStatus}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Received By:</span>
                            <p className="font-medium">{payment.receivedBy}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Date & Time:</span>
                            <p className="font-medium">
                              {new Date(payment.paymentDate).toLocaleDateString('en-IN')} {payment.paymentTime}
                            </p>
                          </div>
                        </div>

                        {payment.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-gray-600 text-sm">Notes:</span>
                            <p className="text-sm font-medium text-gray-800 mt-1">{payment.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowPaymentHistory(false)}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* End Ride Dialog with Payment Collection */}
      {showEndRideDialog && modal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <div className="flex items-center mb-4">
              <StopCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">End Ride</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Booking ID: <span className="font-medium">#{modal.bookingId}</span>
              </p>
              
              {Number(modal.duePayment) > 0 ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="font-medium text-yellow-800">Payment Pending</span>
                    </div>
                    <p className="text-yellow-800 text-sm mb-3">
                      Due Amount: <span className="font-bold">₹{Number(modal.duePayment).toFixed(2)}</span>
                    </p>
                    
                    {/* Payment Received Checkbox */}
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={finalPaymentForm.isPaymentReceived}
                          onChange={(e) => setFinalPaymentForm(prev => ({
                            ...prev,
                            isPaymentReceived: e.target.checked
                          }))}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          Payment has been received
                        </span>
                      </label>
                    </div>
                    
                    {/* Payment Details (only if payment received) */}
                    {finalPaymentForm.isPaymentReceived && (
                      <div className="space-y-3 border-t border-yellow-200 pt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method
                          </label>
                          <select
                            value={finalPaymentForm.paymentMethod}
                            onChange={(e) => setFinalPaymentForm(prev => ({
                              ...prev,
                              paymentMethod: e.target.value as FinalPaymentForm['paymentMethod']
                            }))}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="CASH">Cash</option>
                            <option value="CARD">Card</option>
                            <option value="UPI">UPI</option>
                            <option value="NET_BANKING">Net Banking</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Received By
                          </label>
                          <input
                            type="text"
                            value={finalPaymentForm.receivedBy}
                            onChange={(e) => setFinalPaymentForm(prev => ({
                              ...prev,
                              receivedBy: e.target.value
                            }))}
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Driver name or staff ID"
                            required={finalPaymentForm.isPaymentReceived}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 text-sm font-medium">
                      All payments completed
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEndRideDialog(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEndRide}
                disabled={endRideLoading || (Number(modal.duePayment) > 0 && finalPaymentForm.isPaymentReceived && !finalPaymentForm.receivedBy)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg flex items-center transition-colors"
              >
                {endRideLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <StopCircle className="w-4 h-4 mr-2" />
                )}
                {endRideLoading ? 'Ending Ride...' : 'End Ride'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
