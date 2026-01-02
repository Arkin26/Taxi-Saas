"use client";

import React, { useEffect, useRef, useState } from "react";

type FeatureItem = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const svgSize = 56;

// Inline placeholder icons (swap with your set anytime)
const Icons = {
  dashboard: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 13a8 8 0 0 1 16 0v5H4v-5z" />
      <path d="M12 13l3-3" />
      <path d="M8 18h8" />
    </svg>
  ),
  dispatch: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="12" cy="19" r="2" />
      <path d="M7 6h10M5 7l5 9M17 6l2 3M14 14l5 5" />
    </svg>
  ),
  rides: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 16h14l-1.5-5a2 2 0 0 0-1.9-1.4H8.4A2 2 0 0 0 6.5 11L5 16z" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
    </svg>
  ),
  upcoming: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 9h18" />
      <path d="M9 15h6" />
    </svg>
  ),
  payments: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 16h4M15 16h2" />
    </svg>
  ),
  maintenance: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 7a3 3 0 1 1-3 3" />
      <circle cx="14" cy="10" r="5" />
      <path d="M2 22l7-7" />
    </svg>
  ),
  idcard: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M7 16c1.2-1 2.8-1 4 0M14 10h4M14 14h4" />
    </svg>
  ),
  alert: (
    <svg
      viewBox="0 0 24 24"
      width={svgSize}
      height={svgSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 4.6l-7.2 12.5A2 2 0 0 0 5 20h14a2 2 0 0 0 1.7-2.9L13.5 4.6a2 2 0 0 0-3.2 0z" />
      <path d="M12 9v5" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
};

const items: FeatureItem[] = [
  {
    title: "DASHBOARD HOME",
    desc: "KPIs, live map, and quick actions.",
    icon: Icons.dashboard,
  },
  {
    title: "SMART DISPATCH",
    desc: "Auto-assign by proximity and ETA.",
    icon: Icons.dispatch,
  },
  {
    title: "ONGOING RIDES",
    desc: "Real-time tracking and statuses.",
    icon: Icons.rides,
  },
  {
    title: "UPCOMING BOOKINGS",
    desc: "Plan, edit, and automate rides.",
    icon: Icons.upcoming,
  },
  {
    title: "PAYMENTS",
    desc: "Collect, reconcile, and settle fares.",
    icon: Icons.payments,
  },
  {
    title: "MAINTENANCE",
    desc: "Service schedules and vehicle health.",
    icon: Icons.maintenance,
  },
  {
    title: "DRIVER LICENSES",
    desc: "Track licenses and expiries.",
    icon: Icons.idcard,
  },
  {
    title: "ALERTS & REMINDERS",
    desc: "Proactive notifications across ops.",
    icon: Icons.alert,
  },
];

const Feature: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const boxRefs = useRef<(HTMLElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [mounted]);

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{
        backgroundColor: "rgb(15, 15, 15)",
      }}
      className="w-full min-h-fit py-10"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header 
          ref={headerRef} 
          className={`mb-10 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <h2
            style={{
              fontFamily:
                'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
              background: "linear-gradient(90deg, #ffffff, #d97706)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            FEATURES
          </h2>
          <p
            style={{
              fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
            }}
            className="mt-2 text-gray-400"
          >
            Explore what the platform offers for fleet operations.
          </p>
        </header>

        {/* Outer joined border with dark theme */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{
            border: "1px solid #2a2a2a",
            background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* 2 rows × 4 columns on lg; joined internal dividers via border utilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((f, i) => (
              <article
                key={i}
                ref={(el) => {
                  boxRefs.current[i] = el;
                }}
                className={[
                  "p-6 flex flex-col justify-start transition-all duration-600 hover:bg-black/20 group cursor-pointer",
                  "border-gray-600/50",
                  "sm:[&:not(:nth-child(2n))]:border-r",
                  "lg:[&:not(:nth-child(4n))]:border-r",
                  "border-b",
                  "lg:[&:nth-last-child(-n+4)]:border-b-0",
                  "sm:[&:nth-last-child(-n+2)]:border-b-0",
                  "[&:last-child]:border-b-0",
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                ].join(" ")}
                style={{
                  background: "transparent",
                  transitionDelay: `${i * 100}ms`
                }}
              >
                <div
                  className="mb-4 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-500"
                  style={{
                    color: "#d97706",
                    filter: "drop-shadow(0 0 8px rgba(217, 119, 6, 0.3))",
                  }}
                >
                  {f.icon}
                </div>

                <h3
                  style={{
                    fontFamily:
                      'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                  }}
                  className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors duration-300"
                >
                  {f.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
                  }}
                  className="mt-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                >
                  {f.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;