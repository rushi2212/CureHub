// import React, { useState } from "react";
// import axios from "axios";

// const FileUpload = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setError("");
//     setAnalysisResult(null);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!selectedFile) {
//       setError("Please select a file before submitting.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       setLoading(true);
//       setError("");

//       // Send the file to the backend API
//       const response = await axios.post(
//         "/api/patient/analyze", // Replace with your actual API endpoint
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setAnalysisResult(response.data.analysis);
//     } catch (err) {
//       setError("Failed to analyze the report. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h1 className="text-xl font-semibold mb-4">Upload and Analyze Report</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-2 font-medium text-gray-700">
//             Select File
//           </label>
//           <input
//             type="file"
//             accept=".pdf,.txt,.docx"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />
//         </div>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           disabled={loading}
//         >
//           {loading ? "Analyzing..." : "Submit"}
//         </button>
//       </form>
//       {analysisResult && (
//         <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
//           <h2 className="text-lg font-medium mb-2">Analysis Result</h2>
//           <pre className="text-sm overflow-auto">{JSON.stringify(analysisResult, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpload = () => {
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

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }

    setIsProcessing(true);
    setUploadStatus(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/analyze-reports/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadStatus({ success: response.data });
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
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full filter blur-3xl transform -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-300 rounded-full filter blur-3xl transform translate-x-20 translate-y-20"></div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            Medical Report Analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 mt-2"
          >
            Upload your medical reports for comprehensive AI-powered analysis
          </motion.p>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <motion.div
              className={`w-full md:w-3/4 relative bg-gradient-to-br from-gray-50 to-gray-100 border-3 border-dashed ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300"
              } rounded-xl px-6 py-10 text-center cursor-pointer transition-all duration-300 hover:shadow-md`}
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
                  className="h-16 w-16 mx-auto text-indigo-500 mb-4"
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
                <p className="text-gray-800 font-medium text-lg">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-gray-500 mt-2">
                  Supports medical reports, lab results, images, and PDFs
                </p>
              </label>
            </motion.div>

            <div className="w-full md:w-1/4">
              <motion.button
                onClick={handleUpload}
                disabled={isProcessing || selectedFiles.length === 0}
                className={`w-full px-4 py-4 font-medium text-lg text-white rounded-lg transition-all duration-300 shadow-lg ${
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

          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Files ({selectedFiles.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 pl-4 pr-3 py-2 rounded-lg text-sm flex items-center justify-between shadow-sm border border-blue-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div className="flex items-center truncate">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 flex-shrink-0"
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
                        <span className="truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 text-indigo-500 hover:text-indigo-700 rounded-full p-1 hover:bg-indigo-100 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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

          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
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
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-800">
                      Processing your medical reports
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-blue-700">
                        Our advanced AI is analyzing your documents with
                        multiple specialized agents:
                      </p>
                      <div className="pl-4 space-y-1">
                        <motion.div
                          className="flex items-center text-sm text-blue-600"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                          }}
                        >
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          <span>Gemini - Advanced medical text analysis</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center text-sm text-blue-600"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            delay: 0.3,
                          }}
                        >
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          <span>Tavily - Medical research correlation</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center text-sm text-blue-600"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            delay: 0.6,
                          }}
                        >
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          <span>PubMed - Scientific publication matching</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {uploadStatus?.error && (
              <motion.div
                className="mb-8 bg-red-50 border-l-4 border-red-500 p-5 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-red-500"
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
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-red-800">
                      Upload Failed
                    </h3>
                    <div className="mt-2 text-red-700">
                      <p>{uploadStatus.error}</p>
                    </div>
                    <div className="mt-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
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
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 text-green-500"
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
                    <div className="flex space-x-3 mt-2 sm:mt-0">
                      <motion.button
                        className="flex items-center text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          const blob = new Blob([markdownContent], {
                            type: "text/markdown",
                          });
                          const href = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = href;
                          link.download = "medical-analysis.md";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.info("Analysis downloaded");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
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
                        Download
                      </motion.button>
                      <motion.button
                        className="flex items-center text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          navigator.clipboard.writeText(markdownContent);
                          toast.info("Analysis copied to clipboard");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
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
                        Copy
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="p-6 prose prose-indigo max-w-none bg-white overflow-auto max-h-[60vh] custom-scrollbar">
                  {/* Using ReactMarkdown for proper markdown rendering */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // The wrapper component will receive all children and can add a className
                      wrapper: ({ children }) => (
                        <div className="markdown-content prose prose-indigo max-w-none">
                          {children}
                        </div>
                      ),
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }

        /* Markdown content styling */
        .markdown-content h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
          color: #1e3a8a;
        }
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1e40af;
        }
        .markdown-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #3730a3;
        }
        .markdown-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .markdown-content ul,
        .markdown-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content li {
          margin-bottom: 0.5rem;
        }
        .markdown-content code {
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .markdown-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
        }
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .markdown-content table th,
        .markdown-content table td {
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          text-align: left;
        }
        .markdown-content table th {
          background-color: #f9fafb;
        }
        .markdown-content hr {
          margin: 2rem 0;
          border-top: 1px solid #e5e7eb;
        }
        .markdown-content a {
          color: #4f46e5;
          text-decoration: underline;
        }
        .markdown-content a:hover {
          color: #4338ca;
        }
        .markdown-content img {
          max-width: 100%;
          border-radius: 0.375rem;
          margin: 1rem 0;
        }
      `}</style>
    </>
  );
};

export default FileUpload;
