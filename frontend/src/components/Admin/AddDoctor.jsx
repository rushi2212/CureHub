
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Mail, FileText, UserPlus, X } from "lucide-react";
import PopupModal from "../../model/PopUpModal"; 

function AddDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const token = localStorage.getItem("adminAuth");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "/api/admin/doctors",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModalMessage("Doctor added successfully! Credentials sent to their email.");
      toast.success("Doctor added successfully! Credentials sent to their email.");
      setFormData({ name: "", email: "", specialization: "", experience: "" });
    }catch (error) {
      setModalMessage(error.response?.data?.message || "Error adding doctor");
    } finally {
      setIsSubmitting(false);

    }
  };

  return (
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {modalMessage && <PopupModal message={modalMessage} onClose={() => setModalMessage(null)} />}
        <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Doctor</h2>
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-full bg-white bg-opacity-20"
            >
              <UserPlus size={24} />
            </motion.div>
          </div>
          <p className="text-blue-100 mt-2">
            Enter the details to add a new doctor to the system
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-gray-700 font-medium" htmlFor="name">
                Full Name
              </label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <div className="px-4 py-3 bg-gray-50 flex items-center">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-gray-700 font-medium" htmlFor="email">
                Email Address
              </label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <div className="px-4 py-3 bg-gray-50 flex items-center">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 outline-none"
                  placeholder="doctor@example.com"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 font-medium" htmlFor="specialization">
                Specialization
              </label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <div className="px-4 py-3 bg-gray-50 flex items-center">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 outline-none"
                  placeholder="Cardiology"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 font-medium" htmlFor="experience">
                Years of Experience
              </label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <div className="px-4 py-3 bg-gray-50 flex items-center">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 outline-none"
                  placeholder="5"
                  min="0"
                />
              </div>
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Add Doctor"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default AddDoctor;