// frontend/src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserCircle,
  Calendar,
  Clock,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  FileText,
  History,
} from "lucide-react";
import EditProfile from "../components/doctor/EditProfile";
import Availability from "../components/doctor/Availability";
import Appointments from "../components/doctor/Appointments";
import PopupModal from "../model/PopUpModal";
import DoctorPrescriptionDashboard from "../components/doctor/DoctorPrescriptionDashboard ";
import FilledAppointmentsDashboard from "../components/doctor/FilledAppointmentsDashboard";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [doctor, setDoctor] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    // Set initial state
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(response.data);
        // Welcome modal for doctors
        setModalMessage(`Welcome back, Dr. ${response.data.name}!`);
        setShowModal(true);
      } catch (error) {
        toast.error("Error fetching profile");
        navigate("/login");
      }
    };

    fetchDoctorProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Close sidebar on mobile after tab selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded mb-3"></div>
          <div className="h-3 w-24 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <UserCircle className="mr-3" size={20} />,
    },
    {
      id: "availability",
      label: "Availability",
      icon: <Clock className="mr-3" size={20} />,
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: <Calendar className="mr-3" size={20} />,
    },
    {
      id: "prescription",
      label: "Give Prescription",
      icon: <FileText className="mr-3" size={20} />,
    },
    {
      id: "prescriptionhistory",
      label: "User Prescription History",
      icon: <History className="mr-3" size={20} />,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 ease-in-out transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 w-72 sm:w-80 lg:w-64 overflow-y-auto`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-blue-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center mr-3">
                <UserCircle size={24} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-gray-800 truncate">
                  Dr. {doctor.name}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {doctor.specialization || "Specialist"}
                </p>
              </div>
            </div>
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="py-6 flex-grow">
            <ul className="space-y-1">
              <li className="px-4 py-2 text-gray-500 text-sm font-medium">
                MENU
              </li>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 transition-colors duration-200 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border-r-4 border-indigo-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    {activeTab === item.id && (
                      <ChevronRight className="ml-auto" size={16} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-blue-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
            >
              <LogOut className="mr-3" size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow w-full lg:ml-0 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
          <button
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-800"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center flex-grow">
            <Home size={20} className="text-indigo-500 mr-2" />
            <span className="text-gray-500">/</span>
            <span className="ml-2 font-medium text-gray-800 capitalize">
              {activeTab}
            </span>
          </div>
          
          {/* Mobile user info */}
          <div className="lg:hidden flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <UserCircle size={20} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-3 sm:p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-3 sm:p-4 md:p-6">
              {activeTab === "profile" && (
                <EditProfile doctor={doctor} setDoctor={setDoctor} />
              )}
              {activeTab === "availability" && (
                <Availability doctorId={doctor._id} />
              )}
              {activeTab === "appointments" && (
                <Appointments doctorId={doctor._id} />
              )}
              {activeTab === "prescription" && (
                <DoctorPrescriptionDashboard doctorId={doctor._id} />
              )}
              {activeTab === "prescriptionhistory" && (
                <FilledAppointmentsDashboard />
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <PopupModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;