import React, { useState } from "react";
import {
  ArrowRight,
  Building2,
  Shield,
  Clock,
  UserPlus,
  Activity,
  Calendar,
  ClipboardCheck,
  Users,
  HeartPulse,
  Award,
  FileHeart,
  Menu,
  X,
} from "lucide-react";

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <HeartPulse className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-blue-800">
                  CureHub
                </span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a
                  href="#"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Doctors
                </a>
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-200"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition duration-200"
              >
                Sign Up
              </a>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Services
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Doctors
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                About
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Contact
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 px-4">
                <a
                  href="/login"
                  className="block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className="block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition duration-200"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Medical Illustration */}
      <div className="relative overflow-hidden py-12 md:py-16 lg:py-24 bg-cover bg-center">
        {/* Background image with reduced opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('/src/assets/hospital.jpg')`,
          }}
        ></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block p-2 bg-blue-100 rounded-lg mb-4">
                <HeartPulse className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl tracking-tight font-extrabold text-blue-900 sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block">Healthcare</span>
                <span className="block text-blue-600">Simplified</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
                CureHub provides an integrated platform for managing patient
                care, appointments, and hospital resources with efficiency and
                care.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div>
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition duration-200 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 md:mt-0">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-40 h-40 bg-blue-300 rounded-full opacity-30 filter blur-3xl"></div>
                <div className="absolute top-0 -right-4 w-40 h-40 bg-blue-500 rounded-full opacity-30 filter blur-3xl"></div>
                <div className="absolute -bottom-8 left-20 w-40 h-40 bg-blue-400 rounded-full opacity-30 filter blur-3xl"></div>
                <div className="relative">
                  <img
                    src="/src/assets/logo_transparent.png"
                    className="rounded-2xl shadow-lg object-cover w-full h-64 sm:h-80 md:h-80 lg:h-96"
                    alt="Healthcare Illustration"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-blue-900 sm:text-3xl md:text-4xl">
              Complete Healthcare Solutions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500">
              Everything you need to manage your healthcare practice efficiently
            </p>
          </div>

          <div className="mt-12 md:mt-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="p-3 bg-blue-100 inline-block rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-medium text-blue-900">
                  Smart Scheduling
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Intelligent appointment management system that optimizes
                  doctor availability and patient convenience.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="p-3 bg-blue-100 inline-block rounded-lg">
                  <ClipboardCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-medium text-blue-900">
                  Electronic Records
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Secure and comprehensive electronic health records system for
                  seamless patient information management.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="p-3 bg-blue-100 inline-block rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-medium text-blue-900">
                  Data Security
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Advanced security protocols to protect sensitive patient data
                  and maintain HIPAA compliance.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="p-3 bg-blue-100 inline-block rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-medium text-blue-900">
                  Team Collaboration
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Tools for seamless communication between doctors, nurses, and
                  administrative staff.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="p-3 bg-blue-100 inline-block rounded-lg">
                  <FileHeart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-medium text-blue-900">
                  Patient Portal
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Patient-friendly interface for accessing medical records,
                  scheduling appointments, and communicating with providers.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="p-3 bg-blue-100 inline-block rounded-lg">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-medium text-blue-900">
                  Quality Assurance
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Built-in tools for tracking and maintaining high standards of
                  patient care and satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-blue-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-blue-900 sm:text-3xl md:text-4xl">
            Trusted by Healthcare Professionals
          </h2>
          <div className="mt-12 space-y-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-6 lg:gap-x-8 md:gap-y-8 md:space-y-0">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  DC
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-blue-900">
                    Dr. Carla Thompson
                  </h4>
                  <p className="text-sm text-gray-500">Family Physician</p>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600">
                "CureHub has transformed how we manage our practice. The
                scheduling system alone has saved us countless hours."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  JR
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-blue-900">
                    James Rodriguez
                  </h4>
                  <p className="text-sm text-gray-500">
                    Hospital Administrator
                  </p>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600">
                "The analytics and reporting features have given us valuable
                insights to improve our operational efficiency."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  LP
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-blue-900">
                    Dr. Lisa Park
                  </h4>
                  <p className="text-sm text-gray-500">Pediatrician</p>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600">
                "My patients love the easy-to-use portal for scheduling
                appointments and accessing their records."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <circle fill="white" cx="5" cy="5" r="1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
              Ready to transform your healthcare practice?
            </h2>
            <p className="mt-4 text-base md:text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of healthcare professionals already using CureHub
              to improve patient care.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <a
                  href="/signup"
                  className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-200"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
              <div>
                <a
                  href="/demo"
                  className="w-full inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition duration-200"
                >
                  Request Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                Solutions
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    For Hospitals
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    For Clinics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    For Specialists
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    For Patients
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    API Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Jobs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    HIPAA
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-base text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <HeartPulse className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <span className="ml-2 text-xl md:text-2xl font-bold text-blue-800">
                CureHub
              </span>
            </div>
            <p className="mt-4 md:mt-0 text-sm md:text-base text-gray-500">
              &copy; 2025 CureHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
