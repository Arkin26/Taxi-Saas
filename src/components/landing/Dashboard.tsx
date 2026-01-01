"use client";

import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
  const [isZoomed, setIsZoomed] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsZoomed(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (dashboardRef.current) observer.observe(dashboardRef.current);
    return () => observer.disconnect();
  }, []);

  const sidebarFeatures = [
    "Dashboard",
    "Schedule Booking", 
    "Upcoming Bookings",
    "Ongoing Rides",
    "Payments",
    "Maintenance",
    "Pending Salaries",
    "Payment Reminders",
    "Driver Licenses",
    "Car Documents",
    "Alerts & Reminders"
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(217, 119, 6, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: 50%;
      top: 50%;
      width: 20px;
      height: 20px;
      margin-left: -10px;
      margin-top: -10px;
      pointer-events: none;
    `;
    e.currentTarget.style.position = 'relative';
    e.currentTarget.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-8px) scale(0.95)';
    setTimeout(() => {
      card.style.transform = '';
    }, 200);
  };

  return (
    <>
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.1;
          }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .gradient-text {
          background: linear-gradient(90deg, #ffffff, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          z-index: 10;
        }
        .card-icon-hover:hover {
          transform: rotate(5deg) scale(1.1);
        }
        .sweep-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.1), transparent);
          transition: left 0.6s ease;
        }
        .sweep-effect:hover::before {
          left: 100%;
        }
        .nav-hover:hover {
          transform: translateX(4px);
        }
        .pulse-bg::before {
          content: '';
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(217, 119, 6, 0.2), transparent);
          border-radius: 50%;
          animation: pulse 4s ease-in-out infinite;
        }
        .rotate-bg::after {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, transparent, rgba(217, 119, 6, 0.05), transparent);
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }
      `}</style>

      <section
        ref={dashboardRef}
        id="dashboard"
        style={{ backgroundColor: "rgba(249, 249, 249, 0.9)", minHeight: "100vh" }}
        className="flex items-center justify-center py-0 px-0 pb-20"
      >
        <div
          className={`transition-transform duration-500 relative mx-auto ${
            isZoomed ? "scale-105" : "scale-100"
          }`}
          style={{
            maxWidth: 1200,
            width: "90vw",
            background: "#141414",
            borderRadius: "15px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.6), 0 1.5px 10px 1.5px rgba(23,23,23,0.2)",
            border: "1px solid #232323",
            marginTop: "40px",
            marginBottom: "40px",
            overflow: "hidden",
            display: "flex",
            minHeight: "700px",
          }}
        >
          {/* Sidebar */}
          <div
            className="w-64 p-0"
            style={{
              background: "linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)",
              borderRight: "1px solid #2a2a2a",
              boxShadow: "2px 0 20px rgba(0, 0, 0, 0.5)",
              minHeight: "700px"
            }}
          >
            <div className="p-6 border-b" style={{ borderColor: "#2a2a2a" }}>
              <h3
                className="text-lg font-bold"
                style={{
                  color: "#d97706",
                  textShadow: "0 0 10px rgba(217, 119, 6, 0.3)",
                  letterSpacing: "-0.025em"
                }}
              >
                Features
              </h3>
            </div>
            <nav className="py-6">
              {sidebarFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className={`px-6 py-3 text-sm font-medium cursor-pointer transition-all duration-300 nav-hover relative`}
                  style={{
                    color: idx === 0 ? "#d97706" : "#9ca3af",
                    background:
                      idx === 0
                        ? "linear-gradient(90deg, rgba(217, 119, 6, 0.2), transparent)"
                        : "transparent",
                    borderLeft: idx === 0 ? "3px solid #d97706" : "3px solid transparent",
                    boxShadow: idx === 0 ? "inset 0 0 20px rgba(217, 119, 6, 0.1)" : "none",
                  }}
                  onClick={handleNavClick}
                  onMouseEnter={(e) => {
                    if (idx !== 0) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(217, 119, 6, 0.1)";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderLeftColor = "#d97706";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (idx !== 0) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#9ca3af";
                      e.currentTarget.style.borderLeftColor = "transparent";
                    }
                  }}
                >
                  {feature}
                </div>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div
            className="flex-1 p-8"
            style={{
              background: "linear-gradient(135deg, #111111 0%, #0a0a0a 100%)",
              minHeight: "700px"
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold mb-2 gradient-text">
                Dashboard
              </h1>
              <p style={{ color: "#6b7280" }}>Fleet management overview</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { title: "Add Driver", desc: "Register new driver", icon: "+" },
                { title: "Add Cab", desc: "Register new vehicle", icon: "+" },
                { title: "Update Maintenance", desc: "Schedule service", icon: "⚙" },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="p-7 cursor-pointer transition-all duration-300 card-hover sweep-effect relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                    border: "1px solid #2a2a2a",
                    borderRadius: "16px",
                    boxShadow:
                      "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                  onClick={handleCardClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(217, 119, 6, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.borderColor = "#d97706";
                    const title = e.currentTarget.querySelector(
                      ".card-title"
                    ) as HTMLElement;
                    const desc = e.currentTarget.querySelector(
                      ".card-desc"
                    ) as HTMLElement;
                    if (title) title.style.color = "#d97706";
                    if (desc) desc.style.color = "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    const title = e.currentTarget.querySelector(
                      ".card-title"
                    ) as HTMLElement;
                    const desc = e.currentTarget.querySelector(
                      ".card-desc"
                    ) as HTMLElement;
                    if (title) title.style.color = "#ffffff";
                    if (desc) desc.style.color = "#9ca3af";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-5 card-icon-hover transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, #d97706, #f59e0b)",
                      boxShadow:
                        "0 8px 25px rgba(217, 119, 6, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 card-title transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p
                    className="text-sm card-desc transition-colors duration-300"
                    style={{ color: "#9ca3af" }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Analytics Chart Area */}
            <div
              className="p-9 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                border: "1px solid #2a2a2a",
                borderRadius: "20px",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-60"
                style={{
                  background: "linear-gradient(90deg, transparent, #d97706, transparent)",
                }}
              />
              <div className="flex items-center justify-between mb-9">
                <h3 className="text-2xl font-bold text-white">Revenue Overview</h3>
                <div
                  className="px-4 py-2 rounded-full text-base font-semibold"
                  style={{
                    color: "#d97706",
                    background: "rgba(217, 119, 6, 0.1)",
                    border: "1px solid rgba(217, 119, 6, 0.3)",
                  }}
                >
                  2024
                </div>
              </div>
              {/* Placeholder Chart */}
              <div
                className="h-90 flex items-center justify-center border-2 border-dashed rounded-2xl pulse-bg rotate-bg relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
                  borderColor: "#3a3a3a",
                  height: "360px",
                }}
              >
                <div className="text-center relative z-10">
                  <div
                    className="w-18 h-18 rounded-xl flex items-center justify-center mb-5 mx-auto"
                    style={{
                      background: "linear-gradient(135deg, #d97706, #f59e0b)",
                      width: "72px",
                      height: "72px",
                      boxShadow:
                        "0 12px 40px rgba(217, 119, 6, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                    }}
                  >
                    <span className="text-3xl">📊</span>
                  </div>
                  <div className="text-lg font-bold text-white mb-3">
                    Chart visualization area
                  </div>
                  <div className="text-sm" style={{ color: "#6b7280" }}>
                    Revenue analytics will be displayed here
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
