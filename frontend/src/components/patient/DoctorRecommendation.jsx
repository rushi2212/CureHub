import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const DoctorRecommendation = () => {
  const [symptoms, setSymptoms] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all doctors when component mounts (for optional display)
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const response = await axios.get("/api/patient/doctors/data");
        setAllDoctors(response.data.doctors);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };
    fetchAllDoctors();
  }, []);

  const handleRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert input string to array of symptoms
      const symptomsArray = symptoms
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0);

      if (!symptomsArray.length) {
        throw new Error("Please enter at least one symptom");
      }

      const response = await axios.post("/api/patient/recommendations", {
        symptoms: symptomsArray,
      });

      setRecommendations(response.data.doctors);
      setShowAllDoctors(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowAllDoctors = () => {
    setShowAllDoctors(!showAllDoctors);
  };

  // Determine appropriate font size based on screen width
  const getTitleSize = () => {
    if (windowWidth < 640) return "text-2xl";
    return "text-3xl";
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg sm:shadow-xl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${getTitleSize()} font-bold text-center text-blue-800 mb-4 sm:mb-6 md:mb-8`}
      >
        AI-Powered Doctor Recommendations
      </motion.h2>

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleRecommendations}
        className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="symptoms"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Describe your symptoms (comma separated):
          </label>
          <input
            type="text"
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. fever, cough, headache, fatigue"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
          />
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Our AI will analyze your symptoms and match you with the most
            suitable doctors.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-white transition-all duration-300 text-sm sm:text-base ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                <span className="truncate">Analyzing with AI...</span>
              </div>
            ) : (
              "Find Recommended Doctors"
            )}
          </button>

          {/* View All Doctors Toggle Button - Commented out in original code */}
          {/* <button
            type="button"
            onClick={toggleShowAllDoctors}
            className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base"
          >
            {showAllDoctors ? "Hide All Doctors" : "View All Doctors"}
          </button> */}
        </div>
      </motion.form>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md"
        >
          <div className="flex items-center">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xs sm:text-sm text-red-700 flex-1">{error}</p>
          </div>
        </motion.div>
      )}

      {(recommendations.length > 0 || showAllDoctors) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="recommendations-results"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
            {showAllDoctors
              ? "All Available Doctors"
              : "AI-Recommended Doctors"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(showAllDoctors ? allDoctors : recommendations).map(
              (doctor, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={doctor._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg sm:hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 sm:h-2"></div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start mb-3 sm:mb-4">
                      {doctor.profileImg ? (
                        <img
                          src={doctor.profileImg}
                          alt={doctor.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mr-3 sm:mr-4 border-2 border-blue-100"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4">
                          <span className="text-xl sm:text-2xl text-blue-600 font-bold">
                            {doctor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                          Dr. {doctor.name}
                        </h4>
                        <p className="text-blue-600 font-medium text-sm sm:text-base truncate">
                          {doctor.specialization}
                        </p>
                        {!showAllDoctors && (
                          <div className="mt-1">
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                              AI Recommended
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-gray-600">
                      <p className="flex items-start">
                        <span className="mr-2 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500"
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
                        </span>
                        <span className="flex-1 min-w-0 truncate">{doctor.degree}</span>
                      </p>
                      <p className="flex items-start">
                        <span className="mr-2 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500"
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
                        </span>
                        <span>{doctor.experience} years experience</span>
                      </p>
                      {doctor.bio && (
                        <p className="flex items-start">
                          <span className="mr-2 mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                          <span className="line-clamp-2 flex-1">{doctor.bio}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-6 flex justify-between items-center">
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        View Profile
                      </button>
                      {doctor.availability &&
                        doctor.availability.length > 0 && (
                          <span className="text-xs sm:text-sm text-green-600 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Available
                          </span>
                        )}
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      )}

      {recommendations.length === 0 && !showAllDoctors && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 sm:py-8 md:py-12"
        >
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-200 mb-3 sm:mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-1 sm:mb-2">
            No recommendations yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            Enter your symptoms above and our AI will match you with the most
            suitable doctors based on your needs.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorRecommendation;