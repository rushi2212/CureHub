import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AddPrescriptionForm from "./AddPrescriptionForm";

const DoctorPrescriptionDashboard = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter only accepted
      const accepted = data.filter((appt) => appt.status === "Accepted");
      setAppointments(accepted);
      console.log(accepted);
    } catch (err) {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
  }, []);

  const handleGivePrescription = (patient) => {
    setSelectedPatient(patient);
    // Smooth scroll to the form
    setTimeout(() => {
      document
        .getElementById("prescriptionForm")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSuccess = () => {
    // after saving prescription, close form and refresh
    setSelectedPatient(null);
    fetchAppointments();
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
  (appointment) =>
     (appointment.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.symptoms.toLowerCase().includes(searchTerm.toLowerCase())) 
     && !appointment.isFilled 
    // Only show appointments where prescription is NOT filled
);




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8 md:flex md:items-center md:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-gray-800"
            >
              Prescription Dashboard
            </motion.h1>
            <p className="text-gray-600 mt-1">
              Manage prescriptions for accepted appointments
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patient or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-3 text-gray-600">Loading appointments...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
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
        )}

        {/* Appointments Grid */}
        {!loading && !error && (
          <>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                {searchTerm ? (
                  <div>
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No matching appointments
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Try adjusting your search term.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setSearchTerm("")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Clear search
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No accepted appointments
                    </h3>
                    <p className="mt-1 text-gray-500">
                      You have no active appointments requiring prescriptions.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredAppointments.map((patient, index) => (
                    <motion.div
                      key={patient.appointmentId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b flex justify-between items-center">
                          <h3 className="font-semibold text-lg text-gray-800 truncate">
                            {patient.patientName}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            {new Date(patient.date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 text-gray-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600 truncate">
                                {patient.patientEmail}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 text-gray-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">
                                {patient.time}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Symptoms
                            </div>
                            <p className="text-sm text-gray-800 h-12 overflow-hidden text-ellipsis">
                              {patient.symptoms}
                            </p>
                          </div>

                          {/* Prescription Status */}
                          <div className="mt-4 flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                patient.hasPrescription
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                              }`}
                            ></div>
                            <span className="text-xs text-gray-500">
                              {patient.hasPrescription
                                ? "Prescription Added"
                                : "Needs Prescription"}
                            </span>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="border-t px-4 py-3">
                          <button
                            onClick={() => handleGivePrescription(patient)}
                            className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            {patient.hasPrescription
                              ? "Update Prescription"
                              : "Add Prescription"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {/* Prescription Form */}
        {selectedPatient && (
          <motion.div
            id="prescriptionForm"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Prescription Details
              </h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <AddPrescriptionForm
              appointment={selectedPatient}
              onSuccess={handleSuccess}
              doctorId={doctorId}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptionDashboard;
