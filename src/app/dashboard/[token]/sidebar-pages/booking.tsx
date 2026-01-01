

// 'use client';
// import React, { useState, useEffect } from 'react';
// import {
//   Car,
//   User,
//   Phone,
//   MapPin,
//   Clock,
//   DollarSign,
//   Fuel,
//   Hash,
//   Loader2,
// } from 'lucide-react';

// /* ────────── Types ────────── */
// type Driver = { driverId: string; name: string; phone: string };
// type Cab = {
//   cabId: string;
//   type: string;
//   model: string;
//   fuelType: string;
//   numberPlate: string;
//   seatingCapacity: number;
// };

// /* ────────── Component ────────── */
// const CabBookingInterface: React.FC = () => {
//   /* ---------- state ---------- */
//   const [bookingType, setBookingType] =
//     useState<'LOCATION' | 'DURATION'>('LOCATION');
//   const [selectedDriver, setSelectedDriver] = useState('');
//   const [selectedCab, setSelectedCab] = useState('');
//   const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
//   const [availableCabs, setAvailableCabs] = useState<Cab[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     customerName: '',
//     customerPhone: '',
//     customerNumber: '',
//     pickupLocation: '',
//     dropLocation: '',
//     bookingDate: '',
//     bookingTime: '',
//     duration: '',
//     totalAmount: '',
//     advancePayment: '',
//     duePayment: '',
//   });

//   /* ---------- fetch drivers & cabs ---------- */
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch('/api/booking');
//         const data = await res.json();
//         if (data.success) {
//           setAvailableDrivers(data.drivers as Driver[]);
//           setAvailableCabs(data.cabs as Cab[]);
//         } else setError(data.error || 'Failed to load data');
//       } catch {
//         setError('Network error while loading data');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   /* ---------- handlers ---------- */
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));

//     if (name === 'totalAmount' || name === 'advancePayment') {
//       const total =
//         name === 'totalAmount'
//           ? parseFloat(value) || 0
//           : parseFloat(formData.totalAmount) || 0;
//       const adv =
//         name === 'advancePayment'
//           ? parseFloat(value) || 0
//           : parseFloat(formData.advancePayment) || 0;
//       setFormData((p) => ({ ...p, duePayment: `${Math.max(0, total - adv)}` }));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       customerName: '',
//       customerPhone: '',
//       customerNumber: '',
//       pickupLocation: '',
//       dropLocation: '',
//       bookingDate: '',
//       bookingTime: '',
//       duration: '',
//       totalAmount: '',
//       advancePayment: '',
//       duePayment: '',
//     });
//     setSelectedDriver('');
//     setSelectedCab('');
//   };

//   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     if (!selectedDriver || !selectedCab) return;

//     const payload = {
//       ...formData,
//       bookingType,
//       driverId: selectedDriver,
//       cabId: selectedCab,
//       bookingId: `BK${Date.now()}`,
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       setSubmitting(true);
//       const res = await fetch('/api/booking', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert('Booking created successfully!');
//         resetForm();
//         setAvailableDrivers((d) =>
//           d.filter((drv) => drv.driverId !== selectedDriver),
//         );
//         setAvailableCabs((c) => c.filter((cab) => cab.cabId !== selectedCab));
//       } else alert(`Error: ${data.error}`);
//     } catch {
//       alert('Network error while creating booking');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ---------- loading ---------- */
//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//       </div>
//     );

//   /* ---------- UI ---------- */
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold flex items-center text-gray-900 mb-2">
//             <Car className="mr-3 text-blue-600" />
//             Schedule New Booking
//           </h1>
//           <p className="text-gray-600">
//             Select available driver and cab, then fill booking details
//           </p>
//           {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
//         </div>

//         {/* drivers & cabs */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* drivers */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h2 className="text-xl font-semibold flex items-center mb-4">
//               <User className="mr-2 text-purple-600" />
//               Available Drivers ({availableDrivers.length})
//             </h2>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {availableDrivers.length === 0 ? (
//                 <p className="text-center text-gray-500 py-4">
//                   No drivers available
//                 </p>
//               ) : (
//                 availableDrivers.map((d) => (
//                   <div
//                     key={d.driverId}
//                     onClick={() => setSelectedDriver(d.driverId)}
//                     className={`p-4 rounded-lg border-2 cursor-pointer transition ${
//                       selectedDriver === d.driverId
//                         ? 'border-purple-500 bg-purple-50'
//                         : 'border-gray-200 hover:border-purple-300'
//                     }`}
//                   >
//                     <h3 className="font-semibold text-gray-800">{d.name}</h3>
//                     <p className="text-sm text-gray-600 flex items-center">
//                       <Hash className="w-3 h-3 mr-1" />
//                       {d.driverId}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center">
//                       <Phone className="w-3 h-3 mr-1" />
//                       {d.phone}
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* cabs */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h2 className="text-xl font-semibold flex items-center mb-4">
//               <Car className="mr-2 text-green-600" />
//               Available Cabs ({availableCabs.length})
//             </h2>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {availableCabs.length === 0 ? (
//                 <p className="text-center text-gray-500 py-4">
//                   No cabs available
//                 </p>
//               ) : (
//                 availableCabs.map((c) => (
//                   <div
//                     key={c.cabId}
//                     onClick={() => setSelectedCab(c.cabId)}
//                     className={`p-4 rounded-lg border-2 cursor-pointer transition ${
//                       selectedCab === c.cabId
//                         ? 'border-green-500 bg-green-50'
//                         : 'border-gray-200 hover:border-green-300'
//                     }`}
//                   >
//                     <div className="flex justify-between">
//                       <div>
//                         <h3 className="font-semibold text-gray-800">
//                           {c.model}
//                         </h3>
//                         <p className="text-sm text-gray-600 flex items-center">
//                           <Hash className="w-3 h-3 mr-1" />
//                           {c.cabId} • {c.type}
//                         </p>
//                         <p className="text-sm text-gray-600 flex items-center">
//                           <Fuel className="w-3 h-3 mr-1" />
//                           {c.fuelType}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-semibold text-blue-600">
//                           {c.numberPlate}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {c.seatingCapacity} seats
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* booking form */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">
//             Booking Details
//           </h2>

//           {/* booking type */}
//           <div className="mb-6">
//             <label className="block text-sm text-black font-medium mb-3">Booking Type</label>
//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={() => setBookingType('LOCATION')}
//                 className={`px-6 py-3 rounded-lg text-black font-medium ${
//                   bookingType === 'LOCATION'
//                     ? 'bg-blue-600 text-white shadow'
//                     : 'bg-gray-100 hover:bg-gray-200'
//                 }`}
//               >
//                 <MapPin className="inline w-4 h-4 mr-2" />
//                 Location
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setBookingType('DURATION')}
//                 className={`px-6 py-3 rounded-lg text-black font-medium ${
//                   bookingType === 'DURATION'
//                     ? 'bg-blue-600 text-white shadow'
//                     : 'bg-gray-100 hover:bg-gray-200'
//                 }`}
//               >
//                 <Clock className="inline w-4 h-4 mr-2" />
//                 Duration
//               </button>
//             </div>
//           </div>

//           {/* grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* customer */}
//             <div className="space-y-4">
//               <h3 className="font-medium text-black border-b pb-2">Customer Information</h3>

//               {[
//                 {
//                   name: 'customerName',
//                   label: 'Name',
//                   ph: 'Enter customer name',
//                 },
//                 {
//                   name: 'customerPhone',
//                   label: 'Phone',
//                   ph: '+91 XXXXXXXXXX',
//                 },
//                 {
//                   name: 'customerNumber',
//                   label: 'Customer Number',
//                   ph: 'Customer ID or alternate number',
//                 },
//               ].map((f) => (
//                 <div key={f.name}>
//                   <label className="block text-sm mb-2 text-black">{f.label}</label>
//                   <input
//                     name={f.name}
//                     value={(formData as any)[f.name]}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
//                     placeholder={f.ph}
//                     required
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* trip */}
//             <div className="space-y-4">
//               <h3 className="font-medium text-black border-b pb-2">Trip Information</h3>

//               {[
//                 {
//                   name: 'pickupLocation',
//                   label: 'Pickup Location',
//                   ph: 'Enter pickup address',
//                 },
//                 {
//                   name: 'dropLocation',
//                   label: 'Drop Location',
//                   ph: 'Enter drop address',
//                 },
//               ].map((f) => (
//                 <div key={f.name}>
//                   <label className="block text-black text-sm mb-2">{f.label}</label>
//                   <input
//                     name={f.name}
//                     value={(formData as any)[f.name]}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
//                     placeholder={f.ph}
//                     required
//                   />
//                 </div>
//               ))}

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-black text-sm mb-2">Date</label>
//                   <input
//                     type="date"
//                     name="bookingDate"
//                     value={formData.bookingDate}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-black text-sm mb-2">Time</label>
//                   <input
//                     type="time"
//                     name="bookingTime"
//                     value={formData.bookingTime}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
//                     required
//                   />
//                 </div>
//               </div>

//               {bookingType === 'DURATION' && (
//                 <div>
//                   <label className="block text-black text-sm mb-2">Duration (hrs)</label>
//                   <input
//                     type="number"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleInputChange}
//                     min={1}
//                     step={0.5}
//                     className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
//                     placeholder="Enter duration in hours"
//                     required
//                   />
//                 </div>
//               )}
//             </div>

//             {/* payment */}
//             <div className="md:col-span-2 space-y-4">
//               <h3 className="font-medium border-b pb-2 text-black">Payment Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {[
//                   {
//                     name: 'totalAmount',
//                     label: 'Total Amount (₹)',
//                     ph: '0.00',
//                   },
//                   {
//                     name: 'advancePayment',
//                     label: 'Advance Payment (₹)',
//                     ph: '0.00',
//                   },
//                 ].map((f) => (
//                   <div key={f.name}>
//                     <label className="block text-black text-sm mb-2">{f.label}</label>
//                     <input
//                       type="number"
//                       name={f.name}
//                       value={(formData as any)[f.name]}
//                       onChange={handleInputChange}
//                       min={0}
//                       className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
//                       placeholder={f.ph}
//                       required={f.name === 'totalAmount'}
//                     />
//                   </div>
//                 ))}
//                 <div>
//   <label className="block text-sm mb-2 text-black">
//     Due Payment (₹)
//   </label>
//   <input
//     type="number"
//     name="duePayment"
//     value={formData.duePayment}
//     /* ➊ make it editable → delete readOnly
//        ➋ show text in black, keep placeholder gray-500          */
//     onChange={handleInputChange}
//     className="w-full px-4 py-3 border rounded-lg
//                text-black placeholder-gray-500 bg-gray-50"
//     placeholder="0.00"
//   />
// </div>

//               </div>
//             </div>
//           </div>

//           {/* selected chips */}
//           {(selectedDriver || selectedCab) && (
//             <div className="mt-6 p-4 bg-blue-50 rounded">
//               <h4 className="font-medium mb-2 text-black">Selected Resources:</h4>
//               <div className="flex flex-wrap gap-2">
//                 {selectedDriver && (
//                   <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
//                     Driver:{' '}
//                     {availableDrivers.find((d) => d.driverId === selectedDriver)
//                       ?.name}{' '}
//                     ({selectedDriver})
//                   </span>
//                 )}
//                 {selectedCab && (
//                   <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                     Cab:{' '}
//                     {availableCabs.find((c) => c.cabId === selectedCab)?.model}{' '}
//                     ({selectedCab})
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* buttons */}
//           <div className="mt-8 flex justify-end gap-4">
//             <button
//               className="px-6 py-3 border text-black rounded-lg hover:bg-gray-50"
//               onClick={resetForm}
//               disabled={submitting}
//             >
//               Reset Form
//             </button>
//             <button
//               className="px-8 py-3 bg-blue-600 text-black rounded-lg hover:bg-green-500 disabled:bg-green flex items-center"
//               onClick={handleSubmit}
//               disabled={submitting || !selectedDriver || !selectedCab}
//             >
//               {submitting ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <DollarSign className="w-4 h-4 mr-2" />
//               )}
//               {submitting ? 'Creating...' : 'Create Booking'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CabBookingInterface;

'use client';
import React, { useState, useEffect } from 'react';
import {
  Car,
  User,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Fuel,
  Hash,
  Loader2,
  CreditCard,
  X,
  Save,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Zap,
} from 'lucide-react';

/* ────────── Types ────────── */
type Driver = { driverId: string; name: string; phone: string };
type Cab = {
  cabId: string;
  type: string;
  model: string;
  fuelType: string;
  numberPlate: string;
  seatingCapacity: number;
};

type PaymentDialogData = {
  amountPaid: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'OTHER';
  receivedBy: string;
  paymentType: 'ADVANCE' | 'PARTIAL' | 'FINAL' | 'REFUND';
  paymentDate: string;
  paymentTime: string;
  notes: string;
};

/* ────────── Component ────────── */
const CabBookingInterface: React.FC = () => {
  /* ---------- state ---------- */
  const [bookingType, setBookingType] = useState<'LOCATION' | 'DURATION'>('LOCATION');
  const [bookingMode, setBookingMode] = useState<'SCHEDULE' | 'IMMEDIATE' | null>(null);
  const [showBookingTypeSelection, setShowBookingTypeSelection] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedCab, setSelectedCab] = useState('');
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [availableCabs, setAvailableCabs] = useState<Cab[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerNumber: '',
    pickupLocation: '',
    dropLocation: '',
    bookingDate: '',
    bookingTime: '',
    duration: '',
    totalAmount: '',
    advancePayment: '',
    duePayment: '',
  });

  // Helper functions for date and time
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5);
  };

  const [paymentData, setPaymentData] = useState<PaymentDialogData>({
    amountPaid: 0,
    paymentMethod: 'CASH',
    receivedBy: '',
    paymentType: 'ADVANCE',
    paymentDate: getCurrentDate(),
    paymentTime: getCurrentTime(),
    notes: ''
  });

  /* ---------- fetch drivers & cabs ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/booking');
        const data = await res.json();
        if (data.success) {
          setAvailableDrivers(data.drivers as Driver[]);
          setAvailableCabs(data.cabs as Cab[]);
        } else setError(data.error || 'Failed to load data');
      } catch {
        setError('Network error while loading data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- handlers ---------- */
  const handleBookingTypeNext = () => {
    setShowBookingTypeSelection(false);
  };

  const handleBackToBookingType = () => {
    setShowBookingTypeSelection(true);
    setBookingMode(null);
  };

  const handleBookingModeSelect = (mode: 'SCHEDULE' | 'IMMEDIATE') => {
    setBookingMode(mode);
    
    // If immediate booking, set current date and time
    if (mode === 'IMMEDIATE') {
      setFormData(prev => ({
        ...prev,
        bookingDate: getCurrentDate(),
        bookingTime: getCurrentTime()
      }));
    } else {
      // Clear date/time for schedule booking
      setFormData(prev => ({
        ...prev,
        bookingDate: '',
        bookingTime: ''
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === 'totalAmount' || name === 'advancePayment') {
      const total =
        name === 'totalAmount'
          ? parseFloat(value) || 0
          : parseFloat(formData.totalAmount) || 0;
      const adv =
        name === 'advancePayment'
          ? parseFloat(value) || 0
          : parseFloat(formData.advancePayment) || 0;
      setFormData((p) => ({ ...p, duePayment: `${Math.max(0, total - adv)}` }));
    }
  };

  const handlePaymentDialogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: name === 'amountPaid' ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerNumber: '',
      pickupLocation: '',
      dropLocation: '',
      bookingDate: '',
      bookingTime: '',
      duration: '',
      totalAmount: '',
      advancePayment: '',
      duePayment: '',
    });
    setSelectedDriver('');
    setSelectedCab('');
    setBookingMode(null);
    setShowBookingTypeSelection(true);
    resetPaymentData();
  };

  const resetPaymentData = () => {
    setPaymentData({
      amountPaid: 0,
      paymentMethod: 'CASH',
      receivedBy: '',
      paymentType: 'ADVANCE',
      paymentDate: getCurrentDate(),
      paymentTime: getCurrentTime(),
      notes: ''
    });
  };

  const handleOpenPaymentDialog = () => {
    const advanceAmount = parseFloat(formData.advancePayment) || 0;
    setPaymentData(prev => ({
      ...prev,
      amountPaid: advanceAmount,
      paymentType: advanceAmount > 0 ? 'ADVANCE' : 'PARTIAL'
    }));
    setShowPaymentDialog(true);
  };

  const handleSavePaymentInfo = () => {
    setFormData(prev => ({
      ...prev,
      advancePayment: paymentData.amountPaid.toString(),
      duePayment: (parseFloat(prev.totalAmount || '0') - paymentData.amountPaid).toString()
    }));
    setShowPaymentDialog(false);
    alert('Payment information saved!');
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedDriver || !selectedCab) return;

    const payload = {
      ...formData,
      bookingType,
      bookingMode,
      driverId: selectedDriver,
      cabId: selectedCab,
      bookingId: `BK${Date.now()}`,
      createdAt: new Date().toISOString(),
      paymentInfo: paymentData.amountPaid > 0 ? paymentData : null
    };

    try {
      setSubmitting(true);
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${bookingMode === 'IMMEDIATE' ? 'Immediate' : 'Scheduled'} booking created successfully!`);
        resetForm();
        setAvailableDrivers((d) =>
          d.filter((drv) => drv.driverId !== selectedDriver),
        );
        setAvailableCabs((c) => c.filter((cab) => cab.cabId !== selectedCab));
      } else alert(`Error: ${data.error}`);
    } catch {
      alert('Network error while creating booking');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- loading ---------- */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center text-gray-900 mb-2">
            <Car className="mr-3 text-blue-600" />
            {bookingMode === 'SCHEDULE' ? 'Schedule New Booking' : 
             bookingMode === 'IMMEDIATE' ? 'Create Immediate Booking' :
             'New Booking'}
          </h1>
          <p className="text-gray-600">
            {showBookingTypeSelection ? 
              'Select booking type and scheduling preference' : 
              'Select available driver and cab, then fill booking details'}
          </p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Booking Type Selection Step */}
        {showBookingTypeSelection && (
          <div className="animate-in slide-in-from-right-5 duration-300">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
                Choose Your Booking Preferences
              </h2>

              {/* Booking Type Selection */}
              <div className="mb-8">
                <label className="block text-lg font-medium mb-4 text-gray-700">
                  Step 1: Select Booking Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBookingType('LOCATION')}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      bookingType === 'LOCATION'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className={`w-8 h-8 mx-auto mb-3 ${
                      bookingType === 'LOCATION' ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <h3 className="font-semibold text-lg mb-2">Location Based</h3>
                    <p className="text-sm text-gray-600">
                      Book for specific pickup and drop locations
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('DURATION')}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      bookingType === 'DURATION'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className={`w-8 h-8 mx-auto mb-3 ${
                      bookingType === 'DURATION' ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <h3 className="font-semibold text-lg mb-2">Duration Based</h3>
                    <p className="text-sm text-gray-600">
                      Book for a specific time duration
                    </p>
                  </button>
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleBookingTypeNext}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 font-medium"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Mode Selection Step */}
        {!showBookingTypeSelection && !bookingMode && (
          <div className="animate-in slide-in-from-right-5 duration-300">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={handleBackToBookingType}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Choose Scheduling Option
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleBookingModeSelect('SCHEDULE')}
                  className="p-8 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group"
                >
                  <Calendar className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Schedule Booking
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Plan your trip in advance by selecting a specific date and time
                  </p>
                  <div className="text-sm text-green-600 font-medium">
                    → You'll select date & time in the form
                  </div>
                </button>

                <button
                  onClick={() => handleBookingModeSelect('IMMEDIATE')}
                  className="p-8 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left group"
                >
                  <Zap className="w-12 h-12 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Create for Now
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Book immediately for current date and time
                  </p>
                  <div className="text-sm text-orange-600 font-medium">
                    → Uses current date & time automatically
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Booking Form */}
        {bookingMode && (
          <div className="animate-in slide-in-from-right-5 duration-300 space-y-8">
            {/* Back Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBookingMode(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded ${
                  bookingType === 'LOCATION' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {bookingType === 'LOCATION' ? 'Location Based' : 'Duration Based'}
                </span>
                <ArrowRight className="w-3 h-3" />
                <span className={`px-2 py-1 rounded ${
                  bookingMode === 'SCHEDULE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {bookingMode === 'SCHEDULE' ? 'Scheduled' : 'Immediate'}
                </span>
              </div>
            </div>

            {/* Immediate Booking Notice */}
            {bookingMode === 'IMMEDIATE' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Immediate Booking Mode</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  This booking will be created for today ({getCurrentDate()}) at {getCurrentTime()}
                </p>
              </div>
            )}

            {/* drivers & cabs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* drivers */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold flex items-center mb-4">
                  <User className="mr-2 text-purple-600" />
                  Available Drivers ({availableDrivers.length})
                </h2>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {availableDrivers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      No drivers available
                    </p>
                  ) : (
                    availableDrivers.map((d) => (
                      <div
                        key={d.driverId}
                        onClick={() => setSelectedDriver(d.driverId)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedDriver === d.driverId
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-800">{d.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Hash className="w-3 h-3 mr-1" />
                          {d.driverId}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {d.phone}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* cabs */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold flex items-center mb-4">
                  <Car className="mr-2 text-green-600" />
                  Available Cabs ({availableCabs.length})
                </h2>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {availableCabs.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      No cabs available
                    </p>
                  ) : (
                    availableCabs.map((c) => (
                      <div
                        key={c.cabId}
                        onClick={() => setSelectedCab(c.cabId)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedCab === c.cabId
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {c.model}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Hash className="w-3 h-3 mr-1" />
                              {c.cabId} • {c.type}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Fuel className="w-3 h-3 mr-1" />
                              {c.fuelType}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-blue-600">
                              {c.numberPlate}
                            </p>
                            <p className="text-sm text-gray-600">
                              {c.seatingCapacity} seats
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* booking form */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Booking Details
              </h2>

              {/* grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* customer */}
                <div className="space-y-4">
                  <h3 className="font-medium text-black border-b pb-2">Customer Information</h3>

                  {[
                    {
                      name: 'customerName',
                      label: 'Name',
                      ph: 'Enter customer name',
                    },
                    {
                      name: 'customerPhone',
                      label: 'Phone',
                      ph: '+91 XXXXXXXXXX',
                    },
                    {
                      name: 'customerNumber',
                      label: 'Customer Number',
                      ph: 'Customer ID or alternate number',
                    },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm mb-2 text-black">{f.label}</label>
                      <input
                        name={f.name}
                        value={(formData as any)[f.name]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
                        placeholder={f.ph}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* trip */}
                <div className="space-y-4">
                  <h3 className="font-medium text-black border-b pb-2">Trip Information</h3>

                  {[
                    {
                      name: 'pickupLocation',
                      label: 'Pickup Location',
                      ph: 'Enter pickup address',
                    },
                    {
                      name: 'dropLocation',
                      label: 'Drop Location',
                      ph: 'Enter drop address',
                    },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-black text-sm mb-2">{f.label}</label>
                      <input
                        name={f.name}
                        value={(formData as any)[f.name]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
                        placeholder={f.ph}
                        required
                      />
                    </div>
                  ))}

                  {/* Date/Time - Only show for scheduled bookings */}
                  {bookingMode === 'SCHEDULE' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-black text-sm mb-2">Date</label>
                        <input
                          type="date"
                          name="bookingDate"
                          value={formData.bookingDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-black text-sm mb-2">Time</label>
                        <input
                          type="time"
                          name="bookingTime"
                          value={formData.bookingTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Show current date/time for immediate booking */}
                  {bookingMode === 'IMMEDIATE' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-black text-sm mb-2">Date (Auto-set)</label>
                        <input
                          type="date"
                          value={formData.bookingDate}
                          className="w-full px-4 py-3 border rounded-lg text-black bg-gray-100"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-black text-sm mb-2">Time (Auto-set)</label>
                        <input
                          type="time"
                          value={formData.bookingTime}
                          className="w-full px-4 py-3 border rounded-lg text-black bg-gray-100"
                          disabled
                        />
                      </div>
                    </div>
                  )}

                  {bookingType === 'DURATION' && (
                    <div>
                      <label className="block text-black text-sm mb-2">Duration (hrs)</label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min={1}
                        step={0.5}
                        className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
                        placeholder="Enter duration in hours"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* payment */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-medium text-black">Payment Information</h3>
                    <button
                      type="button"
                      onClick={handleOpenPaymentDialog}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Payment Details
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        name: 'totalAmount',
                        label: 'Total Amount (₹)',
                        ph: '0.00',
                      },
                      {
                        name: 'advancePayment',
                        label: 'Advance Payment (₹)',
                        ph: '0.00',
                      },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-black text-sm mb-2">{f.label}</label>
                        <input
                          type="number"
                          name={f.name}
                          value={(formData as any)[f.name]}
                          onChange={handleInputChange}
                          min={0}
                          className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500"
                          placeholder={f.ph}
                          required={f.name === 'totalAmount'}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm mb-2 text-black">
                        Due Payment (₹)
                      </label>
                      <input
                        type="number"
                        name="duePayment"
                        value={formData.duePayment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500 bg-gray-50"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Payment Info Display */}
                  {paymentData.amountPaid > 0 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">Payment Details Added:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-600">Amount: </span>
                          <span className="font-medium">₹{paymentData.amountPaid}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Method: </span>
                          <span className="font-medium">{paymentData.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Type: </span>
                          <span className="font-medium">{paymentData.paymentType}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Received By: </span>
                          <span className="font-medium">{paymentData.receivedBy || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* selected chips */}
              {(selectedDriver || selectedCab) && (
                <div className="mt-6 p-4 bg-blue-50 rounded">
                  <h4 className="font-medium mb-2 text-black">Selected Resources:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDriver && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Driver:{' '}
                        {availableDrivers.find((d) => d.driverId === selectedDriver)?.name}{' '}
                        ({selectedDriver})
                      </span>
                    )}
                    {selectedCab && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Cab:{' '}
                        {availableCabs.find((c) => c.cabId === selectedCab)?.model}{' '}
                        ({selectedCab})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  className="px-6 py-3 border text-black rounded-lg hover:bg-gray-50"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Reset Form
                </button>
                <button
                  className={`px-8 py-3 text-white rounded-lg flex items-center ${
                    bookingMode === 'IMMEDIATE' 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } disabled:bg-gray-400`}
                  onClick={handleSubmit}
                  disabled={submitting || !selectedDriver || !selectedCab}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : bookingMode === 'IMMEDIATE' ? (
                    <Zap className="w-4 h-4 mr-2" />
                  ) : (
                    <Calendar className="w-4 h-4 mr-2" />
                  )}
                  {submitting ? 'Creating...' : 
                   bookingMode === 'IMMEDIATE' ? 'Create Now' : 'Schedule Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPaymentDialog(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">
                Payment Information
              </h2>
              <p className="text-gray-600">Enter payment details for this booking</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSavePaymentInfo(); }} className="space-y-6">
              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  min="0"
                  step="0.01"
                  value={paymentData.amountPaid}
                  onChange={handlePaymentDialogChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentDialogChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Received By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Received By *
                </label>
                <input
                  type="text"
                  name="receivedBy"
                  value={paymentData.receivedBy}
                  onChange={handlePaymentDialogChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter staff/driver name or ID"
                  required
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type *
                </label>
                <select
                  name="paymentType"
                  value={paymentData.paymentType}
                  onChange={handlePaymentDialogChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="ADVANCE">Advance</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="FINAL">Final</option>
                  <option value="REFUND">Refund</option>
                </select>
              </div>

              {/* Payment Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={paymentData.paymentDate}
                    onChange={handlePaymentDialogChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Time *
                  </label>
                  <input
                    type="time"
                    name="paymentTime"
                    value={paymentData.paymentTime}
                    onChange={handlePaymentDialogChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={paymentData.notes}
                  onChange={handlePaymentDialogChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any additional notes about the payment..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {paymentData.notes.length}/500 characters
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentDialog(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Payment Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabBookingInterface;
