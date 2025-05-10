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
  Pill 
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
    },
    {
      id: "history",
      label: "Appointment History",
      icon: <Calendar size={18} />,
      shortLabel: "History",
    }, 
    { 
      id: "profile", 
      label: "Edit Profile", 
      icon: <User size={18} />,
      shortLabel: "Profile", 
    },
    { 
      id: "chatbot", 
      label: "ChatBot", 
      icon: <MessageCircle size={18} />,
      shortLabel: "Chat", 
    },
    { 
      id: "analyzer", 
      label: "File Analyzer", 
      icon: <FileText size={18} />,
      shortLabel: "Files", 
    },
    {
      id: "MedicalVideoSearch",
      label: "Medical Videos",
      icon: <Video size={18} />,
      shortLabel: "Videos",
    },
    {
      id: "DoctorRecommendation",
      label: "Find Doctors",
      icon: <UserPlus size={18} />,
      shortLabel: "Doctors",
    },
    {
      id: "MedicineAnalyzer",
      label: "Medicine Analyzer",
      icon: <Pill size={18} />,
      shortLabel: "Medicine",
    },
  ];

  // Function to handle tab changes - can be enhanced for analytics or other needs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Could add scroll to top behavior for better mobile UX
    window.scrollTo(0, 0);
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
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6">
          <div className="transition-all duration-300 min-h-[60vh]">
            {renderComponent()}
          </div>
        </div>
        
        {/* Mobile Tab Navigation - Optional if not already in DashboardLayout */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-2 py-1 flex justify-between z-10">
          {tabs.slice(0, 4).map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.shortLabel}</span>
            </button>
          ))}
          <button
            onClick={() => {
              // Create and toggle a more menu for additional options
              const moreOptions = tabs.slice(4);
              // Implementation would depend on your app's navigation structure
              // This is a simple example showing how to cycle through additional tabs
              const currentIndex = moreOptions.findIndex(t => t.id === activeTab);
              const nextTab = moreOptions[(currentIndex + 1) % moreOptions.length].id;
              handleTabChange(nextTab);
            }}
            className="flex flex-col items-center justify-center px-2 py-1 rounded transition-colors text-gray-500"
          >
            <div className="relative">
              <span className="block w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="block w-1 h-1 bg-gray-500 rounded-full mt-1"></span>
              <span className="block w-1 h-1 bg-gray-500 rounded-full mt-1"></span>
            </div>
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;