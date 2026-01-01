// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';

// // Updated interface to match your simplified payment route
// interface Payment {
//   _id?: any;
//   paymentId: string;
//   bookingId: string;
//   customerName: string;  // ✅ Changed from clientName to customerName
//   amountPaid: number;
//   paymentMethod: string;
//   paymentDate: Date;
//   paymentTime: string;
//   paymentType: 'ADVANCE' | 'TRIP_COMPLETION';  // ✅ Updated to match your route
//   notes?: string;
//   createdAt?: Date;
// }

// interface GroupedPayment {
//   bookingId: string;
//   customerName: string;  // ✅ Changed from clientName to customerName
//   totalPaidAmount: number;
//   payments: Payment[];
//   overallStatus: 'PENDING' | 'PARTIAL' | 'COMPLETED';
//   lastPaymentDate: Date;
// }

// // Updated interface to match your simplified payment route summary
// interface PaymentSummary {
//   totalPayments: number;
//   totalAdvancePayments: number;
//   totalTripCompletionPayments: number;
//   totalAmount: number;
// }

// const PaymentsPage = () => {
//   const { token } = useParams();
//   const [allPayments, setAllPayments] = useState<Payment[]>([]);
//   const [groupedPayments, setGroupedPayments] = useState<GroupedPayment[]>([]);
//   const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedGroup, setSelectedGroup] = useState<GroupedPayment | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [filter, setFilter] = useState<'all' | 'advance' | 'trip_completion'>('all');
//   const [searchClient, setSearchClient] = useState('');

//   useEffect(() => {
//     fetchAllPayments();
//   }, [token, filter, searchClient]);

//   const fetchAllPayments = async () => {
//     try {
//       setLoading(true);
      
//       // Build query parameters
//       const params = new URLSearchParams({
//         all: 'true',
//         ...(searchClient && { customerName: searchClient })
//       });
      
//       const url = `/api/payments?${params}`;
//       console.log('=== PAYMENTS PAGE DEBUG ===');
//       console.log('Fetching payments from:', url);
      
//       const response = await fetch(url);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Raw API Response:', data);
        
//         // Log the structure of the first few payments
//         if (data.payments && data.payments.length > 0) {
//           console.log('First payment structure:', data.payments[0]);
//           console.log('Payment types found:', [...new Set(data.payments.map((p: Payment) => p.paymentType))]);
//           console.log('Customer names found:', [...new Set(data.payments.map((p: Payment) => p.customerName))]);
//         }
        
//         let filteredPayments = data.payments || [];
        
//         // Apply client-side filtering based on payment type
//         if (filter !== 'all') {
//           filteredPayments = filteredPayments.filter((payment: Payment) => 
//             payment.paymentType.toLowerCase().replace('_', '_') === filter
//           );
//         }
        
//         setAllPayments(filteredPayments);
//         setPaymentSummary(data.summary);
//         groupPaymentsByBooking(filteredPayments);
//       } else {
//         const errorText = await response.text();
//         console.error('API Error:', response.status, errorText);
//       }
      
//     } catch (error) {
//       console.error('Fetch Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const groupPaymentsByBooking = (payments: Payment[]) => {
//     const grouped = payments.reduce((acc: { [key: string]: GroupedPayment }, payment) => {
//       const { bookingId } = payment;
      
//       if (!acc[bookingId]) {
//         acc[bookingId] = {
//           bookingId,
//           customerName: payment.customerName || 'Unknown Customer',
//           totalPaidAmount: 0,
//           payments: [],
//           overallStatus: 'PENDING',
//           lastPaymentDate: payment.paymentDate
//         };
//       }
      
//       acc[bookingId].payments.push(payment);
//       acc[bookingId].totalPaidAmount += payment.amountPaid;
      
//       // Update last payment date
//       if (new Date(payment.paymentDate) > new Date(acc[bookingId].lastPaymentDate)) {
//         acc[bookingId].lastPaymentDate = payment.paymentDate;
//       }
      
//       return acc;
//     }, {});

//     // Determine overall status for each booking
//     Object.values(grouped).forEach((group) => {
//       if (group.totalPaidAmount > 0) {
//         // Since we don't have remaining amount info in simplified structure,
//         // we'll mark as PARTIAL if there are payments
//         group.overallStatus = 'PARTIAL';
//       } else {
//         group.overallStatus = 'PENDING';
//       }
//     });

//     const groupedArray = Object.values(grouped).sort(
//       (a, b) => new Date(b.lastPaymentDate).getTime() - new Date(a.lastPaymentDate).getTime()
//     );
    
//     setGroupedPayments(groupedArray);
//   };

//   const openPaymentDetails = (group: GroupedPayment) => {
//     setSelectedGroup(group);
//     setIsDialogOpen(true);
//   };

//   const closeDialog = () => {
//     setIsDialogOpen(false);
//     setSelectedGroup(null);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'COMPLETED': return 'bg-green-100 text-green-800';
//       case 'PARTIAL': return 'bg-yellow-100 text-yellow-800';
//       case 'PENDING': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getPaymentMethodIcon = (method: string) => {
//     switch (method?.toUpperCase()) {
//       case 'CASH': return '💵';
//       case 'UPI': return '📱';
//       case 'CARD': return '💳';
//       case 'NET_BANKING': return '🌐';
//       case 'WALLET': return '👛';
//       default: return '💰';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header with Summary */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">💳 Payment Management</h1>
//         <p className="text-gray-600 mb-4">Track and manage all payment transactions</p>
        
//         {/* Payment Summary Cards */}
//         {paymentSummary && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-500">Total Amount</p>
//               <p className="text-2xl font-bold text-green-600">₹{paymentSummary.totalAmount.toLocaleString()}</p>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-500">Advance Payments</p>
//               <p className="text-2xl font-bold text-blue-600">₹{paymentSummary.totalAdvancePayments.toLocaleString()}</p>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-500">Trip Completion</p>
//               <p className="text-2xl font-bold text-purple-600">₹{paymentSummary.totalTripCompletionPayments.toLocaleString()}</p>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-500">Total Payments</p>
//               <p className="text-2xl font-bold text-gray-800">{paymentSummary.totalPayments}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Search and Filter Controls */}
//       <div className="mb-6 flex flex-col md:flex-row gap-4">
//         {/* Search */}
//         <div className="flex-1">
//           <input
//             type="text"
//             placeholder="Search by customer name..."
//             value={searchClient}
//             onChange={(e) => setSearchClient(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
        
//         {/* Filter Tabs */}
//         <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
//           {[
//             { key: 'all', label: 'All' },
//             { key: 'advance', label: 'Advance' },
//             { key: 'trip_completion', label: 'Trip Completion' }
//           ].map((filterOption) => (
//             <button
//               key={filterOption.key}
//               onClick={() => setFilter(filterOption.key as any)}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 filter === filterOption.key
//                   ? 'bg-blue-500 text-white shadow-sm'
//                   : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
//               }`}
//             >
//               {filterOption.label}
//               <span className="ml-2 text-xs bg-black/10 px-2 py-1 rounded-full">
//                 {filterOption.key === 'all' 
//                   ? groupedPayments.length 
//                   : groupedPayments.filter(g => 
//                       g.payments.some(p => p.paymentType.toLowerCase().replace('_', '_') === filterOption.key)
//                     ).length
//                 }
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Payment Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {groupedPayments.length === 0 ? (
//           <div className="col-span-full text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">💳</div>
//             <h3 className="text-lg font-medium text-gray-600 mb-2">No payments found</h3>
//             <p className="text-gray-500">No payment records match your current filter.</p>
//           </div>
//         ) : (
//           groupedPayments.map((group) => (
//             <div
//               key={group.bookingId}
//               onClick={() => openPaymentDetails(group)}
//               className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer p-6"
//             >
//               {/* Booking ID Header */}
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="font-semibold text-gray-800 text-sm">
//                     Booking: {group.bookingId.slice(-8).toUpperCase()}
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {group.payments.length} payment{group.payments.length !== 1 ? 's' : ''}
//                   </p>
//                 </div>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.overallStatus)}`}>
//                   {group.overallStatus}
//                 </span>
//               </div>

//               {/* Customer Info */}
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600 mb-1">Customer</p>
//                 <p className="font-medium text-gray-800">{group.customerName}</p>
//               </div>

//               {/* Amount Info */}
//               <div className="mb-4">
//                 <p className="text-xs text-gray-500">Total Paid</p>
//                 <p className="font-bold text-lg text-green-600">₹{group.totalPaidAmount}</p>
//               </div>

//               {/* Payment Types */}
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {[...new Set(group.payments.map(p => p.paymentType))].map((type, index) => {
//                   const typeTotal = group.payments
//                     .filter(p => p.paymentType === type)
//                     .reduce((sum, p) => sum + p.amountPaid, 0);
                  
//                   return (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
//                     >
//                       {type === 'ADVANCE' ? '💰' : '✅'} {type.replace('_', ' ')} ₹{typeTotal}
//                     </span>
//                   );
//                 })}
//               </div>

//               {/* Click indicator */}
//               <div className="pt-4 border-t border-gray-100">
//                 <p className="text-xs text-gray-400 flex items-center">
//                   Click for details <span className="ml-1">→</span>
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Payment Details Dialog */}
//       {isDialogOpen && selectedGroup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Dialog Header */}
//             <div className="sticky top-0 bg-white border-b p-6 rounded-t-xl">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     Payment History - {selectedGroup.bookingId}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Customer: {selectedGroup.customerName}
//                   </p>
//                 </div>
//                 <button
//                   onClick={closeDialog}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* Dialog Content */}
//             <div className="p-6">
//               {/* Status Badge */}
//               <div className="mb-6">
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGroup.overallStatus)}`}>
//                   {selectedGroup.overallStatus}
//                 </span>
//               </div>

//               {/* Summary */}
//               <div className="mb-8 p-4 bg-gray-50 rounded-lg">
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Total Paid Amount</p>
//                   <p className="font-bold text-2xl text-green-600">₹{selectedGroup.totalPaidAmount}</p>
//                 </div>
//               </div>

//               {/* Individual Payments */}
//               <div className="mb-6">
//                 <h3 className="font-semibold text-gray-800 mb-4">Payment History</h3>
//                 <div className="space-y-4">
//                   {selectedGroup.payments.map((payment, index) => (
//                     <div key={payment.paymentId} className="bg-white border rounded-lg p-4 shadow-sm">
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
//                             {index + 1}
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-gray-800">
//                               {payment.paymentType.replace('_', ' ')} Payment
//                             </h4>
//                             <p className="text-sm text-gray-500">
//                               {payment.paymentId}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-lg text-gray-800">₹{payment.amountPaid}</p>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
//                         <div>
//                           <p className="text-gray-500">Method</p>
//                           <p className="font-medium flex items-center">
//                             {getPaymentMethodIcon(payment.paymentMethod)} {payment.paymentMethod}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Type</p>
//                           <p className="font-medium">{payment.paymentType.replace('_', ' ')}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Date</p>
//                           <p className="font-medium">
//                             {new Date(payment.paymentDate).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Time</p>
//                           <p className="font-medium">{payment.paymentTime}</p>
//                         </div>
//                       </div>

//                       {payment.notes && (
//                         <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">Notes:</span> {payment.notes}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex space-x-3 pt-4 border-t">
//                 <button
//                   onClick={closeDialog}
//                   className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentsPage;

// works for advance payments^^

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Updated interface to match your simplified payment route
interface Payment {
  _id?: any;
  paymentId: string;
  bookingId: string;
  customerName: string;  // ✅ Changed from clientName to customerName
  amountPaid: number;
  paymentMethod: string;
  paymentDate: Date;
  paymentTime: string;
  paymentType: 'ADVANCE' | 'FINAL';  // ✅ Updated to match your route
  notes?: string;
  createdAt?: Date;
}

interface GroupedPayment {
  bookingId: string;
  customerName: string;  // ✅ Changed from clientName to customerName
  totalPaidAmount: number;
  payments: Payment[];
  overallStatus: 'PENDING' | 'PARTIAL' | 'COMPLETED';
  lastPaymentDate: Date;
}

// Updated interface to match your simplified payment route summary
interface PaymentSummary {
  totalPayments: number;
  totalAdvancePayments: number;
  totalFinalPayments: number;      // ✅ Changed from totalTripCompletionPayments
  totalAmount: number;
}

const PaymentsPage = () => {
  const { token } = useParams();
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [groupedPayments, setGroupedPayments] = useState<GroupedPayment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<GroupedPayment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'advance' | 'final'>('all');
  const [searchClient, setSearchClient] = useState('');

  useEffect(() => {
    fetchAllPayments();
  }, [token, filter, searchClient]);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        all: 'true',
        ...(searchClient && { customerName: searchClient })
      });
      
      const url = `/api/payments?${params}`;
      console.log('=== PAYMENTS PAGE DEBUG ===');
      console.log('Fetching payments from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw API Response:', data);
        console.log('Summary structure:', data.summary);
        
        // Log the structure of the first few payments
        if (data.payments && data.payments.length > 0) {
          console.log('First payment structure:', data.payments[0]);
          console.log('Payment types found:', [...new Set(data.payments.map((p: Payment) => p.paymentType))]);
          console.log('Customer names found:', [...new Set(data.payments.map((p: Payment) => p.customerName))]);
        }
        
        let filteredPayments = data.payments || [];
        
        // Apply client-side filtering based on payment type
        if (filter !== 'all') {
          filteredPayments = filteredPayments.filter((payment: Payment) => 
            payment.paymentType.toLowerCase() === filter.toUpperCase()
          );
        }
        
        setAllPayments(filteredPayments);
        setPaymentSummary(data.summary);
        groupPaymentsByBooking(filteredPayments);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
      }
      
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupPaymentsByBooking = (payments: Payment[]) => {
    const grouped = payments.reduce((acc: { [key: string]: GroupedPayment }, payment) => {
      const { bookingId } = payment;
      
      if (!acc[bookingId]) {
        acc[bookingId] = {
          bookingId,
          customerName: payment.customerName || 'Unknown Customer',
          totalPaidAmount: 0,
          payments: [],
          overallStatus: 'PENDING',
          lastPaymentDate: payment.paymentDate
        };
      }
      
      acc[bookingId].payments.push(payment);
      acc[bookingId].totalPaidAmount += payment.amountPaid;
      
      // Update last payment date
      if (new Date(payment.paymentDate) > new Date(acc[bookingId].lastPaymentDate)) {
        acc[bookingId].lastPaymentDate = payment.paymentDate;
      }
      
      return acc;
    }, {});

    // Determine overall status for each booking
    Object.values(grouped).forEach((group) => {
      const hasAdvance = group.payments.some(p => p.paymentType === 'ADVANCE');
      const hasFinal = group.payments.some(p => p.paymentType === 'FINAL');
      
      if (hasAdvance && hasFinal) {
        group.overallStatus = 'COMPLETED';
      } else if (hasAdvance || hasFinal) {
        group.overallStatus = 'PARTIAL';
      } else {
        group.overallStatus = 'PENDING';
      }
    });

    const groupedArray = Object.values(grouped).sort(
      (a, b) => new Date(b.lastPaymentDate).getTime() - new Date(a.lastPaymentDate).getTime()
    );
    
    setGroupedPayments(groupedArray);
  };

  const openPaymentDetails = (group: GroupedPayment) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedGroup(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'ADVANCE': return 'bg-blue-100 text-blue-800';
      case 'FINAL': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'CASH': return '💵';
      case 'UPI': return '📱';
      case 'CARD': return '💳';
      case 'NET_BANKING': return '🌐';
      case 'WALLET': return '👛';
      default: return '💰';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Summary */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">💳 Payment Management</h1>
        <p className="text-gray-600 mb-4">Track and manage all payment transactions</p>
        
        {/* Payment Summary Cards */}
        {paymentSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{paymentSummary.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Advance Payments</p>
              <p className="text-2xl font-bold text-blue-600">₹{paymentSummary.totalAdvancePayments.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Final Payments</p>
              <p className="text-2xl font-bold text-purple-600">₹{paymentSummary.totalFinalPayments.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-2xl font-bold text-gray-800">{paymentSummary.totalPayments}</p>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {[
            { key: 'all', label: 'All' },
            { key: 'advance', label: 'Advance' },
            { key: 'final', label: 'Final' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === filterOption.key
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {filterOption.label}
              <span className="ml-2 text-xs bg-black/10 px-2 py-1 rounded-full">
                {filterOption.key === 'all' 
                  ? groupedPayments.length 
                  : groupedPayments.filter(g => 
                      g.payments.some(p => p.paymentType.toLowerCase() === filterOption.key.toUpperCase())
                    ).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupedPayments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No payments found</h3>
            <p className="text-gray-500">No payment records match your current filter.</p>
          </div>
        ) : (
          groupedPayments.map((group) => (
            <div
              key={group.bookingId}
              onClick={() => openPaymentDetails(group)}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer p-6"
            >
              {/* Booking ID Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Booking: {group.bookingId.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {group.payments.length} payment{group.payments.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.overallStatus)}`}>
                  {group.overallStatus}
                </span>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-medium text-gray-800">{group.customerName}</p>
              </div>

              {/* Amount Info */}
              <div className="mb-4">
                <p className="text-xs text-gray-500">Total Paid</p>
                <p className="font-bold text-lg text-green-600">₹{group.totalPaidAmount.toLocaleString()}</p>
              </div>

              {/* Payment Types */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[...new Set(group.payments.map(p => p.paymentType))].map((type, index) => {
                  const typeTotal = group.payments
                    .filter(p => p.paymentType === type)
                    .reduce((sum, p) => sum + p.amountPaid, 0);
                  
                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(type)}`}
                    >
                      {type === 'ADVANCE' ? '💰' : '✅'} {type} ₹{typeTotal.toLocaleString()}
                    </span>
                  );
                })}
              </div>

              {/* Payment Methods Preview */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[...new Set(group.payments.map(p => p.paymentMethod))].map((method, index) => {
                  const methodTotal = group.payments
                    .filter(p => p.paymentMethod === method)
                    .reduce((sum, p) => sum + p.amountPaid, 0);
                  
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {getPaymentMethodIcon(method)} {method} ₹{methodTotal.toLocaleString()}
                    </span>
                  );
                })}
              </div>

              {/* Click indicator */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 flex items-center">
                  Click for details <span className="ml-1">→</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Details Dialog */}
      {isDialogOpen && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Payment History - {selectedGroup.bookingId}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Customer: {selectedGroup.customerName}
                  </p>
                </div>
                <button
                  onClick={closeDialog}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              {/* Status Badge */}
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGroup.overallStatus)}`}>
                  {selectedGroup.overallStatus}
                </span>
              </div>

              {/* Summary */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Paid Amount</p>
                  <p className="font-bold text-2xl text-green-600">₹{selectedGroup.totalPaidAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Individual Payments */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Payment History</h3>
                <div className="space-y-4">
                  {selectedGroup.payments.map((payment, index) => (
                    <div key={payment.paymentId} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            payment.paymentType === 'ADVANCE' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {payment.paymentType === 'ADVANCE' ? '💰' : '✅'}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {payment.paymentType} Payment
                            </h4>
                            <p className="text-sm text-gray-500">
                              {payment.paymentId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-800">₹{payment.amountPaid.toLocaleString()}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.paymentType)}`}>
                            {payment.paymentType}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-500">Method</p>
                          <p className="font-medium flex items-center">
                            {getPaymentMethodIcon(payment.paymentMethod)} {payment.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time</p>
                          <p className="font-medium">{payment.paymentTime}</p>
                        </div>
                      </div>

                      {payment.notes && (
                        <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {payment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
