
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Dialog } from '@headlessui/react';
// import { Eye, EyeOff } from 'lucide-react';
// import axios from 'axios';

// interface LoginModalProps {
//   onClose: () => void;
// }

// export default function LoginModal({ onClose }: LoginModalProps) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [token, setToken] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const handleLogin = async () => {
//     setError('');
//     console.log('🔵 Login attempt started');
    
//     try {
//       const res = await axios.post('/api/login', {
//         username: username.trim(),
//         password: password.trim(),
//         token: token.trim(),
//       });

//       console.log('🔵 Login API response:', res.data);

//       if (res.data.success) {
//         console.log('🔵 Login successful, setting sessionStorage');
        
//         // Store login state in sessionStorage before navigating
//         sessionStorage.setItem('fromLogin', 'true');
//         sessionStorage.setItem('loginToken', token.trim());
        
//         // Verify storage was set
//         console.log('🔵 SessionStorage set:', {
//           fromLogin: sessionStorage.getItem('fromLogin'),
//           loginToken: sessionStorage.getItem('loginToken')
//         });
        
//         onClose();
        
//         const dashboardUrl = `/dashboard/${token.trim()}`;
//         console.log('🔵 Navigating to:', dashboardUrl);
        
//         // Navigate to dashboard
//         router.push(dashboardUrl);
        
//         console.log('🔵 Navigation command sent');
//       } else {
//         console.log('🔴 Login failed:', res.data.message);
//         setError(res.data.message || 'Invalid credentials');
//       }
//     } catch (err: any) {
//       console.log('🔴 Login error:', err);
//       setError(err?.response?.data?.message || 'Something went wrong');
//     }
//   };

//   return (
//     <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4">
//         <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
//           <Dialog.Title className="text-lg font-semibold text-black">Login to Your Account</Dialog.Title>

//           <div className="space-y-3">
//             <input
//               type="text"
//               placeholder="Username"
//               className="w-full px-4 py-2 border rounded-md text-black"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Password"
//                 className="w-full px-4 py-2 border rounded-md text-black pr-10"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-2 flex items-center text-gray-500"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             <input
//               type="text"
//               placeholder="Company Token"
//               className="w-full px-4 py-2 border rounded-md text-black"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <div className="flex justify-end space-x-2">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleLogin}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
//             >
//               Login
//             </button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    console.log('🔵 Login attempt started');
    
    try {
      const res = await axios.post('/api/login', {
        username: username.trim(),
        password: password.trim(),
        token: token.trim(),
      });

      console.log('🔵 Login API response:', res.data);

      if (res.data.success) {
        console.log('🔵 Login successful, setting sessionStorage');
        
        // Store login state in sessionStorage before navigating
        sessionStorage.setItem('fromLogin', 'true');
        sessionStorage.setItem('loginToken', token.trim());
        
        // Verify storage was set
        console.log('🔵 SessionStorage set:', {
          fromLogin: sessionStorage.getItem('fromLogin'),
          loginToken: sessionStorage.getItem('loginToken')
        });
        
        onClose();
        
        const dashboardUrl = `/dashboard/${token.trim()}`;
        console.log('🔵 Navigating to:', dashboardUrl);
        
        // Navigate to dashboard
        router.push(dashboardUrl);
        
        console.log('🔵 Navigation command sent');
      } else {
        console.log('🔴 Login failed:', res.data.message);
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      console.log('🔴 Login error:', err);
      setError(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      {/* Backdrop with blur effect */}
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-md transition-all duration-300" />
      
      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <DialogPanel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 transform transition-all duration-300 scale-100">
          <DialogTitle className="text-lg font-semibold text-black">Login to Your Account</DialogTitle>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md text-black pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <input
              type="text"
              placeholder="Company Token"
              className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Login
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
