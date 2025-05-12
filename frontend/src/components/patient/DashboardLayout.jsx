import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  FileText,
  Video,
  UserCheck,
  Pill,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import PopupModal from "../../model/PopUpModal";

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Enhanced responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      // Auto open sidebar on desktop, close on mobile
      if (newWidth >= 1024) {
        setSidebarOpen(true);
      } else if (newWidth < 768 && isSidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial call to set correct state
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true);
    
    // Set a default expanded group for better mobile UX
    if (windowWidth < 768) {
      const activeGroup = findActiveGroup();
      if (activeGroup) {
        setExpanded(activeGroup);
      }
    }
  }, []);

  // Find which group contains the active tab
  const findActiveGroup = () => {
    for (const [groupName, items] of Object.entries(menuGroups)) {
      if (items.some(item => item.id === activeTab)) {
        return groupName;
      }
    }
    return null;
  };

  // Example of menu grouping - could be expanded with sub-items
  const menuGroups = {
    appointments: [
      {
        id: "book",
        icon: <ClipboardList size={windowWidth < 768 ? 16 : 17} />,
        label: "Book Appointment",
      },
      {
        id: "history",
        icon: <Calendar size={windowWidth < 768 ? 16 : 17} />,
        label: "Appointment History",
      },
    ],
    tools: [
      {
        id: "chatbot",
        icon: <MessageSquare size={windowWidth < 768 ? 16 : 17} />,
        label: "Symptom Checker",
      },
      {
        id: "analyzer",
        icon: <FileText size={windowWidth < 768 ? 16 : 17} />,
        label: "Report Analyzer",
      },
      {
        id: "MedicineAnalyzer",
        icon: <Pill size={windowWidth < 768 ? 16 : 17} />,
        label: "Medicine Analyzer",
      },
    ],
    discover: [
      {
        id: "MedicalVideoSearch",
        icon: <Video size={windowWidth < 768 ? 16 : 17} />,
        label: "Medical Videos",
      },
      {
        id: "DoctorRecommendation",
        icon: <UserCheck size={windowWidth < 768 ? 16 : 17} />,
        label: "Find Doctors",
      },
    ],
    account: [
      {
        id: "profile",
        icon: <User size={windowWidth < 768 ? 16 : 17} />,
        label: "Edit Profile",
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("patientAuth");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const showNotification = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const toggleGroup = (group) => {
    setExpanded(expanded === group ? null : group);
  };

  // Close sidebar when clicking a menu item on mobile
  const handleMenuItemClick = (tabId) => {
    setActiveTab(tabId);
    if (windowWidth < 1024) {
      setSidebarOpen(false);
    }
    
    // Auto expand the group containing this tab on mobile
    if (windowWidth < 768) {
      const groupName = Object.entries(menuGroups).find(([_, items]) => 
        items.some(item => item.id === tabId)
      )?.[0];
      
      if (groupName) {
        setExpanded(groupName);
      }
    }
  };

  // Get active tab label for mobile header
  const getActiveTabLabel = () => {
    for (const [_, items] of Object.entries(menuGroups)) {
      const activeItem = items.find(item => item.id === activeTab);
      if (activeItem) return activeItem.label;
    }
    return "Dashboard";
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Overlay (Mobile & Tablet) */}
      {isSidebarOpen && windowWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Responsive across all devices */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-3/4 xs:w-4/5 sm:w-64 lg:w-64 xl:w-72 bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-900 text-white transition-all duration-300 ease-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col shadow-2xl ${
          animate ? "animate-sidebar-entry" : ""
        }`}
      >
        {/* Sidebar Header - Adaptive sizing */}
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-indigo-500/30 bg-indigo-900/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 transition-all duration-500 hover:scale-110">
              <span className="text-white font-bold text-sm sm:text-base lg:text-lg bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent">
                CH
              </span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-wide whitespace-nowrap bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent animate-text-shimmer">
                Patient Portal
              </h1>
              <div className="h-0.5 w-full bg-gradient-to-r from-indigo-300 to-transparent rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-indigo-600/50 transition-colors lg:hidden backdrop-blur-sm hover:rotate-90 transform duration-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation - Improved scrollable area */}
        <div className="flex-1 overflow-y-auto scrollbar-styled">
          <nav className="p-2 sm:p-3 space-y-2 sm:space-y-4 lg:space-y-6">
            {Object.entries(menuGroups).map(([groupName, items]) => (
              <div key={groupName} className="space-y-1">
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="flex items-center justify-between w-full px-3 py-1.5 sm:py-2 text-xs uppercase font-semibold tracking-wider text-indigo-200/80 hover:text-white transition-colors group"
                >
                  {groupName}
                  <ChevronDown
                    size={windowWidth < 768 ? 12 : 14}
                    className={`transform transition-transform duration-200 ${
                      expanded === groupName ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`space-y-0.5 sm:space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    expanded === groupName || (windowWidth >= 1024 && expanded === null)
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-50"
                  }`}
                >
                  {items.map((item) => (
                    <SidebarLink
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeTab === item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      windowWidth={windowWidth}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile Section - Adjusted for mobile */}
        <div className="px-2 sm:px-3 py-2 sm:py-3 lg:py-4 border-t border-indigo-500/30 bg-indigo-900/20 backdrop-blur-sm">
          {/* Sidebar Footer */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 sm:py-2.5 mt-1 sm:mt-2 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-500/20 group transition-all duration-300 hover:pl-4"
          >
            <div className="p-1 sm:p-1.5 rounded-lg bg-red-500/20 mr-2 group-hover:bg-red-500/30 transition-colors">
              <LogOut
                size={windowWidth < 768 ? 14 : 16}
                className="text-red-200 group-hover:text-white transition-colors"
              />
            </div>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              Logout
            </span>
            <div className="ml-auto overflow-hidden">
              <ChevronRight
                size={windowWidth < 768 ? 14 : 16}
                className="transform translate-x-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header - Responsive for all devices */}
        <header className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6 bg-white border-b shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-md lg:hidden hover:bg-gray-100 transition-colors"
            >
              <Menu size={windowWidth < 768 ? 18 : 20} />
            </button>

            <div className="lg:hidden text-center ml-3 font-medium text-sm sm:text-base text-gray-800 truncate max-w-[180px] sm:max-w-xs">
              {/* Mobile title - shows the active section */}
              {getActiveTabLabel()}
            </div>
          </div>

          <div className="hidden lg:block font-medium text-gray-700">
            {/* Desktop breadcrumb or title */}
            <span>Patient Dashboard</span>
          </div>

          <div className="flex items-center ml-auto space-x-2 sm:space-x-3 lg:space-x-4">
            <button
              onClick={() => showNotification("You have no new notifications")}
              className="relative p-1 sm:p-1.5 lg:p-2 transition-transform rounded-full hover:bg-gray-100 hover:scale-110"
            >
              <Bell size={windowWidth < 768 ? 16 : 18} />
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 sm:w-1.5 lg:w-2 h-1.5 sm:h-1.5 lg:h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            {/* User avatar - responsive sizes */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
              ME
            </div>
          </div>
        </header>

        {/* Main Content Area - Responsive padding */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <PopupModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Global CSS for animations */}
      <GlobalStyles />
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick, windowWidth }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-1.5 sm:py-2 lg:py-2.5 text-left transition-all duration-300 rounded-lg group text-xs sm:text-sm relative overflow-hidden ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium shadow-lg"
          : "text-indigo-100 hover:bg-indigo-600/30"
      }`}
    >
      {/* Background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/50 to-indigo-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-2/3 bg-white rounded-r-full shadow-glow animate-pulse-slow" />
      )}

      {/* Icon wrapper - smaller on mobile */}
      <div
        className={`flex-shrink-0 mr-2 sm:mr-3 rounded-md p-1 sm:p-1.5 transition-all duration-300 ${
          active
            ? "bg-white/20 text-white"
            : "text-indigo-300 group-hover:text-white group-hover:bg-indigo-500/30"
        }`}
      >
        {icon}
      </div>

      {/* Label - truncate on small screens */}
      <span className="tracking-wide relative z-10 truncate">{label}</span>

      {/* Right arrow */}
      <ChevronRight
        size={windowWidth < 768 ? 12 : 14}
        className={`ml-auto transition-all duration-200 relative z-10 ${
          active
            ? "translate-x-0 opacity-100"
            : "opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"
        }`}
      />
    </button>
  );
};

// Global CSS for custom animations and effects
const GlobalStyles = () => (
  <style jsx global>{`
    /* Custom Scrollbar */
    .scrollbar-styled::-webkit-scrollbar {
      width: 3px;
    }

    .scrollbar-styled::-webkit-scrollbar-track {
      background: rgba(99, 102, 241, 0.1);
      border-radius: 10px;
    }

    .scrollbar-styled::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    .scrollbar-styled::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Firefox scrollbar */
    .scrollbar-styled {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) rgba(99, 102, 241, 0.1);
    }

    /* Shadow glow effect */
    .shadow-glow {
      box-shadow: 0 0 8px 1px rgba(255, 255, 255, 0.5);
    }

    /* Custom animations */
    @keyframes pulse-slow {
      0%,
      100% {
        opacity: 0.8;
      }
      50% {
        opacity: 0.5;
      }
    }

    @keyframes text-shimmer {
      0% {
        background-position: -100%;
      }
      100% {
        background-position: 200%;
      }
    }

    @keyframes sidebar-entry {
      0% {
        transform: translateX(-20px);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Animation classes */
    .animate-pulse-slow {
      animation: pulse-slow 3s ease-in-out infinite;
    }

    .animate-text-shimmer {
      background-size: 200% auto;
      animation: text-shimmer 4s linear infinite;
    }

    .animate-sidebar-entry {
      animation: sidebar-entry 0.5s ease-out forwards;
    }
    
    /* Make sure page doesn't overflow */
    html, body {
      overflow: hidden;
      height: 100%;
      width: 100%;
    }
    
  `}</style>
);

export default DashboardLayout;