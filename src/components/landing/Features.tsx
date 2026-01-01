"use client";

import React, { useEffect, useRef } from "react";
// You'll need to install gsap: npm install gsap
// Uncomment the lines below when you have GSAP installed
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// Mock GSAP for demo (remove when using real GSAP)
const gsap = {
  registerPlugin: () => {},
  set: (elements: any, vars: any) => {
    const elementsArray = Array.isArray(elements) ? elements : [elements];
    elementsArray.forEach((el: any) => {
      if (el) {
        if (vars.y !== undefined) el.style.transform = `translateY(${vars.y}px)`;
        if (vars.opacity !== undefined) el.style.opacity = vars.opacity;
      }
    });
  },
  to: (elements: any, vars: any) => {
    const elementsArray = Array.isArray(elements) ? elements : [elements];
    setTimeout(() => {
      elementsArray.forEach((el: any, index: number) => {
        if (el) {
          const delay = (vars.stagger?.amount || 0) * index;
          setTimeout(() => {
            el.style.transform = 'translateY(0px)';
            el.style.opacity = '1';
            el.style.transition = `all ${vars.duration || 1}s ease-out`;
          }, delay * 1000);
        }
      });
    }, 100);
    return { scrollTrigger: {} };
  }
};

const ScrollTrigger = {
  create: () => {},
  refresh: () => {},
  getAll: () => [] // Fixed: Added getAll method that returns empty array
};

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
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const boxRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin();

    // Set initial states - all elements start below and invisible
    gsap.set(headerRef.current, { y: 50, opacity: 0 });
    gsap.set(boxRefs.current, { y: 80, opacity: 0 });

    // Animate header first
    gsap.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate boxes with stagger effect (left to right, row by row)
    gsap.to(boxRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    /* Real GSAP implementation (uncomment when GSAP is installed):
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states
    gsap.set(headerRef.current, { y: 50, opacity: 0 });
    gsap.set(boxRefs.current, { y: 80, opacity: 0 });

    // Header animation
    gsap.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Staggered box animations
    gsap.to(boxRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: {
        amount: 0.8,
        from: "start"
      },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Cleanup - Fixed: Removed argument from getAll()
    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
    */

  }, []);

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
        <header ref={headerRef} className="mb-10">
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
                }} // Fixed: Proper ref callback without return value
                className={[
                  "p-6 flex flex-col justify-start transition-all duration-300 hover:bg-black/20 group cursor-pointer",
                  // draw right borders on all but last col in each row
                  "border-gray-600/50",
                  "sm:[&:not(:nth-child(2n))]:border-r",
                  "lg:[&:not(:nth-child(4n))]:border-r",
                  // draw bottom borders on all but last row
                  // for 8 items: items 1-4 have bottom border on lg, 1-2 on sm, all but last on mobile
                  "border-b",
                  // remove bottom border for last row on lg (items 5-8)
                  "lg:[&:nth-last-child(-n+4)]:border-b-0",
                  // remove bottom border for last row on sm (items 7-8)
                  "sm:[&:nth-last-child(-n+2)]:border-b-0",
                  // remove bottom border for last item on mobile
                  "[&:last-child]:border-b-0",
                ].join(" ")}
                style={{
                  background: "transparent",
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