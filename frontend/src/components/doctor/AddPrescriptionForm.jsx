import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";

const AddPrescriptionForm = ({ appointment, onSuccess, doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([
    { medicine: "", dosage: "", instructions: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  // Function handlers (unchanged)
  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine: "", dosage: "", instructions: "" },
    ]);
  };

  const handleRemovePrescription = (index) => {
    if (prescriptions.length <= 1) return;
    const newPrescriptions = [...prescriptions];
    newPrescriptions.splice(index, 1);
    setPrescriptions(newPrescriptions);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newPrescriptions = [...prescriptions];
    newPrescriptions[index][field] = value;
    setPrescriptions(newPrescriptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate prescriptions
    for (const [index, item] of prescriptions.entries()) {
      if (!item.medicine.trim()) {
        setError(`Medicine name is required for item ${index + 1}`);
        return;
      }
      if (!item.dosage.trim()) {
        setError(`Dosage is required for item ${index + 1}`);
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/doctor/appointments/${appointment.appointmentId}/prescription`,
        {
          prescription: prescriptions,
          doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      enqueueSnackbar("Prescription added successfully", {
        variant: "success",
      });
      onSuccess(response.data.appointment);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add prescription. Please try again.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Add Prescription
        </h2>
      </div>

      {/* Appointment Info Card */}
      <div className="p-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="w-28 text-sm font-medium text-gray-600">
                  Appointment ID:
                </span>
                <span className="font-semibold text-gray-800">
                  {appointment.appointmentId}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="w-28 text-sm font-medium text-gray-600">
                  Patient:
                </span>
                <span className="font-semibold text-gray-800">
                  {appointment.patientName}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-28 text-sm font-medium text-gray-600">
                  Email:
                </span>
                <span className="font-semibold text-gray-800 truncate">
                  {appointment.patientEmail}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <span className="w-28 text-sm font-medium text-gray-600">
                  Date:
                </span>
                <span className="font-semibold text-gray-800">
                  {appointment.date}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="w-28 text-sm font-medium text-gray-600">
                  Time:
                </span>
                <span className="font-semibold text-gray-800">
                  {appointment.time}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-28 text-sm font-medium text-gray-600">
                  Status:
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-100">
            <div className="flex items-start">
              <span className="w-28 text-sm font-medium text-gray-600">
                Symptoms:
              </span>
              <span className="font-semibold text-gray-800">
                {appointment.symptoms}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
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

        <form onSubmit={handleSubmit}>
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-5 bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
            >
              <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                #{index + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={prescription.medicine}
                    onChange={(e) =>
                      handlePrescriptionChange(
                        index,
                        "medicine",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={prescription.dosage}
                    onChange={(e) =>
                      handlePrescriptionChange(index, "dosage", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Twice daily after meals"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={prescription.instructions}
                    onChange={(e) =>
                      handlePrescriptionChange(
                        index,
                        "instructions",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="md:col-span-1 flex items-end justify-center">
                  {index === prescriptions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleAddPrescription}
                      className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemovePrescription(index)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all"
                    >
                      <svg
                        className="h-5 w-5"
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
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving Prescription...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Save Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddPrescriptionForm;
