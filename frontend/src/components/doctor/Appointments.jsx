import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  InfoIcon,
  CheckIcon,
  XIcon,
  LoaderIcon,
} from "lucide-react";

const Appointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/doctor/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
        setLoading(false);
        console.log("data :", response.data);
      } catch (error) {
        toast.error("Error fetching appointments");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, patientId, status) => {
    try {
      setLoading(true);
      await axios.put(
        "/api/doctor/appointments",
        {
          appointmentId,
          patientId,
          status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update local state
      setAppointments((prev) =>
        prev.map((app) =>
          app.appointmentId === appointmentId ? { ...app, status } : app
        )
      );

      const message =
        status === "Accepted"
          ? "Appointment accepted successfully"
          : "Appointment rejected";
      toast.success(message);
      setLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating appointment"
      );
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredAppointments = appointments.filter((app) =>
    activeTab === "pending"
      ? app.status === "Pending"
      : activeTab === "accepted"
      ? app.status === "Accepted"
      : activeTab === "rejected"
      ? app.status === "Rejected"
      : true
  );

  const tabCount = {
    pending: appointments.filter((app) => app.status === "Pending").length,
    accepted: appointments.filter((app) => app.status === "Accepted").length,
    rejected: appointments.filter((app) => app.status === "Rejected").length,
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className=" p-6  border-blue-100">
        <h2 className="text-2xl font-bold ">Patient Appointments</h2>
        <p className="text-blue-600">
          Manage your upcoming and past patient consultations
        </p>
      </div>

      <div className="flex border-b">
        <button
          className={`py-3 px-6 flex items-center gap-2 transition-all ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 bg-blue-50 text-blue-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {tabCount.pending}
          </span>
        </button>
        <button
          className={`py-3 px-6 flex items-center gap-2 transition-all ${
            activeTab === "accepted"
              ? "border-b-2 border-green-500 bg-green-50 text-green-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("accepted")}
        >
          Accepted
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {tabCount.accepted}
          </span>
        </button>
        <button
          className={`py-3 px-6 flex items-center gap-2 transition-all ${
            activeTab === "rejected"
              ? "border-b-2 border-red-500 bg-red-50 text-red-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            {tabCount.rejected}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center">
          <LoaderIcon className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">
            No {activeTab} appointments
          </h3>
          <p className="text-gray-500 mt-2">
            You don't have any {activeTab} appointments at the moment.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div
                className="cursor-pointer"
                onClick={() => toggleExpand(appointment.appointmentId)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.patientEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1 text-gray-500 text-sm">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-gray-500 text-sm">
                      <ClockIcon className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    {appointment.status === "Pending" ? (
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
                        Pending
                      </span>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          appointment.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {expandedId === appointment.appointmentId && (
                <div className="mt-4 pl-10 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Appointment Details
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Date:</span>{" "}
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Time:</span>{" "}
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Patient Information
                      </h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Name:</span>{" "}
                          {appointment.patientName}
                        </div>
                        <div className="flex items-center gap-2">
                          <InfoIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Email:</span>{" "}
                          {appointment.patientEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Symptoms
                    </h4>
                    <p className="mt-2 p-3 bg-gray-50 rounded-md text-gray-700">
                      {appointment.symptoms}
                    </p>
                  </div>

                  {appointment.status === "Pending" && (
                    <div className="flex gap-3 justify-end mt-4">
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            appointment.appointmentId,
                            appointment.patientId,
                            "Rejected"
                          )
                        }
                        className="flex items-center gap-1 bg-white border border-red-300 text-red-600 py-2 px-4 rounded hover:bg-red-50 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            appointment.appointmentId,
                            appointment.patientId,
                            "Accepted"
                          )
                        }
                        className="flex items-center gap-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
