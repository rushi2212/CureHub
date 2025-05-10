import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

const Availability = ({ doctorId }) => {
  const [availability, setAvailability] = useState([]);
  const [newDate, setNewDate] = useState(new Date());
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingSlot, setAddingSlot] = useState(false);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/doctor/availability", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailability(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching availability");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleAddTimeSlot = async () => {
    if (!newTimeSlot) {
      toast.error("Please enter a time slot");
      return;
    }
    
    setAddingSlot(true);

    // Build YYYY-MM-DD from local date components to avoid UTC shift:
    const year  = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day   = String(newDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/doctor/availability",
        { date: formattedDate, timeSlots: [newTimeSlot] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchAvailability();
      setNewTimeSlot("");
      toast.success("Time slot added successfully!");
    } catch (error) {
      toast.error("Error adding time slot");
    } finally {
      setAddingSlot(false);
    }
  };

  const handleRemoveTimeSlot = async (date, timeSlot) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/doctor/availability", {
        headers: { Authorization: `Bearer ${token}` },
        data: { date, timeSlot }
      });
      
      setAvailability(prev => 
        prev
          .map(day => {
            if (day.date === date) {
              return {
                ...day,
                timeSlots: day.timeSlots.filter(t => t !== timeSlot)
              };
            }
            return day;
          })
          .filter(day => day.timeSlots.length > 0)
      );
      
      toast.success("Time slot removed");
    } catch (error) {
      toast.error("Error removing time slot");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded mb-3"></div>
          <div className="h-3 w-24 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
          <Calendar className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Availability</h2>
          <p className="text-gray-500">Set your available time slots for patient appointments</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-blue-100 p-6 mb-8 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Time Slot</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                selected={newDate}
                onChange={setNewDate}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                minDate={new Date()}
                maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                dateFormat="MMMM d, yyyy"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={newTimeSlot}
                onChange={e => setNewTimeSlot(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddTimeSlot}
            disabled={addingSlot}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105 active:scale-95 disabled:opacity-70"
          >
            {addingSlot ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} className="mr-1" />
                Add Slot
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Availability Schedule</h3>
        {availability.length === 0 ? (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
            <Clock size={40} className="text-blue-400 mx-auto mb-2" />
            <p className="text-gray-600">No availability slots added yet.</p>
            <p className="text-sm text-gray-500 mt-1">Add time slots above to start accepting appointments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availability
              .map(day => {
                const [y, m, d] = day.date.split('-').map(Number);
                return { ...day, localDate: new Date(y, m - 1, d) };
              })
              .filter(day => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return day.localDate >= today;
              })
              .sort((a, b) => a.localDate - b.localDate)
              .map(day => {
                const date = day.localDate;
                return (
                  <div key={day.date} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3">
                      <h4 className="font-medium">
                        {date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {day.timeSlots.map((time, idx) => (
                          <div key={idx} className="group bg-blue-50 rounded-full px-3 py-1 flex items-center">
                            <Clock size={14} className="text-blue-500 mr-1" />
                            <span className="text-sm">{time}</span>
                            <button
                              onClick={() => handleRemoveTimeSlot(day.date, time)}
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove time slot"
                            >
                              <Trash2 size={14} className="text-red-500 hover:text-red-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;
