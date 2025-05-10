import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Activity, User, ChevronDown, Loader } from "lucide-react";

const Chatbot = () => {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSend = async () => {
    if (symptoms.trim() && age.trim()) {
      const userMessage = { 
        sender: "You", 
        text: `Symptoms: ${symptoms}, Age: ${age}, Gender: ${gender}` 
      };
      setConversation(prev => [...prev, userMessage]);
      setLoading(true);

      try {
        const response = await axios.post(
          "/api/patient/chatbot",
          {
            message: `Symptoms: ${symptoms}, Age: ${age}, Gender: ${gender}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const botResponse = response.data.response || "No response from the server.";
        const botMessage = { sender: "Bot", text: botResponse };
        setConversation(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage = { 
          sender: "Bot", 
          text: "Sorry, I couldn't process your request. Please try again later." 
        };
        setConversation(prev => [...prev, errorMessage]);
      } finally {
        setLoading(false);
        setSymptoms("");
        setAge("");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper function to format the response
  const formatResponse = (text) => {
    if (!text.includes("Next Steps:")) {
      return <p className="whitespace-pre-line">{text}</p>;
    }

    const [conditionsText, nextStepsText] = text.split("Next Steps:");
    
    const conditions = conditionsText.trim().split("\n").filter(line => line.trim());
    const steps = nextStepsText ? nextStepsText.trim().split("\n").filter(step => step.trim()) : [];

    return (
      <div className="space-y-3">
        <div className="space-y-2">
          {conditions.map((condition, idx) => (
            <p key={idx} className="font-medium">{condition}</p>
          ))}
        </div>
        
        {steps.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold text-gray-800 mb-2">Next Steps:</h4>
            <ul className="space-y-1 pl-5">
              {steps.map((step, idx) => (
                <li key={idx} className="list-disc">{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col h-[600px] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl border-b border-blue-700 shadow-sm">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-bold">Medical Symptom Checker</h2>
          </div>
          <p className="text-blue-100 text-sm mt-1">Get preliminary insights about your symptoms</p>
        </div>
        
        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium">Welcome to the Symptom Checker</p>
              <p className="text-sm max-w-xs">Share your symptoms, age, and gender to get a preliminary assessment</p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm
                    ${msg.sender === "You" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"}`
                  }
                >
                  {msg.sender === "Bot" ? (
                    <div className="text-sm">
                      {formatResponse(msg.text)}
                    </div>
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-200 flex items-center">
                <Loader className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Analyzing symptoms...</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Form */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="Your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
              <div className="relative">
                <select
                  className="w-full p-2 rounded-lg border border-gray-300 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Symptoms</label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-sm"
              placeholder="Describe your symptoms in detail..."
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          
          <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={!symptoms.trim() || !age.trim() || loading}
          >
            {loading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;