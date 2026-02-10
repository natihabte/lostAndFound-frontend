import React from 'react';
import { useTranslation } from 'react-i18next';
const TermsOfService = ({ onClose, darkMode }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex justify-between items-center`}>
          <h1 className="text-2xl font-bold flex items-center">
            
            Terms of Service
          </h1>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} text-2xl font-bold`}
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Last Updated */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <div className="flex items-center mb-2">
              
              <span className="font-semibold">Last Updated</span>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>January 12, 2026</p>
          </div>

          {/* Agreement */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              Agreement to Terms
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              By registering your organization and using the Public Sector Lost & Found Management SaaS Platform ("Platform"), 
              you agree to be bound by these Terms of Service ("Terms"). These Terms apply to all public sector organizations, 
              including universities, municipalities, hospitals, transport authorities, and government offices that use our services.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              Organization Eligibility
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              To register and use this Platform, your organization must meet the following criteria:
            </p>
            <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
              <li>Be a legitimate public sector organization (university, municipality, hospital, transport authority, or government office)</li>
              <li>Have legal authority to enter into binding agreements</li>
              <li>Provide accurate and complete registration information</li>
              <li>Designate an authorized administrator who is 18 years or older</li>
              <li>Comply with all applicable local, regional, and federal laws</li>
              <li>Maintain active operational status as a public institution</li>
            </ul>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Platform Services</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Our Platform provides the following services to registered public sector organizations:
            </p>
            <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
              <li>Multi-tenant lost and found item management system</li>
              <li>Secure user authentication and role-based access control</li>
              <li>Item reporting, searching, and claim management</li>
              <li>Email notifications and communication tools</li>
              <li>Administrative dashboards and reporting features</li>
              <li>Multi-language support (English, Amharic, Afaan Oromo, Tigrinya)</li>
              <li>Data backup and security measures</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              Acceptable Use Policy
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-green-600">Permitted Uses</h3>
                <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-1 ml-4`}>
                  <li>Report lost and found items within your organization</li>
                  <li>Search for items using the platform's search functionality</li>
                  <li>Facilitate legitimate item claims and returns</li>
                  <li>Manage user accounts within your organization</li>
                  <li>Generate reports for administrative purposes</li>
                  <li>Communicate with item owners and finders through the platform</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-red-600 flex items-center">
                  
                  Prohibited Activities
                </h3>
                <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-1 ml-4`}>
                  <li>Submit false, misleading, or fraudulent item reports</li>
                  <li>Use the platform for commercial or non-institutional purposes</li>
                  <li>Attempt to access other organizations' data or systems</li>
                  <li>Upload inappropriate, offensive, or illegal content</li>
                  <li>Impersonate other users or organizations</li>
                  <li>Interfere with platform security or functionality</li>
                  <li>Share login credentials or allow unauthorized access</li>
                  <li>Use automated tools to scrape or harvest data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Data Protection and Privacy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Organization Data</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  Your organization retains ownership of all data entered into the Platform. We implement industry-standard 
                  security measures to protect your data and ensure complete isolation between organizations in our multi-tenant architecture.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  We collect and process personal information in accordance with our Privacy Policy and applicable data protection laws. 
                  All personal data is handled with strict confidentiality and used solely for platform functionality.
                </p>
              </div>
            </div>
          </section>

          {/* Subscription and Billing */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Subscription and Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Free Trial</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  New organizations receive a 14-day free trial with access to basic features. No payment information is required during registration.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Subscription Plans</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  After the trial period, organizations may choose from our subscription plans (Free, Basic, Premium, Enterprise). 
                  Billing is processed monthly or annually based on your selected plan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Terms</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  Subscription fees are due in advance and are non-refundable except as required by law. 
                  We reserve the right to suspend services for non-payment after appropriate notice.
                </p>
              </div>
            </div>
          </section>

          {/* Security and Compliance */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              Security and Compliance
            </h2>
            <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4 mb-4`}>
              <div className="flex items-center mb-2">
                
                <span className="font-semibold text-yellow-800">Security Responsibilities</span>
              </div>
              <ul className="text-yellow-800 list-disc list-inside space-y-1">
                <li>Maintain strong passwords and secure login credentials</li>
                <li>Report security incidents or suspicious activities immediately</li>
                <li>Ensure only authorized personnel have access to your organization's account</li>
                <li>Comply with your organization's internal security policies</li>
                <li>Verify identity before releasing items to claimants</li>
              </ul>
            </div>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Service Availability</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be 
              announced in advance. We are not liable for service interruptions due to circumstances beyond our control.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Disclaimers</h2>
            <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
              <li>The Platform is provided "as is" without warranties of any kind</li>
              <li>We do not guarantee the recovery of lost items or successful claims</li>
              <li>Organizations are responsible for verifying item ownership and identity</li>
              <li>We are not liable for disputes between users or organizations</li>
              <li>Third-party integrations are subject to their own terms and conditions</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              Our liability is limited to the amount paid by your organization in the 12 months preceding any claim. 
              We are not liable for indirect, incidental, or consequential damages arising from use of the Platform.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Account Termination</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              Either party may terminate the service agreement with 30 days' notice. We may immediately suspend accounts 
              that violate these Terms. Upon termination, you may export your data within 30 days before permanent deletion.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Governing Law</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              These Terms are governed by the laws of the Federal Democratic Republic of Ethiopia. 
              Any disputes will be resolved through Ethiopian courts or agreed-upon arbitration procedures.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              Contact Information
            </h2>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 space-y-2`}>
              <div className="flex items-center">
                
                <span>legal@publicsectorlf.com</span>
              </div>
              <div className="flex items-center">
                
                <span>+251-11-XXX-XXXX</span>
              </div>
              <div className="flex items-center">
                
                <span>Public Sector Lost & Found Management Platform, Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              We may update these Terms periodically. Significant changes will be communicated via email and platform notifications. 
              Continued use of the Platform after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Acknowledgment */}
          <section className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              Acknowledgment
            </h2>
            <p className={`${darkMode ? 'text-blue-200' : 'text-blue-800'} leading-relaxed`}>
              By registering your public sector organization, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
              You confirm that you have the authority to bind your organization to these Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;