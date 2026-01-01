"use client";

import { useEffect, useState } from "react";
import BlurText from "./BlurText";
import GlareHover from "./GlareHover";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "rgb(15, 15, 15)" }}
    >
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Ambient gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          {/* Left Column - Content */}
          <div className="text-left lg:text-left space-y-8">
            {/* Main Heading - reduced sizes, NO shine */}
            <h1
              className="text-[28px] sm:text-[36px] md:text-[46px] lg:text-[56px] xl:text-[64px] font-bold leading-tight"
              style={{
                fontFamily:
                  'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "820px",
              }}
            >
              <BlurText
                text="RUN YOUR TAXIS"
                delay={0}
                animateBy="words"
                direction="top"
                className="text-white block mb-1"
                onAnimationComplete={handleAnimationComplete}
              />
              <span className="inline-block">
                <BlurText
                  text="WITH "
                  delay={0}
                  animateBy="words"
                  direction="top"
                  className="text-white"
                />
                <BlurText
                  text="EASE"
                  delay={0}
                  animateBy="words"
                  direction="top"
                  className="text-amber-500 italic"
                />
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl"
              style={{
                fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
              }}
            >
              Manage drivers, track payments, monitor routes, and grow your taxi
              business from one powerful dashboard that simplifies everything.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span
                  className="text-gray-300 text-sm font-medium"
                  style={{
                    fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
                  }}
                >
                  Real-time GPS Tracking
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span
                  className="text-gray-300 text-sm font-medium"
                  style={{
                    fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
                  }}
                >
                  Automated Dispatch
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span
                  className="text-gray-300 text-sm font-medium"
                  style={{
                    fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
                  }}
                >
                  Secure Payments
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span
                  className="text-gray-300 text-sm font-medium"
                  style={{
                    fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
                  }}
                >
                  Driver Analytics
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
                  <button
                    className="group relative bg-amber-500 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/50 shadow-lg shadow-amber-500/30 uppercase tracking-wide overflow-hidden"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(245, 158, 11, 0.4), 0 4px 15px rgba(245, 158, 11, 0.2)",
                      fontFamily:
                        'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Get Started Free</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
             

              <button
                className="px-8 py-4 rounded-full font-semibold border-2 border-gray-600 text-gray-300 hover:border-amber-500 hover:text-white transition-all duration-300 uppercase tracking-wide"
                style={{
                  fontFamily:
                    'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                }}
              >
                Watch Demo
              </button>
            </div>

            {/* Trust indicators — left-aligned within the content column */}
            {/* <div className="pt-8 border-t border-gray-800">
              <div className="flex items-center justify-start gap-6">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold text-white mb-1"
                    style={{
                      fontFamily:
                        'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    }}
                  >
                    99.9%
                  </div>
                  <div
                    className="text-xs text-gray-400"
                    style={{
                      fontFamily:
                        'aeonikFono, "aeonikFono Fallback", monospace',
                    }}
                  >
                    Uptime
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-gray-700" />

                <div className="text-center">
                  <div
                    className="text-2xl font-bold text-amber-400 mb-1"
                    style={{
                      fontFamily:
                        'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    }}
                  >
                    50K+
                  </div>
                  <div
                    className="text-xs text-gray-400"
                    style={{
                      fontFamily:
                        'aeonikFono, "aeonikFono Fallback", monospace',
                    }}
                  >
                    Active Rides
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-gray-700" />

                <div className="text-center">
                  <div
                    className="text-2xl font-bold text-white mb-1"
                    style={{
                      fontFamily:
                        'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    }}
                  >
                    &lt;2s
                  </div>
                  <div
                    className="text-xs text-gray-400"
                    style={{
                      fontFamily:
                        'aeonikFono, "aeonikFono Fallback", monospace',
                    }}
                  >
                    Response Time
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Visual (compact dashboard, same size/style as mockup) */}
          <div className="relative lg:h-full flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Dashboard panel with same color scheme */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div
                    className="text-xs text-gray-400"
                    style={{
                      fontFamily:
                        'aeonikFono, "aeonikFono Fallback", monospace',
                    }}
                  >
                    TaxiWaala Dashboard
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div className="text-amber-400 text-2xl font-bold mb-1">
                      24
                    </div>
                    <div className="text-gray-400 text-xs">Active Drivers</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div className="text-green-400 text-2xl font-bold mb-1">
                      ₹12.5k
                    </div>
                    <div className="text-gray-400 text-xs">Today's Revenue</div>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-gray-700 rounded-lg h-32 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>
                  <div className="absolute top-3 left-3 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-8 right-6 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-6 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 right-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-gray-500 text-sm"
                      style={{
                        fontFamily:
                          'aeonikFono, "aeonikFono Fallback", monospace',
                      }}
                    >
                      Live Tracking
                    </span>
                  </div>
                </div>

                {/* Recent rides */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">D1</span>
                      </div>
                      <div>
                        <div className="text-white text-xs">Rajesh Kumar</div>
                        <div className="text-gray-400 text-xs">
                          Airport → Mall
                        </div>
                      </div>
                    </div>
                    <div className="text-green-400 text-xs font-bold">₹250</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">D2</span>
                      </div>
                      <div>
                        <div className="text-white text-xs">Amit Sharma</div>
                        <div className="text-gray-400 text-xs">
                          Station → Home
                        </div>
                      </div>
                    </div>
                    <div className="text-green-400 text-xs font-bold">₹180</div>
                  </div>
                </div>
              </div>

              {/* Floating elements (optional) */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
