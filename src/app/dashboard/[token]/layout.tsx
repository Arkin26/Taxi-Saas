
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { Sidebar } from '@/components/Sidebar';
// import { TokenProvider } from '@/app/dashboard/TokenContext';

// export default function DashboardLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ token: string }>;
// }) {
//   // Use React.use() to properly unwrap the Promise
//   const resolvedParams = React.use(params);
  
//   // Initialize token from resolved params
//   const [token, setToken] = useState<string | null>(() =>
//     resolvedParams?.token ?? null
//   );

//   // Update token if resolvedParams changes
//   useEffect(() => {
//     if (resolvedParams?.token) {
//       setToken(resolvedParams.token);
//     }
//   }, [resolvedParams]);

//   // Call every hook unconditionally (avoids hook-order error)
//   const router = useRouter();
//   const pathname = usePathname();

//   const initialView = () => {
//     const parts = pathname.split('/').filter(Boolean);
//     return parts.length > 2 ? parts.at(-1)! : 'dashboard';
//   };
  
//   const [activeView, setActiveView] = useState(initialView);

//   // Show a lightweight fallback until token resolves
//   if (!token) {
//     return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
//   }

//   const handleViewChange = (view: string) => {
//     setActiveView(view);
//     router.push(
//       view === 'dashboard'
//         ? `/dashboard/${token}`
//         : `/dashboard/${token}/${view}`,
//     );
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     router.push('/');
//   };

//   return (
//     <TokenProvider token={token}>
//       <div className="min-h-screen flex bg-gray-50">
//         <Sidebar
//           activeView={activeView}
//           onViewChange={handleViewChange}
//           onLogout={handleLogout}
//         />
//         <main className="ml-64 flex-1 p-6 overflow-auto">{children}</main>
//       </div>
//     </TokenProvider>
//   );
// }

//if below code causes problems use the abofve code instead
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TokenProvider } from "@/app/dashboard/TokenContext";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Wait for component to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Unwrap params only after mounting
  useEffect(() => {
    if (!mounted) return;
    
    params.then((resolvedParams) => {
      if (resolvedParams?.token) {
        setToken(resolvedParams.token);
      }
    });
  }, [mounted, params]);

  // Authentication check on mount & token change
  useEffect(() => {
    if (!mounted || !token) return;

    const fromLogin = sessionStorage.getItem("fromLogin");
    const storedToken = sessionStorage.getItem("loginToken");

    const authorized = fromLogin === "true" || storedToken === token;

    if (authorized) {
      setIsAllowed(true);
      if (fromLogin === "true") sessionStorage.removeItem("fromLogin");
    } else {
      setIsAllowed(false);
      router.replace("/"); // redirect unauthorized users to home
    }
  }, [mounted, token, router]);

  // Handle initial view for sidebar navigation
  const initialView = () => {
    if (!pathname) return "dashboard";
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 2 ? parts.at(-1)! : "dashboard";
  };

  const [activeView, setActiveView] = useState(initialView);

  // Show loader while mounting, checking auth, or token resolving
  if (!mounted || !token || isAllowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  // Block rendering for unauthorized users
  if (isAllowed === false) {
    return null;
  }

  const handleViewChange = (view: string) => {
    setActiveView(view);
    router.push(
      view === "dashboard"
        ? `/dashboard/${token}`
        : `/dashboard/${token}/${view}`
    );
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    router.push("/");
  };

  return (
    <TokenProvider token={token}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
        />
        <main className="ml-64 flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </TokenProvider>
  );
}