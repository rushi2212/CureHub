import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const ResponsiveFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload!");
      return;
    }
    
    setIsProcessing(true);
    setUploadStatus(null);
    
    // Simulate API call
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadStatus({ 
        success: { 
          analysis: "# Analysis Results\n\nThis is a sample analysis result that would be returned from your API." 
        } 
      });
      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus({ error: "File upload failed. Please try again." });
      toast.error("File upload failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // Extract markdown content from response
  const getMarkdownContent = () => {
    if (!uploadStatus?.success?.analysis) return null;
    return uploadStatus.success.analysis;
  };

  const markdownContent = getMarkdownContent();

  return (
    <div className="w-full p-4 sm:p-6 md:max-w-5xl md:mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Main Container - fully responsive with proper padding on all devices */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Header - text sizes adjust for different screens */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-4 sm:px-6 md:px-8 py-4 sm:py-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full filter blur-3xl transform -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-300 rounded-full filter blur-3xl transform translate-x-20 translate-y-20"></div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
          >
            Medical Report Analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 mt-2 text-sm sm:text-base"
          >
            Upload your medical reports for comprehensive AI-powered analysis
          </motion.p>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Upload section - stacks on mobile, side by side on larger screens */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch md:items-center mb-6 md:mb-8">
            <motion.div
              className={`w-full md:w-3/4 relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300"
              } rounded-xl px-4 sm:px-6 py-6 sm:py-10 text-center cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col justify-center min-h-[180px]`}
              whileHover={{ scale: 1.01 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 sm:h-16 sm:w-16 mx-auto text-indigo-500 mb-2 sm:mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </motion.svg>
                <p className="text-gray-800 font-medium text-base sm:text-lg">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm">
                  Supports medical reports, lab results, images, and PDFs
                </p>
              </label>
            </motion.div>

            {/* Button takes full width on mobile, proper width on desktop */}
            <div className="w-full md:w-1/4 mt-3 md:mt-0">
              <motion.button
                onClick={handleUpload}
                disabled={isProcessing || selectedFiles.length === 0}
                className={`w-full px-4 py-3 sm:py-4 font-medium text-base sm:text-lg text-white rounded-lg transition-all duration-300 shadow-lg ${
                  isProcessing || selectedFiles.length === 0
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-200 hover:shadow-xl"
                }`}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.03 }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
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
                    Processing...
                  </span>
                ) : (
                  "Analyze Reports"
                )}
              </motion.button>
            </div>
          </div>

          {/* Selected Files - grid adjusts from 1 to 3 columns based on screen size */}
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div
                className="mb-6 sm:mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Selected Files ({selectedFiles.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {selectedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 pl-3 sm:pl-4 pr-2 sm:pr-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-between shadow-sm border border-blue-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div className="flex items-center truncate">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[240px]">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-1 sm:ml-2 text-indigo-500 hover:text-indigo-700 rounded-full p-1 hover:bg-indigo-100 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4"
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Status - adapts text and layout for smaller screens */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className="mb-6 sm:mb-8 bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-5 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <div className="flex-shrink-0 mb-3 sm:mb-0">
                    <svg
                      className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto sm:mx-0"
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
                  </div>
                  <div className="sm:ml-4 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-medium text-blue-800">
                      Processing your medical reports
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm sm:text-base text-blue-700">
                        Our advanced AI is analyzing your documents with
                        multiple specialized agents:
                      </p>
                      <div className="pl-2 sm:pl-4 space-y-1">
                        <motion.div
                          className="flex items-center text-xs sm:text-sm text-blue-600 justify-center sm:justify-start"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                          }}
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-1 sm:mr-2"></span>
                          <span>Gemini - Advanced medical text analysis</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center text-xs sm:text-sm text-blue-600 justify-center sm:justify-start"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            delay: 0.3,
                          }}
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-1 sm:mr-2"></span>
                          <span>Tavily - Medical research correlation</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center text-xs sm:text-sm text-blue-600 justify-center sm:justify-start"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            delay: 0.6,
                          }}
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-1 sm:mr-2"></span>
                          <span>PubMed - Scientific publication matching</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Handling - responsive text and layout */}
          <AnimatePresence>
            {uploadStatus?.error && (
              <motion.div
                className="mb-6 sm:mb-8 bg-red-50 border-l-4 border-red-500 p-3 sm:p-5 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                  <div className="flex-shrink-0 mb-3 sm:mb-0">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 text-red-500"
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
                  <div className="sm:ml-4 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-medium text-red-800">
                      Upload Failed
                    </h3>
                    <div className="mt-2 text-sm sm:text-base text-red-700">
                      <p>{uploadStatus.error}</p>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm sm:text-base"
                        onClick={() => setUploadStatus(null)}
                      >
                        Try Again
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Display - responsive layout for all screen sizes */}
          <AnimatePresence>
            {markdownContent && (
              <motion.div
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.6,
                }}
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center justify-center sm:justify-start mb-3 sm:mb-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6 mr-1.5 sm:mr-2 text-green-500"
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
                      Analysis Results
                    </h3>
                    <div className="flex space-x-2 sm:space-x-3 justify-center">
                      <motion.button
                        className="flex items-center text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          // Download functionality would go here
                          toast.info("Analysis downloaded");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        <span className="hidden sm:inline">Download</span>
                      </motion.button>
                      <motion.button
                        className="flex items-center text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          // Copy functionality would go here
                          toast.info("Analysis copied to clipboard");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        <span className="hidden sm:inline">Copy</span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-6 prose prose-sm sm:prose overflow-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh]">
                  {/* This would be your ReactMarkdown component to render the content */}
                  <div className="markdown-content">
                    <h1>Analysis Results</h1>
                    <p>This is a sample analysis result that would be returned from your API.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom styling for different screen sizes */}
      <style jsx>{`
        /* Custom scrollbar styling */
        .markdown-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
          color: #1e3a8a;
        }
        .markdown-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #1e40af;
        }
        .markdown-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          color: #3730a3;
        }
        .markdown-content p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        
        @media (min-width: 640px) {
          .markdown-content h1 {
            font-size: 1.8rem;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          .markdown-content h2 {
            font-size: 1.5rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .markdown-content h3 {
            font-size: 1.25rem;
            margin-top: 1.25rem;
          }
          .markdown-content p {
            margin-bottom: 1rem;
            line-height: 1.7;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveFileUpload;