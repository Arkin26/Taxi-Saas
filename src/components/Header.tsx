
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserCircle2 } from 'lucide-react'
import LoginModal from './loginMoodal'

export default function Header() {
  const [showModal, setShowModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  // Check login state on mount
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('fromLogin') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('fromLogin')
    setIsLoggedIn(false)
    setShowDropdown(false)
    router.push('/')
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                TaxiWaala
              </Link>
            </div>

            {/* Navigation Buttons */}
            <nav className="hidden md:flex space-x-4 items-center">
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/get-demo"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Demo
              </Link>

              {!isLoggedIn ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    <UserCircle2 size={30} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          router.push('/profile')
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2"
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu')
                  mobileMenu?.classList.toggle('hidden')
                }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </Link>
              <Link
                href="/get-demo"
                className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium text-center"
              >
                Get Demo
              </Link>
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
                    onClick={() => router.push('/profile')}
                    className="text-gray-600 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showModal && (
        <LoginModal
          onClose={() => {
            setShowModal(false)
            // re-check login state after closing modal
            if (sessionStorage.getItem('fromLogin') === 'true') {
              setIsLoggedIn(true)
            }
          }}
        />
      )}
    </>
  )
}
