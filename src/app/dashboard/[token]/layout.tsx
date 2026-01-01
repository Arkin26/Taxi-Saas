
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
  // Unwrap the async params
  const resolvedParams = React.use(params);

  // Token state initialized from params
  const [token, setToken] = useState<string | null>(
    () => resolvedParams?.token ?? null
  );

  // Auth check state: null = loading, true = allowed, false = blocked
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Update token if params changes
  useEffect(() => {
    if (resolvedParams?.token) {
      setToken(resolvedParams.token);
    }
  }, [resolvedParams]);

  // Authentication check on mount & token change
  useEffect(() => {
    if (!token) return;

    const fromLogin = sessionStorage.getItem("fromLogin");
    const storedToken = sessionStorage.getItem("loginToken");

    const authorized = fromLogin === "true" || storedToken === token;

    if (authorized) {
      setIsAllowed(true);
      if (fromLogin === "true") sessionStorage.removeItem("fromLogin");
    } else {
      setIsAllowed(false);
      router.replace("/home"); // redirect unauthorized users to /home
    }
  }, [token, router]);

  // Handle initial view for sidebar navigation
  const initialView = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 2 ? parts.at(-1)! : "dashboard";
  };

  const [activeView, setActiveView] = useState(initialView);

  // Show loader while checking auth or token resolving
  if (!token || isAllowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
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
