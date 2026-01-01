'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'Perfect for small fleets',
    description: 'Get started with essential taxi management features',
    features: [
      'Up to 5 vehicles',
      'Basic dashboard analytics',
      'Essential GPS tracking',
      'Email support',
      'Mobile app access',
      'Basic reporting'
    ],
    featured: false,
    buttonText: 'Get Started Free',
    buttonLink: '/dashboard'
  },
  {
    name: 'Professional',
    price: '$89',
    period: 'per month',
    description: 'Perfect for growing taxi businesses',
    features: [
      'Up to 50 vehicles',
      'Advanced analytics & insights',
      'Real-time fleet tracking',
      'Payment processing integration',
      'Priority customer support',
      'Custom reporting & exports',
      'Driver performance metrics',
      'Automated dispatch system'
    ],
    featured: true,
    buttonText: 'Start 14-Day Trial',
    buttonLink: '/dashboard',
    savings: 'Most Popular'
  },
  {
    name: 'Enterprise',
    price: '$249',
    period: 'per month',
    description: 'For large-scale taxi operations',
    features: [
      'Unlimited vehicles',
      'Full feature access',
      'API integrations',
      'Dedicated account manager',
      'Custom onboarding & training',
      'White-label solutions',
      'Advanced security features',
      'Custom integrations',
      '24/7 phone support'
    ],
    featured: false,
    buttonText: 'Contact Sales',
    buttonLink: '/dashboard'
  }
]

const faqs = [
  {
    question: 'How quickly can I get started?',
    answer: 'You can start immediately with our Starter plan. For paid plans, setup typically takes 15-30 minutes with our guided onboarding process.'
  },
  {
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades will apply at your next billing cycle.'
  },
  {
    question: 'Is there a long-term contract required?',
    answer: 'No contracts required. All our paid plans are month-to-month, and you can cancel anytime with no penalties.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer email support for all plans, priority support for Professional users, and dedicated phone support for Enterprise customers.'
  }
]

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    // Animate cards in sequence
    const timer = setTimeout(() => {
      plans.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index])
        }, index * 200)
      })
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section 
      className="py-32 px-6 min-h-screen relative overflow-hidden" 
      id="pricing"
      style={{
        backgroundColor: "rgb(15, 15, 15)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-amber-600/5 to-transparent animate-spin-slow" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-r from-amber-600/5 to-transparent animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-4 animate-fadeInUp"
            style={{
              background: 'linear-gradient(135deg, #ffffff, #d97706, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(217, 119, 6, 0.3)'
            }}
          >
            Plans That Scale With You
          </h2>
          <p className="text-xl text-gray-300 mb-8 animate-fadeInUp animation-delay-200">
            Flexible pricing for taxi businesses of every size. Start free, upgrade anytime.
          </p>
          
          {/* Billing Toggle */}
          <div 
            className="inline-flex items-center p-1 rounded-full animate-fadeInUp animation-delay-400"
            style={{
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #2a2a2a',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual 
                  ? 'text-black shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{
                background: !isAnnual ? 'linear-gradient(135deg, #d97706, #f59e0b)' : 'transparent',
                boxShadow: !isAnnual ? '0 4px 15px rgba(217, 119, 6, 0.4)' : 'none'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAnnual 
                  ? 'text-black shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
              style={{
                background: isAnnual ? 'linear-gradient(135deg, #d97706, #f59e0b)' : 'transparent',
                boxShadow: isAnnual ? '0 4px 15px rgba(217, 119, 6, 0.4)' : 'none'
              }}
            >
              Annual
              <span 
                className="ml-2 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl transition-all duration-700 relative group cursor-pointer flex flex-col ${
                plan.featured 
                  ? 'transform scale-105' 
                  : 'hover:scale-105'
              } ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
                border: plan.featured ? '1px solid #d97706' : '1px solid #2a2a2a',
                boxShadow: plan.featured 
                  ? '0 20px 40px rgba(217, 119, 6, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                transitionDelay: `${index * 200}ms`
              }}
              onMouseEnter={(e) => {
                if (!plan.featured) {
                  e.currentTarget.style.transition = 'all 0.2s ease-out'
                  e.currentTarget.style.border = '1px solid #d97706'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(217, 119, 6, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.featured) {
                  e.currentTarget.style.transition = 'all 0.2s ease-out'
                  e.currentTarget.style.border = '1px solid #2a2a2a'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {/* Popular Badge */}
              {plan.featured && (
                <div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-semibold text-black animate-bounce"
                  style={{
                    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                    boxShadow: '0 8px 25px rgba(217, 119, 6, 0.4)'
                  }}
                >
                  {plan.savings}
                </div>
              )}
              
              {/* Plan Header */}
              <div className="text-center mb-8 relative z-10">
                <h3 
                  className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: '#d97706' }}
                >
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span 
                    className="text-4xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300"
                    style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                  >
                    {plan.price === 'Free' ? plan.price : 
                     isAnnual && plan.price !== 'Free' ? 
                     `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8)}` : 
                     plan.price}
                  </span>
                  {plan.price !== 'Free' && (
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  )}
                  {plan.price === 'Free' && (
                    <div className="text-gray-400 text-sm mt-1">{plan.period}</div>
                  )}
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {plan.description}
                </p>
              </div>
              
              {/* Features List */}
              <ul className="space-y-4 mb-8 relative z-10 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li 
                    key={featureIndex} 
                    className="flex items-start text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                    style={{ animationDelay: `${featureIndex * 100}ms` }}
                  >
                    <span 
                      className="mr-3 mt-0.5 flex-shrink-0 transition-all duration-300 group-hover:scale-125"
                      style={{ 
                        color: '#d97706',
                        filter: 'drop-shadow(0 0 4px rgba(217, 119, 6, 0.5))'
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA Button */}
              <Link 
                href={plan.buttonLink}
                className="block w-full text-center py-4 px-6 rounded-full font-semibold transition-all duration-300 relative z-10 group-hover:scale-105 mt-auto"
                style={{
                  background: plan.featured 
                    ? 'linear-gradient(135deg, #d97706, #f59e0b)' 
                    : 'transparent',
                  color: plan.featured ? '#000000' : '#d97706',
                  border: plan.featured ? 'none' : '2px solid #d97706',
                  boxShadow: plan.featured ? '0 8px 25px rgba(217, 119, 6, 0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!plan.featured) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)'
                    e.currentTarget.style.color = '#000000'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.4)'
                  } else {
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(217, 119, 6, 0.6)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.featured) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#d97706'
                    e.currentTarget.style.boxShadow = 'none'
                  } else {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.4)'
                  }
                }}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h3 
            className="text-3xl font-bold text-center mb-12"
            style={{ 
              color: '#d97706',
              textShadow: '0 0 20px rgba(217, 119, 6, 0.3)'
            }}
          >
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden transition-all duration-300 hover:scale-102"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
                  border: '1px solid #2a2a2a',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center transition-all duration-300 hover:bg-black/20 group"
                >
                  <span className="font-semibold text-white group-hover:text-amber-400 transition-colors duration-300">
                    {faq.question}
                  </span>
                  <span 
                    className={`transition-all duration-500 group-hover:scale-125 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    style={{ 
                      color: '#d97706',
                      filter: 'drop-shadow(0 0 4px rgba(217, 119, 6, 0.5))'
                    }}
                  >
                    ▼
                  </span>
                </button>
                
                <div className={`transition-all duration-500 overflow-hidden ${
                  openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-4 text-gray-300">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div 
            className="rounded-2xl p-8 transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              boxShadow: '0 8px 32px rgba(217, 119, 6, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: '#d97706' }}
            >
              Still Have Questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Our team is here to help you choose the perfect plan for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-black"
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
                Contact Sales
              </button>
              <button 
                className="bg-transparent px-8 py-4 border-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  color: '#d97706',
                  borderColor: '#d97706'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)'
                  e.currentTarget.style.color = '#000000'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#d97706'
                }}
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </section>
  )
}