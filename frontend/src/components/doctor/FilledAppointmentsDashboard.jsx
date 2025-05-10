import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const FilledAppointmentsDashboard = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // keep only those with isFilled === true
      const filled = data.filter((appt) => appt.isFilled === true);
      setAppointments(filled);
    } catch (err) {
      setError("Failed to load filled appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
  
  // 🆕 Filtered Appointments
  const filteredAppointments = appointments.filter((appt) =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-gray-600">Loading filled appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No filled prescriptions
        </h3>
        <p className="mt-1 text-gray-500">
          You don't have any appointments with filled prescriptions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
        >
          Filled Prescriptions
        </motion.h1>

        {/* 🆕 Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAppointments.map((appt, idx) => (
              <motion.div
                key={appt.appointmentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {appt.patientName}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      {new Date(appt.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="text-sm text-gray-600">
                      <strong>Email:</strong> {appt.patientEmail}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Time:</strong> {appt.time}
                    </div>

                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Symptoms
                      </div>
                      <p className="text-sm text-gray-800 h-12 overflow-hidden text-ellipsis">
                        {appt.symptoms}
                      </p>
                    </div>

                    {/* New Prescription Section */}
                    {appt.prescription.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Prescription
                        </div>
                        <ul className="list-disc list-inside text-sm text-gray-800 max-h-24 overflow-y-auto">
                          {appt.prescription.map((med, i) => (
                            <li key={med._id || i} className="mb-1">
                              <span className="font-medium">{med.medicine}</span>{" "}
                              ({med.dosage}) — <em>{med.instructions}</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FilledAppointmentsDashboard;
