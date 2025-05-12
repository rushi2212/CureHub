import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/patient/DashboardLayout";
import BookAppointment from "../components/patient/BookAppointment";
import AppointmentsHistory from "../components/patient/AppointmentsHistory";
import EditProfile from "../components/patient/EditProfile";
import { 
  Calendar, 
  User, 
  ClipboardList, 
  MessageCircle, 
  FileText, 
  Video, 
  UserPlus, 
  Pill,
  MoreHorizontal
} from "lucide-react";
import Chatbot from "../components/patient/Chatbot";
import FileUpload from "../components/patient/FileUpload";
import MedicalVideoSearch from "../components/patient/MedicalVideoSearch";
import DoctorRecommendation from "../components/patient/DoctorRecommendation";
import MedicineAnalyzer from "../components/patient/MedicineAnalyzer";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("book");
  const [isLoading, setIsLoading] = useState(true);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("patientAuth");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const tabs = [
    {
      id: "book",
      label: "Book Appointment",
      icon: <ClipboardList size={18} />,
      shortLabel: "Book",
      priority: 1
    },
    {
      id: "history",
      label: "Appointment History",
      icon: <Calendar size={18} />,
      shortLabel: "History",
      priority: 2
    }, 
    { 
      id: "profile", 
      label: "Edit Profile", 
      icon: <User size={18} />,
      shortLabel: "Profile",
      priority: 3
    },
    { 
      id: "chatbot", 
      label: "ChatBot", 
      icon: <MessageCircle size={18} />,
      shortLabel: "Chat",
      priority: 4
    },
    { 
      id: "analyzer", 
      label: "File Analyzer", 
      icon: <FileText size={18} />,
      shortLabel: "Files",
      priority: 5
    },
    {
      id: "MedicalVideoSearch",
      label: "Medical Videos",
      icon: <Video size={18} />,
      shortLabel: "Videos",
      priority: 6
    },
    {
      id: "DoctorRecommendation",
      label: "Find Doctors",
      icon: <UserPlus size={18} />,
      shortLabel: "Doctors",
      priority: 7
    },
    {
      id: "MedicineAnalyzer",
      label: "Medicine Analyzer",
      icon: <Pill size={18} />,
      shortLabel: "Medicine",
      priority: 8
    },
  ];

  // Separate tabs into primary (shown in mobile nav) and secondary (in more menu)
  const primaryTabs = tabs.filter(tab => tab.priority <= 4);
  const secondaryTabs = tabs.filter(tab => tab.priority > 4);

  // Function to handle tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMoreMenuOpen(false); // Close more menu when a tab is selected
    window.scrollTo(0, 0);
  };

  // Toggle more menu
  const toggleMoreMenu = () => {
    setMoreMenuOpen(!moreMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded mb-3"></div>
          <div className="h-3 w-24 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Render appropriate component based on active tab
  const renderComponent = () => {
    switch (activeTab) {
      case "book":
        return <BookAppointment />;
      case "history":
        return <AppointmentsHistory setActiveTab={setActiveTab} />;
      case "profile":
        return <EditProfile />;
      case "chatbot":
        return <Chatbot />;
      case "analyzer":
        return <FileUpload />;
      case "MedicalVideoSearch":
        return <MedicalVideoSearch />;
      case "DoctorRecommendation":
        return <DoctorRecommendation />;
      case "MedicineAnalyzer":
        return <MedicineAnalyzer />;
      default:
        return <BookAppointment />;
    }
  };

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={handleTabChange}
      tabs={tabs}
    >
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
          {/* Content area with proper spacing for mobile bottom nav */}
          <div className="transition-all duration-300 min-h-[60vh] pb-16 md:pb-0">
            {renderComponent()}
          </div>
        </div>
        
        {/* Mobile Tab Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-1 py-2 flex justify-between z-20">
          {primaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-1 py-1 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1 font-medium">{tab.shortLabel}</span>
            </button>
          ))}
          
          {/* More button */}
          <button
            onClick={toggleMoreMenu}
            className={`flex flex-col items-center justify-center px-1 py-1 rounded-md transition-colors ${
              secondaryTabs.some(tab => tab.id === activeTab) || moreMenuOpen
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500 hover:bg-gray-50"  
            }`}
          >
            <MoreHorizontal size={18} />
            <span className="text-xs mt-1 font-medium">More</span>
          </button>
        </div>

        {/* More menu dropdown for mobile */}
        {moreMenuOpen && (
          <div className="md:hidden fixed bottom-16 right-0 bg-white shadow-lg border border-gray-200 rounded-tl-lg z-20 w-48">
            <div className="p-2 flex flex-col">
              {secondaryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Backdrop for more menu */}
        {moreMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-10 z-10"
            onClick={() => setMoreMenuOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;