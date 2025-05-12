import React, { useState } from 'react';
import { User, Phone, Book, Award, Clock, FileText, Mail, MapPin, Edit } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfileCard = ({ doctor, setDoctor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor.name,
    mobile: doctor.mobile || '',
    age: doctor.age || '',
    gender: doctor.gender || '',
    specialization: doctor.specialization || '',
    degree: doctor.degree || '',
    experience: doctor.experience || '',
    bio: doctor.bio || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("/api/doctor/profile", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctor(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Profile</h2>
            <p className="text-sm sm:text-base text-gray-500">Update your personal and professional information</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Book className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="e.g. 5 years"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                rows="4"
                placeholder="Write a short professional bio..."
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-md shadow-sm hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with avatar and name */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white flex items-center justify-center border-4 border-white mx-auto sm:mx-0">
              <User className="h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" />
            </div>
            <div className="ml-0 sm:ml-4 text-white text-center sm:text-left mt-2 sm:mt-0">
              <h2 className="text-xl sm:text-2xl font-bold">{doctor.name || 'Doctor'}</h2>
              <p className="text-indigo-100">{doctor.specialization || 'Specialist'}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white text-indigo-600 flex items-center justify-center px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition transform hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
            
            {doctor.age && (
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Age</p>
                  <p className="text-sm sm:text-base">{doctor.age} years</p>
                </div>
              </div>
            )}
            
            {doctor.gender && (
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                  <p className="text-sm sm:text-base">{doctor.gender}</p>
                </div>
              </div>
            )}
            
            {doctor.mobile && (
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="break-words">
                  <p className="text-xs sm:text-sm text-gray-500">Contact</p>
                  <p className="text-sm sm:text-base">{doctor.mobile}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Professional Information</h3>
            
            {doctor.specialization && (
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Award className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Specialization</p>
                  <p className="text-sm sm:text-base">{doctor.specialization}</p>
                </div>
              </div>
            )}
            
            {doctor.degree && (
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Book className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Qualification</p>
                  <p className="text-sm sm:text-base">{doctor.degree}</p>
                </div>
              </div>
            )}
            
            {doctor.experience && (
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Experience</p>
                  <p className="text-sm sm:text-base">{doctor.experience}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bio section */}
        {doctor.bio && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">About</h3>
            <div className="mt-3 flex">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700">{doctor.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfileCard;