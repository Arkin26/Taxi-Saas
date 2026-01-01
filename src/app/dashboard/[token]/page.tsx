"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Car, Users, Wrench, DollarSign, Plus, UserPlus, ArrowLeft } from "lucide-react";

// Import your components
import DriverDetailsForm from "./sidebar-pages/driver";
import CabDetailsForm from "./sidebar-pages/cab";

// Bento Glow Effect Components
const DEFAULT_GLOW_COLOR = "255, 255, 0"; // Yellow glow
const DEFAULT_SPOTLIGHT_RADIUS = 300;

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius = DEFAULT_SPOTLIGHT_RADIUS
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const GlobalSpotlight = ({
  gridRef,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: {
  gridRef: React.RefObject<HTMLDivElement>;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}) => {
  useEffect(() => {
    if (!gridRef?.current || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const section =
        gridRef.current.closest(".bento-section") || gridRef.current;
      const rect = section.getBoundingClientRect();
      const mouseInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll(".bento-card");

      if (!mouseInside) {
        cards.forEach((card) => {
          (card as HTMLElement).style.setProperty("--glow-intensity", "0");
        });
        return;
      }

      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          card as HTMLElement,
          e.clientX,
          e.clientY,
          glowIntensity,
          spotlightRadius
        );
      });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll(".bento-card").forEach((card) => {
        (card as HTMLElement).style.setProperty("--glow-intensity", "0");
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [gridRef, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCard = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;

    // Set initial CSS properties
    element.style.setProperty("--glow-x", "50%");
    element.style.setProperty("--glow-y", "50%");
    element.style.setProperty("--glow-intensity", "0");
    element.style.setProperty("--glow-radius", "200px");

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt effect
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      element.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bento-card relative overflow-hidden transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default function DashboardPage() {
  const { token } = useParams();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard'); // Add state for page navigation
  const gridRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    console.log("🟢 Dashboard component mounted");
    console.log("🔍 Checking authentication...");

    // Check if user came from login
    const fromLogin = sessionStorage.getItem("fromLogin");
    const storedToken = sessionStorage.getItem("loginToken");

    console.log("📊 Auth Debug:", {
      fromLogin,
      storedToken,
      urlToken: token,
      tokensMatch: storedToken === token,
    });

    // More lenient check - either came from login OR has valid session
    if (fromLogin === "true" || storedToken === token) {
      console.log("✅ Authentication passed");
      setIsAllowed(true);

      // Only clear if came from login (preserve for page refreshes)
      if (fromLogin === "true") {
        console.log("🧹 Clearing login flags");
        sessionStorage.removeItem("fromLogin");
        // Keep loginToken for potential page refreshes
      }
    } else {
      console.log("❌ Authentication failed");
      console.log("🔄 Redirecting in 3 seconds...");

      // Longer delay to see what's happening
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    }

    setIsLoading(false);
  }, [token, router]);

  const handleAddDriver = () => {
    setCurrentPage('driver');
  };

  const handleAddCab = () => {
    setCurrentPage('cab');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">🔍 Checking authentication...</div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-4 text-red-800">
            ❌ Access Denied
          </h2>
          <p className="text-red-600 mb-4">
            You need to log in to access this dashboard.
          </p>
          <p className="text-sm text-red-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  // Render different pages based on state
  if (currentPage === 'driver') {
    return (
      <div>
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
        {/* Render the driver form */}
        <DriverDetailsForm />
      </div>
    );
  }

  if (currentPage === 'cab') {
    return (
      <div>
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
        {/* Render the cab form */}
        <CabDetailsForm />
      </div>
    );
  }

  // Default dashboard view
  return (
    <>
      <style jsx global>{`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 200px;
          --glow-color: ${DEFAULT_GLOW_COLOR};
          /* Add padding to accommodate scaling */
          padding: 20px;
        }

        /* External glow effect that appears outside the card */
        .bento-card::before {
          content: "";
          position: absolute;
          inset: -25px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.7)) 0%,
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.5)) 15%,
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 25%,
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.3)) 35%,
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.2)) 50%,
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.1)) 70%,
            transparent 90%
          );
          border-radius: calc(12px + 25px);
          pointer-events: none;
          opacity: calc(var(--glow-intensity));
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: -1;
        }

        /* Card base styling with smooth transitions */
        .bento-card {
          position: relative;
          background: white;
          z-index: 1;
          transform-origin: center;
          transform: scale(1) translateZ(0);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Enhanced hover effect */
        .bento-card:hover {
          transform: scale(1.08) translateZ(20px);
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        /* Enhanced glow on hover */
        .bento-card:hover::before {
          inset: -30px;
          opacity: calc(var(--glow-intensity) * 1.2);
        }

        /* Smooth transition for grid layout */
        .bento-section .grid {
          transition: all 0.3s ease;
        }

        /* Prevent layout shifts */
        .bento-section .grid > * {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Remove the inner border glow effect */
        .bento-card::after {
          display: none;
        }

        /* Special styling for action cards */
        .action-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-card:hover {
          transform: scale(1.08) translateZ(20px);
          background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
        }

        /* Different gradient for cab action card */
        .action-card.cab-card {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .action-card.cab-card:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
      `}</style>

      <GlobalSpotlight gridRef={gridRef} />

      <div ref={gridRef} className="bento-section space-y-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🚗 Fleet Management Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your fleet management system!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <BentoCard className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cars Busy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Car className="w-6 h-6 text-white" />
              </div>
            </div>
          </BentoCard>

          <BentoCard className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Available Cars
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Car className="w-6 h-6 text-white" />
              </div>
            </div>
          </BentoCard>

          <BentoCard className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Available Drivers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </BentoCard>

          <BentoCard className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Needs Maintenance
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <Wrench className="w-6 h-6 text-white" />
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BentoCard
              className="action-card rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
              onClick={handleAddDriver}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm font-medium">
                    Add New Driver
                  </p>
                  <p className="text-white text-lg font-semibold mt-1">
                    Register Driver
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-white/80 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                Click to add new driver
              </div>
            </BentoCard>

            <BentoCard
              className="action-card cab-card rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
              onClick={handleAddCab}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm font-medium">
                    Add New Vehicle
                  </p>
                  <p className="text-white text-lg font-semibold mt-1">
                    Register Cab
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Car className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-white/80 text-xs">
                <Plus className="w-4 h-4 mr-1" />
                Click to add new vehicle
              </div>
            </BentoCard>

            <BentoCard className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Schedule Maintenance</p>
                  <p className="text-xs">Coming Soon</p>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="w-full">
          <BentoCard className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Revenue Overview (2024)
            </h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              Revenue chart will be implemented here
            </div>
          </BentoCard>
        </div>
      </div>
    </>
  );
}