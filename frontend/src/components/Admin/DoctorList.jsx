import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Trash2, Edit, Search, RefreshCw, CheckCircle, XCircle, Menu } from "lucide-react";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const token = localStorage.getItem("adminAuth");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/doctors", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setDoctors(response.data);
      } else {
        toast.error("Unexpected API response format.");
        setDoctors([]);
      }
    } catch (error) {
      toast.error("Error fetching doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDoctors();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`/api/admin/doctors/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } catch (error) {
        toast.error("Error deleting doctor");
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="w-full px-4 sm:px-6 lg:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold">Doctor Directory</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              aria-label="Refresh doctor list"
            >
              <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
            </motion.button>
          </div>
          <p className="text-blue-100 mt-2 text-sm sm:text-base">
            Manage all doctors in the system
          </p>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 flex items-center">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 outline-none w-full"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40 sm:h-64">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 mb-3 sm:mb-4">
                    <XCircle size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">No doctors found</h3>
                  <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                    {searchTerm ? "Try adjusting your search" : "Add a doctor to get started"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Desktop and tablet view */}
                  <div className="hidden sm:block">
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                              Specialization
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                              Status
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredDoctors.map((doctor, index) => (
                            <motion.tr 
                              key={doctor._id || index}
                              variants={itemVariants}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-medium">{doctor.name.charAt(0)}</span>
                                  </div>
                                  <div className="ml-3 sm:ml-4">
                                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">ID: {doctor._id?.slice(-5) || "N/A"}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{doctor.email}</div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                                <div className="text-sm text-gray-900">{doctor.specialization || "General"}</div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-1 sm:space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(doctor._id)}
                                    className="p-1 sm:p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                    aria-label="Delete doctor"
                                  >
                                    <Trash2 size={16} className="sm:hidden" />
                                    <Trash2 size={18} className="hidden sm:block" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile view */}
                  <div className="sm:hidden">
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      {filteredDoctors.map((doctor, index) => (
                        <motion.li 
                          key={doctor._id || index}
                          variants={itemVariants}
                          className="p-4 bg-white"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium">{doctor.name.charAt(0)}</span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                <div className="text-xs text-gray-500">ID: {doctor._id?.slice(-5) || "N/A"}</div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(doctor._id)}
                              className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                              aria-label="Delete doctor"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>

                          <div className="mt-2">
                            <div className="text-xs text-gray-500">Email</div>
                            <div className="text-sm text-gray-900 truncate">{doctor.email}</div>
                          </div>

                          <div className="mt-2 flex justify-between">
                            <div>
                              <div className="text-xs text-gray-500">Specialization</div>
                              <div className="text-sm text-gray-900">{doctor.specialization || "General"}</div>
                            </div>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 h-fit">
                              Active
                            </span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default DoctorList;