import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  User, Phone, Calendar, Users, Home, Droplet, PhoneCall, Save, Pencil
} from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);

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

        localStorage.setItem("patientName", response.data.name || "");
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      setIsEditing(false);
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

  if (!isEditing) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Patient Profile</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Pencil size={16} className="mr-2" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Full Name" value={formData.name} icon={<User size={16} />} />
          <ProfileField label="Age" value={formData.age} icon={<Calendar size={16} />} />
          <ProfileField label="Gender" value={formData.gender} icon={<Users size={16} />} />
          <ProfileField label="Blood Group" value={formData.bloodGroup} icon={<Droplet size={16} />} />
          <ProfileField label="Mobile" value={formData.mobile} icon={<Phone size={16} />} />
          <ProfileField label="Emergency Contact" value={formData.emergencyContact} icon={<PhoneCall size={16} />} />
          <div className="md:col-span-2">
            <ProfileField label="Address" value={formData.address} icon={<Home size={16} />} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-indigo-700">Edit Profile</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {[
            { name: "name", label: "Full Name", type: "text", icon: <User size={18} /> },
            { name: "age", label: "Age", type: "number", icon: <Calendar size={18} /> },
            { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], icon: <Users size={18} /> },
            { name: "bloodGroup", label: "Blood Group", type: "select", options: bloodGroups, icon: <Droplet size={18} /> },
            { name: "mobile", label: "Mobile Number", type: "text", icon: <Phone size={18} /> },
            { name: "emergencyContact", label: "Emergency Contact", type: "text", icon: <PhoneCall size={18} /> },
          ].map(({ name, label, type, icon, options }) => (
            <div key={name} className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <span className="mr-2 text-indigo-500">{icon}</span>
                {label}
              </label>
              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select {label}</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <Home size={18} className="mr-2 text-indigo-500" />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your full address"
              rows="3"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70"
          >
            <Save size={18} className="mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ProfileField = ({ label, value, icon }) => (
  <div className="flex items-start space-x-4">
    <div className="text-indigo-500 mt-1">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-medium text-gray-900">{value || "N/A"}</div>
    </div>
  </div>
);

export default EditProfile;
