'use client'

import Link from 'next/link'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API Docs', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Status', href: '#' },
    { name: 'Security', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'GDPR', href: '#' },
  ]
}

const socialLinks = [
  { name: 'Twitter', icon: '🐦', href: '#' },
  { name: 'LinkedIn', icon: '💼', href: '#' },
  { name: 'Facebook', icon: '📘', href: '#' },
  { name: 'Instagram', icon: '📸', href: '#' },
]

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer 
      className="border-t relative"
      style={{
        backgroundColor: "rgb(15, 15, 15)",
        borderColor: 'rgba(217, 119, 6, 0.2)'
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link 
              href="/" 
              className="text-3xl font-bold mb-4 block transition-all duration-300 hover:scale-110"
              style={{ 
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              TaxiFlow
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Revolutionizing taxi business management with intelligent automation, 
              comprehensive tracking, and powerful analytics.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-110"
                  style={{
                    background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
                    border: '1px solid #2a2a2a',
                    color: '#9ca3af'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)'
                    e.currentTarget.style.color = '#000000'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(145deg, #1a1a1a, #0f0f0f)'
                    e.currentTarget.style.color = '#9ca3af'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ color: '#d97706' }}>Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('#') ? (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#d97706'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9ca3af'
                      }}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 block"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#d97706'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9ca3af'
                      }}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#d97706' }}>Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 block"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#d97706'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#d97706' }}>Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 block"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#d97706'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#d97706' }}>Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 block"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#d97706'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div 
          className="rounded-2xl p-8 mb-12 transition-all duration-300 hover:scale-102"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #2a2a2a',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ color: '#d97706' }}
              >
                Stay Updated
              </h3>
              <p className="text-gray-300">
                Get the latest updates, tips, and industry insights delivered to your inbox.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:ml-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, #0f0f0f, #1a1a1a)',
                  border: '1px solid #2a2a2a'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#d97706'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(217, 119, 6, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a2a'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button 
                className="text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-105 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  boxShadow: '0 8px 25px rgba(217, 119, 6, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(217, 119, 6, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.4)'
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div 
          className="border-t pt-8"
          style={{ borderColor: '#2a2a2a' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 TaxiFlow Inc. All rights reserved.
            </div>
            
            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: '#10b981' }}
                ></div>
                <span>System Status: All Good</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hover\\:scale-102:hover { transform: scale(1.02); }
        .hover\\:translate-x-1:hover { transform: translateX(0.25rem); }
      `}</style>
    </footer>
  )
}