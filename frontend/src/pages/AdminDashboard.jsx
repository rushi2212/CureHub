// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AddDoctor from "../components/Admin/AddDoctor";
import DoctorList from "../components/Admin/DoctorList";
import axios from "axios";
import { toast } from "react-toastify";

// Import icons
import {
  Users,
  UserPlus,
  Home,
  Settings,
  BarChart,
  Calendar,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";

function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if screen is mobile on component mount and window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        // Close mobile menu when switching to desktop
        setMobileMenuOpen(false);
      }
    };
    
    // Set initial state based on window size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    
    // Clean up event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar animation variants
  const sidebarVariants = {
    open: { width: "240px", transition: { duration: 0.3 } },
    closed: { width: "80px", transition: { duration: 0.3 } },
    mobileOpen: { 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    mobileClosed: { 
      x: "-100%",
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  // Dashboard items animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const redirectToLogin = () => {
    window.location.href = "/login";
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "addDoctor":
        return <AddDoctor />;
      case "doctorList":
        return <DoctorList />;
      default:
        return <DashboardOverview doctors={doctors} patients={patients} />;
    }
  };
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("adminAuth");
        if (!token) {
          toast.error("Authentication required");
          return;
        }
  
        const response = await axios.get("/api/admin/doctors", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        setDoctors(response.data);
 
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Error fetching doctors");
     
      }
    };
  
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("adminAuth");
        if (!token) {
          toast.error("Authentication required");
          return;
        }
  
        const response = await axios.get("/api/admin/patients", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        setPatients(response.data);
       
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Error fetching patients");
      
      }
    };
  
    fetchPatients();
  }, []);

  const handleSidebarItemClick = (component) => {
    setActiveComponent(component);
    // On mobile, close the sidebar after item selection
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">MediAdmin</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Desktop view is controlled by sidebarOpen, mobile by mobileMenuOpen */}
      <motion.div
        className={`bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-xl 
                   fixed md:relative z-30 h-full 
                   ${isMobile ? 'w-64' : ''}`}
        variants={sidebarVariants}
        animate={
          isMobile 
            ? (mobileMenuOpen ? "mobileOpen" : "mobileClosed") 
            : (sidebarOpen ? "open" : "closed")
        }
        initial={isMobile ? "mobileClosed" : "open"}
      >
        <div className="p-4 flex items-center justify-between">
          {(sidebarOpen || isMobile) && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold"
            >
              MediAdmin
            </motion.h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-blue-700 transition-colors hidden md:block"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>
        <nav className="mt-6 flex flex-col h-[calc(100%-80px)] justify-between">
          <div>
            <SidebarItem
              icon={<Home size={20} />}
              text="Dashboard"
              isActive={activeComponent === "dashboard"}
              onClick={() => handleSidebarItemClick("dashboard")}
              isExpanded={sidebarOpen || isMobile}
            />
            <SidebarItem
              icon={<UserPlus size={20} />}
              text="Add Doctor"
              isActive={activeComponent === "addDoctor"}
              onClick={() => handleSidebarItemClick("addDoctor")}
              isExpanded={sidebarOpen || isMobile}
            />
            <SidebarItem
              icon={<Users size={20} />}
              text="Doctor List"
              isActive={activeComponent === "doctorList"}
              onClick={() => handleSidebarItemClick("doctorList")}
              isExpanded={sidebarOpen || isMobile}
            />
          </div>

          <div className="mt-auto">
            <SidebarItem
              icon={<LogOut size={20} />}
              text="Logout"
              isActive={false}
              onClick={() => redirectToLogin()}
              isExpanded={sidebarOpen || isMobile}
            />
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Desktop Header */}
        <header className="bg-white shadow-md p-4 hidden md:block">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeComponent === "dashboard" && "Dashboard Overview"}
              {activeComponent === "addDoctor" && "Add New Doctor"}
              {activeComponent === "doctorList" && "Manage Doctors"}
              {activeComponent === "appointments" && "Appointments"}
              {activeComponent === "analytics" && "Analytics"}
              {activeComponent === "settings" && "Settings"}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Title for Mobile */}
        <div className="p-4 bg-white shadow-sm md:hidden">
          <h1 className="text-xl font-bold text-gray-800">
            {activeComponent === "dashboard" && "Dashboard Overview"}
            {activeComponent === "addDoctor" && "Add New Doctor"}
            {activeComponent === "doctorList" && "Manage Doctors"}
            {activeComponent === "appointments" && "Appointments"}
            {activeComponent === "analytics" && "Analytics"}
            {activeComponent === "settings" && "Settings"}
          </h1>
        </div>

        {/* Main Content Area */}
        <motion.div
          className="p-4 md:p-6 flex-1 overflow-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          key={activeComponent}
        >
          {renderComponent()}
        </motion.div>
      </div>
    </div>
  );
}

// Sidebar Item Component
const SidebarItem = ({ icon, text, isActive, onClick, isExpanded }) => {
  return (
    <motion.div
      className={`flex items-center p-4 ${
        isActive ? "bg-blue-700" : "hover:bg-blue-700"
      } cursor-pointer transition-colors`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center">{icon}</div>
      {isExpanded && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="ml-4 whitespace-nowrap"
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ doctors, patients }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <motion.div
        className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-blue-500"
        variants={itemVariants}
      >
        <h3 className="text-lg font-bold text-gray-700 mb-2">Total Doctors</h3>
        <p className="text-3xl font-bold text-blue-600">{doctors.length}</p>
        <p className="text-sm text-gray-500 mt-2">+3 this month</p>
      </motion.div>

      <motion.div
        className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-green-500"
        variants={itemVariants}
      >
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          Active Patients
        </h3>
        <p className="text-3xl font-bold text-green-600">{patients.length}</p>
        <p className="text-sm text-gray-500 mt-2">+12 this week</p>
      </motion.div>

      <motion.div
        className="bg-white rounded-lg shadow-md p-4 md:p-6 col-span-1 sm:col-span-2 lg:col-span-3"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-700">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:underline">View All</button>
        </div>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                {item}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">New doctor registered</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Dr. John Smith was added to the system
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;