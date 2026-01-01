import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import Dashboard from "@/components/landing/Dashboard";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import CurvedText from "@/components/landing/CurvedText";

export const metadata = {
  title: "TaxiFlow - Smart Taxi Management Dashboard",
  description:
    "Streamline operations, track history, and boost efficiency with our comprehensive taxi management dashboard powered by intelligent automation.",
  keywords:
    "taxi management, fleet tracking, taxi dashboard, ride booking system, taxi business software",
};

export default function HomePage() {
  return (
    
      <main
        className="text-white min-h-screen"
        style={{ backgroundColor: "rgb(15, 15, 15)" }}
      >
        <LandingHeader />
        <Hero />
        <div className="w-[70%] mx-auto flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-300 bg-black">✦</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* <Dashboard /> */}

        <Features />
        <div className="w-[70%] mx-auto flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-300 bg-black">✦</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <Testimonials />
        <div className="w-[70%] mx-auto flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-300 bg-black">✦</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <Pricing />
        <Footer />
      </main>
   
  );
}
