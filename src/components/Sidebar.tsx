
// "use client";
// import React, { useState } from "react";
// import {
//   Car,
//   Users,
//   Wrench,
//   Calendar,
//   FileText,
//   Settings,
//   Home,
//   AlertTriangle,
//   CreditCard,
//   Wallet,
//   MoreVertical,
//   LogOut,
//   User,
//   Clock, // Added for upcoming bookings
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useToken } from "@/app/dashboard/TokenContext";

// const menuItems = [
//   { id: "dashboard", label: "Dashboard", icon: Home, route: "" },
//   {
//     id: "schedule-booking",
//     label: "Schedule Booking",
//     icon: Calendar,
//     route: "schedule",
//   },
//   {
//     id: "upcoming-bookings", // Updated ID
//     label: "Upcoming Bookings",
//     icon: Clock, // Changed icon to Clock
//     route: "upcoming-bookings", // Updated route
//   },
//   {
//     id: "current-bookings",
//     label: "Ongoing Rides",
//     icon: Car,
//     route: "current-bookings",
//   },
//   {
//     id: "maintenance",
//     label: "Maintenance",
//     icon: Wrench,
//     route: "maintenance",
//   },
//   {
//     id: "pending-salaries",
//     label: "Pending Salaries",
//     icon: Wallet,
//     route: "pending-salaries",
//   },
//   {
//     id: "payment-reminders",
//     label: "Payment Reminders",
//     icon: CreditCard,
//     route: "payment-reminders",
//   },
//   {
//     id: "driver-licenses",
//     label: "Driver Licenses",
//     icon: FileText,
//     route: "driver-licenses",
//   },
//   {
//     id: "car-documents",
//     label: "Car Documents",
//     icon: FileText,
//     route: "car-documents",
//   },
//   {
//     id: "alerts",
//     label: "Alerts & Reminders",
//     icon: AlertTriangle,
//     route: "alerts",
//   },
//   {
//   label: "Payments",
//   icon: "💳",
//   href: `/dashboard/${token}/payments`
// }

// ];

// export const Sidebar = ({
//   activeView,
//   onViewChange,
//   onLogout,
// }: {
//   activeView: string;
//   onViewChange: (view: string) => void;
//   onLogout?: () => void;
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const token = useToken();
//   const router = useRouter();

//   if (!token) return null;

//   const handleNavigation = (item: (typeof menuItems)[0]) => {
//     onViewChange(item.id);
//     const baseRoute = `/dashboard/${token}`;
//     const fullRoute =
//       item.id === "dashboard" ? baseRoute : `${baseRoute}/${item.route}`;
//     router.push(fullRoute);
//   };

//   const handleLogout = () => {
//     setShowDropdown(false);
//     sessionStorage.clear();
//     router.push("/");
//   };

//   return (
//     <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
//       <div className="p-6 flex-shrink-0">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-2">
//             <Car className="w-8 h-8 text-blue-400" />
//             <h1 className="text-xl font-bold">FleetManager</h1>
//           </div>
//           <div className="relative">
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
//             >
//               <MoreVertical className="w-5 h-5 text-gray-300" />
//             </button>
//             {showDropdown && (
//               <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
//                 <div className="py-2">
//                   <button
//                     onClick={() => {
//                       setShowDropdown(false);
//                       router.push(`/dashboard/${token}/profile`);
//                     }}
//                     className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
//                   >
//                     <User className="w-4 h-4" />
//                     <span className="text-sm">Profile</span>
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowDropdown(false);
//                       router.push(`/dashboard/${token}/settings`);
//                     }}
//                     className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
//                   >
//                     <Settings className="w-4 h-4" />
//                     <span className="text-sm">Settings</span>
//                   </button>
//                   <hr className="my-2 border-gray-700" />
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:bg-gray-700 hover:text-red-300"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     <span className="text-sm">Logout</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 px-6 pb-6">
//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleNavigation(item)}
//               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
//                 activeView === item.id
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-300 hover:bg-gray-800 hover:text-white"
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span className="text-sm font-medium">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>

//       {showDropdown && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setShowDropdown(false)}
//         />
//       )}
//     </div>
//   );
// };

"use client";
import React, { useState } from "react";
import {
  Car,
  Users,
  Wrench,
  Calendar,
  FileText,
  Settings,
  Home,
  AlertTriangle,
  CreditCard,
  Wallet,
  MoreVertical,
  LogOut,
  User,
  Clock, // Added for upcoming bookings
  DollarSign, // Added for payments
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToken } from "@/app/dashboard/TokenContext";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, route: "" },
  {
    id: "schedule-booking",
    label: "Schedule Booking",
    icon: Calendar,
    route: "schedule",
  },
  {
    id: "upcoming-bookings", // Updated ID
    label: "Upcoming Bookings",
    icon: Clock, // Changed icon to Clock
    route: "upcoming-bookings", // Updated route
  },
  {
    id: "current-bookings",
    label: "Ongoing Rides",
    icon: Car,
    route: "current-bookings",
  },
  {
    id: "payments", // Added payments with proper structure
    label: "Payments",
    icon: DollarSign, // Using Lucide React icon
    route: "payments",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    route: "maintenance",
  },
  {
    id: "pending-salaries",
    label: "Pending Salaries",
    icon: Wallet,
    route: "pending-salaries",
  },
  {
    id: "payment-reminders",
    label: "Payment Reminders",
    icon: CreditCard,
    route: "payment-reminders",
  },
  {
    id: "driver-licenses",
    label: "Driver Licenses",
    icon: FileText,
    route: "driver-licenses",
  },
  {
    id: "car-documents",
    label: "Car Documents",
    icon: FileText,
    route: "car-documents",
  },
  {
    id: "alerts",
    label: "Alerts & Reminders",
    icon: AlertTriangle,
    route: "alerts",
  },
];

export const Sidebar = ({
  activeView,
  onViewChange,
  onLogout,
}: {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const token = useToken();
  const router = useRouter();

  if (!token) return null;

  const handleNavigation = (item: (typeof menuItems)[0]) => {
    onViewChange(item.id);
    const baseRoute = `/dashboard/${token}`;
    const fullRoute =
      item.id === "dashboard" ? baseRoute : `${baseRoute}/${item.route}`;
    router.push(fullRoute);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold">FleetManager</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-300" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push(`/dashboard/${token}/profile`);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push(`/dashboard/${token}/settings`);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:bg-gray-700 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};
