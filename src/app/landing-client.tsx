"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
// import Dashboard from "@/components/landing/Dashboard";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function LandingClient() {
  return (
    <main
      className="text-white min-h-screen"
      style={{ backgroundColor: "rgb(15, 15, 15)" }}
    >
      <LandingHeader />
      <Hero />

      <Divider />

      {/* <Dashboard /> */}

      <Features />

      <Divider />

      <Testimonials />

      <Divider />

      <Pricing />
      <Footer />
    </main>
  );
}

function Divider() {
  return (
    <div className="w-[70%] mx-auto flex items-center gap-3 my-10">
      <div className="flex-1 h-px bg-gray-300"></div>
      <span className="text-gray-300 bg-black">✦</span>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>
  );
}
