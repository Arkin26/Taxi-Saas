// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import GlassSurface from "./GlassSurface";
// import LoginModal from "../loginMoodal"; // import the modal component
// import { useRouter } from "next/navigation";

// export default function LandingHeader() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Check login state on mount (similar to original Header)
//   useEffect(() => {
//     const loggedIn = sessionStorage.getItem("fromLogin") === "true";
//     setIsLoggedIn(loggedIn);
//   }, []);

//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) element.scrollIntoView({ behavior: "smooth" });
//     setIsMobileMenuOpen(false);
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem("fromLogin");
//     setIsLoggedIn(false);
//     setShowDropdown(false);
//     router.push("/");
//   };

//   return (
//     <>
//       <header
//         className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out`}
//         style={{
//           background: "transparent",
//           borderBottom: "none",
//           boxShadow: isScrolled ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
//         }}
//       >
//         <div className="w-full flex justify-center pt-4 sm:pt-4 md:pt-5 lg:pt-6 px-4">
//           <GlassSurface
//             width="100%"
//             height="auto"
//             borderRadius={9999}
//             className="w-[60vw] max-w-[800px] min-w-[320px] rounded-full box-border"
//             displace={15}
//             distortionScale={-150}
//             redOffset={5}
//             greenOffset={15}
//             blueOffset={25}
//             brightness={60}
//             opacity={0.8}
//             mixBlendMode="screen"
//           >
//             <nav className="w-full px-4 sm:px-6 py-4">
//               <div className="flex justify-between items-center">
//                 <Link href="/" className="flex items-center space-x-3 group">
//                   <svg
//                     className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     aria-hidden="true"
//                     style={{ color: "#d97706" }}
//                   >
//                     {/* Taxi icon path */}
//                     <path d="M7 10l1.2-3.6A2 2 0 0 1 10.1 5h3.8a2 2 0 0 1 1.9 1.4L17 10h1a3 3 0 0 1 3 3v3.5a1.5 1.5 0 0 1-3 0V16H6v.5a1.5 1.5 0 0 1-3 0V13a3 3 0 0 1 3-3h1zm2.6-3L9.3 10h5.4l-.3-.9-.7-2.1a.5.5 0 0 0-.5-.35h-3.8a.5.5 0 0 0-.5.35zM5 13a1 1 0 0 0-1 1v1h16v-1a1 1 0 0 0-1-1H5zm2 4.5a1.5 1.5 0 1 1-3 0V17h3v.5zm13 0a1.5 1.5 0 1 1-3 0V17h3v.5z" />
//                   </svg>
//                 </Link>

//                 {/* Desktop Navigation */}
//                 <div className="hidden lg:flex items-center space-x-1">
//                   {[
//                     { label: "FEATURES", section: "features", font: "aeonik" },

//                     { label: "PRICING", section: "pricing", font: "aeonik" },
//                     { label: "REVIEWS", section: "testimonials", font: "aeonik" },
//                   ].map((item) => (
//                     <button
//                       key={item.section}
//                       onClick={() => scrollToSection(item.section)}
//                       className="relative px-4 py-2 text-sm font-medium rounded-lg group transition-all duration-300"
//                       style={{
//                         color: "#ffffff",
//                         fontFamily:
//                           item.font === "aeonik"
//                             ? 'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'
//                             : "Inter, system-ui, -apple-system, sans-serif",
//                       }}
//                     >
//                       {item.label}
//                       <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
//                     </button>
//                   ))}
//                 </div>

//                 {/* Login Button / User Dropdown area */}
//                 <div className="hidden lg:flex items-center space-x-4">
//                   {!isLoggedIn ? (
//                     <button
//                       onClick={() => setShowModal(true)}
//                       className="bg-amber-600 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300"
//                     >
//                       Login
//                     </button>
//                   ) : (
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowDropdown(!showDropdown)}
//                         className="text-gray-800 hover:text-gray-600"
//                       >
//                         {/* You can import and use your UserCircle2 icon here */}
//                         {/* Example: <UserCircle2 size={30} /> */}
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="currentColor"
//                           viewBox="0 0 24 24"
//                           width={30}
//                           height={30}
//                         >
//                           <circle cx="12" cy="7" r="5" />
//                           <path d="M2 22c0-5 8-5 10-5s10 0 10 5v2H2v-2z" />
//                         </svg>
//                       </button>

//                       {showDropdown && (
//                         <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
//                           <button
//                             onClick={() => {
//                               setShowDropdown(false);
//                               router.push("/profile");
//                             }}
//                             className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                           >
//                             Profile
//                           </button>
//                           <button
//                             onClick={handleLogout}
//                             className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
//                           >
//                             Logout
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Mobile Menu Button */}
//                 <button
//                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                   className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-300 group"
//                   aria-label="Toggle menu"
//                 >
//                   <div className="w-6 h-6 relative">
//                     <span
//                       className={`absolute block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out ${
//                         isMobileMenuOpen ? "rotate-45 top-3" : "top-2"
//                       }`}
//                     />
//                     <span
//                       className={`absolute block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out top-3 ${
//                         isMobileMenuOpen
//                           ? "opacity-0 scale-0"
//                           : "opacity-100 scale-100"
//                       }`}
//                     />
//                     <span
//                       className={`absolute block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out ${
//                         isMobileMenuOpen ? "-rotate-45 top-3" : "top-4"
//                       }`}
//                     />
//                   </div>
//                 </button>
//               </div>
//             </nav>
//           </GlassSurface>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`lg:hidden transition-all duration-500 ease-in-out ${
//             isMobileMenuOpen
//               ? "max-h-96 opacity-100 translate-y-0"
//               : "max-h-0 opacity-0 -translate-y-2"
//           } overflow-hidden px-4 sm:px-6`}
//         >
//           <div
//             className="rounded-2xl shadow-xl p-6"
//             style={{
//               backgroundColor: "rgba(17, 17, 17, 0.85)",
//               backdropFilter: "blur(10px)",
//               WebkitBackdropFilter: "blur(10px)",
//               border: "1px solid rgba(255,255,255,0.15)",
//             }}
//           >
//             <div className="flex flex-col space-y-1">
//               {[
//                 { label: "Features", section: "features", font: "aeonik" },
//                 { label: "Dashboard", section: "dashboard", font: "aeonik" },
//                 { label: "Pricing", section: "pricing", font: "aeonik" },
//                 { label: "Reviews", section: "testimonials", font: "inter" },
//               ].map((item) => (
//                 <button
//                   key={item.section}
//                   onClick={() => scrollToSection(item.section)}
//                   className="text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium hover:bg-white/10"
//                   style={{
//                     color: "#ffffff",
//                     fontFamily:
//                       item.font === "aeonik"
//                         ? 'aeonikFono, "aeonikFono Fallback", monospace'
//                         : "Inter, system-ui, -apple-system, sans-serif",
//                   }}
//                 >
//                   {item.label}
//                 </button>
//               ))}
//               {!isLoggedIn ? (
//                 <button
//                   onClick={() => setShowModal(true)}
//                   className="bg-gray-900 hover:bg-gray-800 text-white block px-3 py-2 rounded-md text-base font-medium text-center w-full"
//                 >
//                   Login
//                 </button>
//               ) : (
//                 <div className="space-y-2">
//                   <button
//                     onClick={() => router.push("/profile")}
//                     className="text-gray-600 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
//                   >
//                     Profile
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="text-red-500 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Login Modal */}
//       {showModal && (
//         <LoginModal
//           onClose={() => {
//             setShowModal(false);
//             // Re-check login state after closing modal
//             if (sessionStorage.getItem("fromLogin") === "true") {
//               setIsLoggedIn(true);
//             }
//           }}
//         />
//       )}
//     </>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import GlassSurface from "./GlassSurface";
import LoginModal from "../loginMoodal"; // import the modal component
import { useRouter } from "next/navigation";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login state on mount (similar to original Header)
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("fromLogin") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("fromLogin");
    sessionStorage.removeItem("loginToken");
    setIsLoggedIn(false);
    setShowDropdown(false);
    router.push("/");
  };

  const handleDashboard = () => {
    const token = sessionStorage.getItem("loginToken");
    setShowDropdown(false);
    if (token) {
      router.push(`/dashboard/${token}`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleUserIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    });
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out`}
        style={{
          background: "transparent",
          borderBottom: "none",
          boxShadow: isScrolled ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
        }}
      >
        <div className="w-full flex justify-center pt-4 sm:pt-4 md:pt-5 lg:pt-6 px-4">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={9999}
            className="w-[60vw] max-w-[800px] min-w-[320px] rounded-full box-border"
            displace={15}
            distortionScale={-150}
            redOffset={5}
            greenOffset={15}
            blueOffset={25}
            brightness={60}
            opacity={0.8}
            mixBlendMode="screen"
          >
            <nav className="w-full px-4 sm:px-6 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-3 group">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    style={{ color: "#d97706" }}
                  >
                    <path d="M7 10l1.2-3.6A2 2 0 0 1 10.1 5h3.8a2 2 0 0 1 1.9 1.4L17 10h1a3 3 0 0 1 3 3v3.5a1.5 1.5 0 0 1-3 0V16H6v.5a1.5 1.5 0 0 1-3 0V13a3 3 0 0 1 3-3h1zm2.6-3L9.3 10h5.4l-.3-.9-.7-2.1a.5.5 0 0 0-.5-.35h-3.8a.5.5 0 0 0-.5.35zM5 13a1 1 0 0 0-1 1v1h16v-1a1 1 0 0 0-1-1H5zm2 4.5a1.5 1.5 0 1 1-3 0V17h3v.5zm13 0a1.5 1.5 0 1 1-3 0V17h3v.5z" />
                  </svg>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-1">
                  {[
                    { label: "FEATURES", section: "features", font: "aeonik" },
                    { label: "PRICING", section: "pricing", font: "aeonik" },
                    { label: "REVIEWS", section: "testimonials", font: "aeonik" },
                  ].map((item) => (
                    <button
                      key={item.section}
                      onClick={() => scrollToSection(item.section)}
                      className="relative px-4 py-2 text-sm font-medium rounded-lg group transition-all duration-300"
                      style={{
                        color: "#ffffff",
                        fontFamily:
                          item.font === "aeonik"
                            ? 'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'
                            : "Inter, system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {item.label}
                      <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                    </button>
                  ))}
                </div>

                {/* Login Button / User Dropdown area */}
                <div className="hidden lg:flex items-center space-x-4">
                  {!isLoggedIn ? (
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-amber-600 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300"
                    >
                      Login
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={handleUserIconClick}
                        className="text-white hover:text-amber-400 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          width={30}
                          height={30}
                        >
                          <circle cx="12" cy="7" r="5" />
                          <path d="M2 22c0-5 8-5 10-5s10 0 10 5v2H2v-2z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-300 group"
                  aria-label="Toggle menu"
                >
                  <div className="w-6 h-6 relative">
                    <span
                      className={`absolute block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? "rotate-45 top-3" : "top-2"
                      }`}
                    />
                    <span
                      className={`absolute block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out top-3 ${
                        isMobileMenuOpen
                          ? "opacity-0 scale-0"
                          : "opacity-100 scale-100"
                      }`}
                    />
                    <span
                      className={`absolute block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? "-rotate-45 top-3" : "top-4"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </nav>
          </GlassSurface>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          } overflow-hidden px-4 sm:px-6`}
        >
          <div
            className="rounded-2xl shadow-xl p-6"
            style={{
              backgroundColor: "rgba(17, 17, 17, 0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex flex-col space-y-1">
              {[
                { label: "Features", section: "features", font: "aeonik" },
                { label: "Dashboard", section: "dashboard", font: "aeonik" },
                { label: "Pricing", section: "pricing", font: "aeonik" },
                { label: "Reviews", section: "testimonials", font: "inter" },
              ].map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium hover:bg-white/10"
                  style={{
                    color: "#ffffff",
                    fontFamily:
                      item.font === "aeonik"
                        ? 'aeonikFono, "aeonikFono Fallback", monospace'
                        : "Inter, system-ui, -apple-system, sans-serif",
                  }}
                >
                  {item.label}
                </button>
              ))}
              {!isLoggedIn ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white block px-3 py-2 rounded-md text-base font-medium text-center w-full"
                >
                  Login
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleDashboard}
                    className="text-white hover:text-amber-400 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Portal Dropdown - renders outside header container */}
      {showDropdown && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed w-48 bg-white/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
          style={{ 
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            zIndex: 9999
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDashboard}
            className="w-full text-left px-4 py-3 hover:bg-blue-50/80 text-sm font-medium text-gray-800 transition-colors duration-200 border-b border-gray-100/50"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 hover:bg-red-50/80 text-sm font-medium text-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>,
        document.body
      )}

      {/* Login Modal */}
      {showModal && (
        <LoginModal
          onClose={() => {
            setShowModal(false);
            // Re-check login state after closing modal
            if (sessionStorage.getItem("fromLogin") === "true") {
              setIsLoggedIn(true);
            }
          }}
        />
      )}
    </>
  );
}

