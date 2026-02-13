import React from 'react';
import { useTranslation } from 'react-i18next';

const LandingPage = ({ 
  setCurrentPage, 
  darkMode, 
  isLoggedIn, 
  userRole 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                {/* Icon removed */}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Public Sector Lost & Found Management
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Comprehensive SaaS platform for universities, government offices, hospitals, municipalities, and transport authorities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => {
                  console.log('🔥 Navigating to public-sector-registration');
                  setCurrentPage('public-sector-registration');
                }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center"
              >
                Register Your Organization
              </button>
              
              {!isLoggedIn && (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-100">Organizations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-100">Items Managed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-blue-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Organizations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Trusted by Public Sector Organizations
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Comprehensive lost & found management for all types of public institutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Universities',
                description: 'Organization member lost & found management with institutional integration',
                features: ['Member ID integration', 'Period-based reporting', 'Organization-wide coverage']
              },
              {
                title: 'Government Offices',
                description: 'Secure employee item management with compliance features',
                features: ['Security clearance levels', 'Audit trail compliance', 'Multi-department support']
              },
              {
                title: 'Hospitals',
                description: 'Patient and staff belongings with privacy protection',
                features: ['HIPAA compliance ready', 'Patient privacy protection', 'Emergency protocols']
              },
              {
                title: 'Municipalities',
                description: 'Public property management across multiple locations',
                features: ['Multi-location support', 'Public access portals', 'Citizen services integration']
              },
              {
                title: 'Transport Authorities',
                description: 'High-volume passenger lost items processing',
                features: ['Real-time processing', 'Route-based categorization', 'Passenger notifications']
              },
              {
                title: 'Other Organizations',
                description: 'Flexible configuration for any public sector organization',
                features: ['Custom workflows', 'Flexible categorization', 'Scalable architecture']
              }
            ].map((org, index) => (
              <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  {org.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  {org.description}
                </p>
                <ul className="space-y-2">
                  {org.features.map((feature, idx) => (
                    <li key={idx} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Enterprise-Grade Features
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need for professional lost & found management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Multi-Tenant Security',
                description: 'Complete data isolation between organizations with enterprise-grade security'
              },
              {
                title: 'Role-Based Access',
                description: 'Granular permissions system with 5-tier role management'
              },
              {
                title: 'Multi-Language Support',
                description: 'English, Amharic, Afaan Oromo, and Tigrinya language support'
              },
              {
                title: 'Advanced Search',
                description: 'Powerful search and filtering with AI-powered matching'
              },
              {
                title: 'Real-Time Notifications',
                description: 'Instant email and SMS notifications for claims and updates'
              },
              {
                title: 'Location Tracking',
                description: 'GPS-based location tracking and mapping integration'
              }
            ].map((feature, index) => (
              <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-6`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Flexible Subscription Plans
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose the perfect plan for your organization's needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                period: '/month',
                users: '10 users',
                items: '100 items',
                features: ['Basic features', '14-day trial', 'Email support'],
                popular: false
              },
              {
                name: 'Basic',
                price: '$29',
                period: '/month',
                users: '50 users',
                items: '500 items',
                features: ['Custom branding', 'Priority support', 'Advanced reports'],
                popular: false
              },
              {
                name: 'Premium',
                price: '$99',
                period: '/month',
                users: '200 users',
                items: '2,000 items',
                features: ['API access', 'Advanced analytics', 'White-label options'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: '$299',
                period: '/month',
                users: 'Unlimited',
                items: 'Unlimited',
                features: ['Dedicated support', 'Custom integrations', 'SLA guarantee'],
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 relative ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    <div>{plan.users}</div>
                    <div>{plan.items}</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setCurrentPage('public-sector-registration')}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Lost & Found Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of public sector organizations already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('public-sector-registration')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center"
            >
              Start Free Trial
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => setCurrentPage('login')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
          <p className="text-blue-100 text-sm mt-4">
            14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;