import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Calendar, User, Clock, FileText, Search, Filter, 
  X, ChevronDown, XCircle, Calendar as CalendarIcon,
  AlertCircle, CheckCircle, RefreshCw, FileCheck
} from "lucide-react";

const AppointmentsHistory = ({setActiveTab}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("patientAuth");
        if (!token) {
          toast.error("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/patient/appointments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching appointments");
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("patientAuth");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.delete(`/api/patient/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI after deletion
      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== appointmentId)
      );
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle size={16} className="mr-2 text-green-600" />;
      case "Rejected":
        return <XCircle size={16} className="mr-2 text-red-600" />;
      case "Pending":
        return <RefreshCw size={16} className="mr-2 text-yellow-600" />;
      case "Completed":
        return <FileCheck size={16} className="mr-2 text-blue-600" />;
      case "Cancelled":
        return <AlertCircle size={16} className="mr-2 text-gray-600" />;
      default:
        return <AlertCircle size={16} className="mr-2 text-gray-600" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const toggleAppointmentExpand = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    // Text search
    const doctorName = appointment.doctorId?.name?.toLowerCase() || "";
    const doctorSpecialization = appointment.doctorId?.specialization?.toLowerCase() || "";
    const symptoms = appointment.symptoms?.toLowerCase() || "";
    const textMatch = 
      doctorName.includes(searchTerm.toLowerCase()) || 
      doctorSpecialization.includes(searchTerm.toLowerCase()) ||
      symptoms.includes(searchTerm.toLowerCase());
    
    // Status filter
    const statusMatch = !statusFilter || appointment.status === statusFilter;
    
    // Date filter
    let dateMatch = true;
    if (dateFilter.from && dateFilter.to) {
      const appointmentDate = new Date(appointment.date);
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      dateMatch = appointmentDate >= fromDate && appointmentDate <= toDate;
    }
    
    return textMatch && statusMatch && dateMatch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2 flex items-center">
        <CalendarIcon size={24} className="mr-2 sm:mr-3 text-indigo-600" />
        Your Appointment History
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">View and manage all your scheduled appointments</p>
      
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
              <Search size={16} className="text-indigo-500" />
            </div>
            <input
              type="text"
              className="pl-10 sm:pl-12 w-full p-3 sm:p-4 bg-gray-50 border-2 border-indigo-100 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none transition-all shadow-sm text-sm sm:text-base"
              placeholder="Search by doctor, specialization or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-indigo-50 text-indigo-700 rounded-lg sm:rounded-xl hover:bg-indigo-100 transition-all font-medium text-sm sm:text-base w-full sm:w-auto"
          >
            <Filter size={16} className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg sm:rounded-xl mt-4 border border-indigo-100 animate-fadeIn shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 sm:p-3 bg-white border-2 border-indigo-100 rounded-md sm:rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none shadow-sm text-sm sm:text-base"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">From Date</label>
                <input
                  type="date"
                  value={dateFilter.from || ''}
                  onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
                  className="w-full p-2 sm:p-3 bg-white border-2 border-indigo-100 rounded-md sm:rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none shadow-sm text-sm sm:text-base"
                />
              </div>
              
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">To Date</label>
                <input
                  type="date"
                  value={dateFilter.to || ''}
                  onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
                  className="w-full p-2 sm:p-3 bg-white border-2 border-indigo-100 rounded-md sm:rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setDateFilter({ from: null, to: null });
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 text-indigo-600 bg-white border border-indigo-200 rounded-md sm:rounded-lg hover:bg-indigo-50 transition-all font-medium shadow-sm text-sm sm:text-base"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center py-10 sm:py-16 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={28} className="text-indigo-600" />
          </div>
          <h3 className="text-gray-800 text-lg sm:text-xl font-semibold mb-2">No appointments yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6 px-4 text-sm sm:text-base">You haven't scheduled any appointments with our doctors. Book your first appointment to get started.</p>
          <button 
            className="px-5 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-md sm:rounded-lg hover:bg-indigo-700 transition-all shadow-md font-medium text-sm sm:text-base" 
            onClick={() => setActiveTab("book")}
          >
            Book Your First Appointment
          </button>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-12 sm:w-16 h-12 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Search size={20} className="text-yellow-600" />
          </div>
          <h3 className="text-gray-800 text-base sm:text-lg font-semibold mb-1">No matching appointments</h3>
          <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredAppointments.map((appointment) => (
            <div 
              key={appointment._id} 
              className={`border-2 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-lg transition-all ${
                expandedAppointment === appointment._id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div 
                className="cursor-pointer"
                onClick={() => toggleAppointmentExpand(appointment._id)}
              >
                <div className="bg-white p-3 sm:p-4">
                  <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
                    <div className="sm:col-span-1 lg:col-span-2 flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                        <User size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                          Dr. {appointment.doctorId?.name}
                        </h3>
                        <p className="text-indigo-600 font-medium text-sm sm:text-base">
                          {appointment.doctorId?.specialization}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2 sm:mt-0">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <p className="text-gray-800 text-sm sm:text-base">{formatDate(appointment.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-1 sm:mt-0">
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-500 mr-2" />
                        <p className="text-gray-800 text-sm sm:text-base">{appointment.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end mt-3 sm:mt-0 sm:col-span-2 lg:col-span-1">
                      <span
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium border flex items-center ${getStatusBadgeClass(appointment.status)}`}
                      >
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>
                      
                      <ChevronDown 
                        size={18} 
                        className={`text-gray-400 transition-transform duration-200 ml-2 sm:ml-4 ${
                          expandedAppointment === appointment._id ? 'transform rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedAppointment === appointment._id && (
                <div className="p-3 sm:p-5 border-t border-gray-200 bg-white animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-md sm:rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FileText size={16} className="text-indigo-500 mr-2" />
                        Symptoms & Concerns
                      </h4>
                      <p className="text-gray-600 whitespace-pre-line text-sm sm:text-base">
                        {appointment.symptoms}
                      </p>
                    </div>
                    
                    <div className="flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Appointment Details</h4>
                        <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                          <li className="flex flex-wrap sm:flex-nowrap">
                            <span className="font-medium w-24 sm:w-32">Appointment ID:</span>
                            <span>{appointment._id.substring(0, 8)}...</span>
                          </li>
                          <li className="flex flex-wrap sm:flex-nowrap">
                            <span className="font-medium w-24 sm:w-32">Created On:</span>
                            <span>{formatDate(appointment.createdAt || appointment.date)}</span>
                          </li>
                          <li className="flex flex-wrap sm:flex-nowrap">
                            <span className="font-medium w-24 sm:w-32">Location:</span>
                            <span>Virtual Consultation</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                        {appointment.status === "Pending" && (
                          <button 
                            onClick={() => cancelAppointment(appointment._id)} 
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-red-600 bg-white border-2 border-red-200 rounded-md sm:rounded-lg hover:bg-red-50 transition-all font-medium flex items-center justify-center text-sm sm:text-base"
                          >
                            <XCircle size={16} className="mr-2" />
                            Cancel Appointment
                          </button>
                        )}
                        {appointment.status === "Completed" && (
                          <button 
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-indigo-300 text-indigo-600 rounded-md sm:rounded-lg hover:bg-indigo-50 transition-all font-medium flex items-center justify-center text-sm sm:text-base"
                          >
                            <FileCheck size={16} className="mr-2" />
                            View Prescription
                          </button>
                        )}
                      </div>
                    </div>
                   
                   {appointment.prescription && appointment.prescription.length > 0 && (
                    <div className="md:col-span-2 bg-green-50 p-3 sm:p-4 rounded-md sm:rounded-lg mt-4">
                      <h4 className="font-medium text-green-700 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <FileCheck size={16} className="text-green-600 mr-2" />
                        Prescription
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {appointment.prescription.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white border border-green-200 rounded-md sm:rounded-lg p-3 sm:p-4 shadow-sm"
                          >
                            <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">
                              <span className="font-semibold">Medicine:</span> {item.medicine}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">
                              <span className="font-semibold">Dosage:</span> {item.dosage}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700">
                              <span className="font-semibold">Instructions:</span> {item.instructions}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                   )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {filteredAppointments.length > 0 && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center bg-indigo-50 p-3 sm:p-4 rounded-md sm:rounded-xl">
          <p className="text-gray-700 text-sm sm:text-base mb-2 sm:mb-0">
            Showing <span className="font-medium">{filteredAppointments.length}</span> of <span className="font-medium">{appointments.length}</span> appointments
          </p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-sm sm:text-base">
            Export Appointments
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsHistory;