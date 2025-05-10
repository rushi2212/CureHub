import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Phone, Calendar, Users, Home, Droplet, PhoneCall, Save } from "lucide-react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    age: "",
    gender: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("patientAuth");

      if (!token) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setFormData({
          name: response.data.name || "",
          mobile: response.data.mobile || "",
          age: response.data.age || "",
          gender: response.data.gender || "",
          address: response.data.address || "",
          bloodGroup: response.data.bloodGroup || "",
          emergencyContact: response.data.emergencyContact || "",
        });

        if (response.data.name) {
          localStorage.setItem("patientName", response.data.name);
        }

        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("patientAuth");

    if (!token) {
      toast.error("User not authenticated");
      setSaving(false);
      return;
    }

    try {
      await axios.put("/api/patient/profile", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("patientName", formData.name);
      toast.success("Profile updated successfully!");
      setSaving(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-indigo-700">My Profile</h2>
        <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
          Patient Information
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {/* Personal Information Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
            <div className="h-px bg-gray-200 w-full mb-4"></div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <User size={18} className="mr-2 text-indigo-500" />
              <span>Full Name</span>
            </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <Calendar size={18} className="mr-2 text-indigo-500" />
              <span>Age</span>
            </label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange} 
              min="1" 
              max="120" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="Enter your age"
            />
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <Users size={18} className="mr-2 text-indigo-500" />
              <span>Gender</span>
            </label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <Droplet size={18} className="mr-2 text-indigo-500" />
              <span>Blood Group</span>
            </label>
            <select 
              name="bloodGroup" 
              value={formData.bloodGroup} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          {/* Contact Information Section */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact Information</h3>
            <div className="h-px bg-gray-200 w-full mb-4"></div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <Phone size={18} className="mr-2 text-indigo-500" />
              <span>Mobile Number</span>
            </label>
            <input 
              type="text" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="Enter your mobile number"
            />
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <PhoneCall size={18} className="mr-2 text-indigo-500" />
              <span>Emergency Contact</span>
            </label>
            <input 
              type="text" 
              name="emergencyContact" 
              value={formData.emergencyContact} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="Enter emergency contact number"
            />
          </div>
          
          <div className="col-span-2 space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <Home size={18} className="mr-2 text-indigo-500" />
              <span>Address</span>
            </label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="Enter your full address"
              rows="3"
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <button 
            type="submit" 
            disabled={saving} 
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;