import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  User,
  Calendar,
  Clock,
  FileText,
  Search,
  CheckCircle,
  Filter,
  Loader,
  Star,
  Heart,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Zap,
  PlusCircle,
  Eye,
} from "lucide-react";

const BookAppointment = () => {
  // Core state
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Enhanced search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // UI states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [view, setView] = useState("default"); // 'default', 'compare', 'success'
  const [doctorsToCompare, setDoctorsToCompare] = useState([]);
  const [showCalendarSlots, setShowCalendarSlots] = useState(false);
  const [datesWithSlots, setDatesWithSlots] = useState({});
  const [isAccordionOpen, setIsAccordionOpen] = useState({
    search: true,
    doctors: true,
    dateTime: true,
    symptoms: true,
  });

  // Refs
  const symptomsRef = useRef(null);
  const symptomSuggestions = [
    "Fever and headache",
    "Back pain",
    "Common cold symptoms",
    "Stomach ache",
    "Chest pain",
    "Allergic reaction",
  ];

  // Get unique specializations
  const specializations = [
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ];

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter doctors based on search and speciality
  const filteredDoctors = doctors.filter((doctor) => {
    // Safely handle potentially undefined/null properties
    const name = doctor?.name || "";
    const specialization = doctor?.specialization || "";

    const matchesSearch =
      searchTerm === "" ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpeciality = selectedSpeciality
      ? specialization === selectedSpeciality
      : true;

    return matchesSearch && matchesSpeciality;
  });

  // Load data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("patientAuth");
        if (!token) {
          toast.error("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/patient/doctors", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
        loadSavedState();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.response?.data?.message || "Error fetching doctors");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Update available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const doctor = doctors.find((d) => d._id === selectedDoctor);
      if (doctor) {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const availability = doctor.availability?.find(
          (a) => a.date === formattedDate
        );
        setAvailableSlots(availability ? availability.timeSlots : []);
      }
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, selectedDate, doctors]);

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const doctorSuggestions = doctors
        .filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
        .map((doctor) => ({
          id: doctor._id,
          text: doctor.name,
          subtext: doctor.specialization,
        }));

      setSearchSuggestions(doctorSuggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, doctors]);

  // Update dates with available slots
  useEffect(() => {
    if (selectedDoctor) {
      const doctor = doctors.find((d) => d._id === selectedDoctor);
      if (doctor && doctor.availability) {
        const availableDates = {};
        doctor.availability.forEach((day) => {
          if (day.timeSlots && day.timeSlots.length > 0) {
            availableDates[day.date] = day.timeSlots.length;
          }
        });
        setDatesWithSlots(availableDates);
      }
    }
  }, [selectedDoctor, doctors]);

  // Persisted state handlers
  const loadSavedState = () => {
    try {
      // Load recent doctors
      const savedRecentDoctors = localStorage.getItem("recentDoctors");
      if (savedRecentDoctors) {
        setRecentDoctors(JSON.parse(savedRecentDoctors));
      }

      // Load favorites
      const savedFavorites = localStorage.getItem("favoriteDoctors");
      if (savedFavorites) {
        setFavoritesList(JSON.parse(savedFavorites));
      }

      // Load draft symptoms
      const savedSymptoms = localStorage.getItem("draftSymptoms");
      if (savedSymptoms) {
        setSymptoms(savedSymptoms);
      }

      // Load preferred doctor if exists
      const preferredDoctor = localStorage.getItem("preferredDoctor");
      if (preferredDoctor) {
        setSelectedDoctor(preferredDoctor);
      }
    } catch (error) {
      console.error("Error loading saved state", error);
    }
  };

  // Save symptoms draft
  useEffect(() => {
    if (symptoms) {
      localStorage.setItem("draftSymptoms", symptoms);
    }
  }, [symptoms]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");

    // Auto-expand slot section when date changes
    if (isMobile) {
      setIsAccordionOpen((prev) => ({ ...prev, dateTime: true }));
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedSlot("");

    // Auto-expand date/time section when doctor changes
    if (isMobile) {
      setIsAccordionOpen((prev) => ({ ...prev, dateTime: true }));

      // Auto-scroll to date/time section
      setTimeout(() => {
        const dateTimeSection = document.getElementById("date-time-section");
        if (dateTimeSection) {
          dateTimeSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  // Handle doctor suggestion click
  const handleSuggestionClick = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSearchTerm("");
    setSearchSuggestions([]);
  };

  // Toggle favorite status
  const toggleFavorite = (doctorId) => {
    let newFavorites;
    if (favoritesList.includes(doctorId)) {
      newFavorites = favoritesList.filter((id) => id !== doctorId);
    } else {
      newFavorites = [...favoritesList, doctorId];
    }
    setFavoritesList(newFavorites);
    localStorage.setItem("favoriteDoctors", JSON.stringify(newFavorites));
  };

  // Book next available slot
  const bookNextAvailable = () => {
    // Find doctor with earliest available slot
    let earliestDate = null;
    let earliestSlot = null;
    let earliestDoctor = null;

    doctors.forEach((doctor) => {
      if (doctor.availability && doctor.availability.length > 0) {
        doctor.availability.sort((a, b) => new Date(a.date) - new Date(b.date));

        for (const day of doctor.availability) {
          if (
            day.timeSlots &&
            day.timeSlots.length > 0 &&
            new Date(day.date) >= new Date()
          ) {
            const date = new Date(day.date);
            if (!earliestDate || date < earliestDate) {
              earliestDate = date;
              earliestSlot = day.timeSlots[0];
              earliestDoctor = doctor._id;
              break;
            }
          }
        }
      }
    });

    if (earliestDate && earliestSlot && earliestDoctor) {
      setSelectedDoctor(earliestDoctor);
      setSelectedDate(earliestDate);
      setSelectedSlot(earliestSlot);

      toast.info(
        `Booked next available slot with ${
          doctors.find((d) => d._id === earliestDoctor).name
        }`
      );
    } else {
      toast.error("No available slots found");
    }
  };

  // Add doctor to comparison
  const addToComparison = (doctorId) => {
    if (doctorsToCompare.includes(doctorId)) {
      setDoctorsToCompare(doctorsToCompare.filter((id) => id !== doctorId));
    } else if (doctorsToCompare.length < 3) {
      setDoctorsToCompare([...doctorsToCompare, doctorId]);
    } else {
      toast.warning("You can compare up to 3 doctors");
    }
  };

  // Submit appointment form
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!selectedDoctor || !selectedSlot || !symptoms) {
      toast.error("Please fill all required fields");
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  // Confirm booking
  const confirmBooking = async () => {
    setBookingInProgress(true);
    setShowConfirmModal(false);

    try {
      const token = localStorage.getItem("patientAuth");
      if (!token) {
        toast.error("Authentication required");
        setBookingInProgress(false);
        return;
      }

      const formattedDate = selectedDate.toISOString().split("T")[0];
      await axios.post(
        "/api/patient/appointments",
        {
          doctorId: selectedDoctor,
          symptoms,
          date: formattedDate,
          time: selectedSlot,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update recent doctors
      const currentDoctor = doctors.find((d) => d._id === selectedDoctor);
      const updatedRecentDoctors = [
        selectedDoctor,
        ...recentDoctors.filter((id) => id !== selectedDoctor),
      ].slice(0, 3);
      setRecentDoctors(updatedRecentDoctors);
      localStorage.setItem(
        "recentDoctors",
        JSON.stringify(updatedRecentDoctors)
      );

      // Set preferred doctor
      localStorage.setItem("preferredDoctor", selectedDoctor);

      // Clear draft symptoms
      localStorage.removeItem("draftSymptoms");

      setBookingSuccess(true);
      setView("success");
      setBookingInProgress(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error booking appointment");
      setBookingInProgress(false);
    }
  };

  // Reset form after successful booking
  const handleStartNewBooking = () => {
    setSymptoms("");
    setSelectedSlot("");
    setBookingSuccess(false);
    setView("default");
  };

  // Toggle accordion section
  const toggleSection = (section) => {
    setIsAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Add appointment to calendar
  const addToCalendar = () => {
    const doctor = doctors.find((d) => d._id === selectedDoctor);
    if (!doctor) return;

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const [hours, minutes] = selectedSlot.split(":");

    const startTime = new Date(selectedDate);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    const eventTitle = `Appointment with Dr. ${doctor.name}`;
    const eventDetails = `Medical appointment\nSymptoms: ${symptoms}`;
    const eventLocation = doctor.location || "Medical Center";

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${startTime.toISOString().replace(/-|:|\.\d+/g, "")}/${endTime
      .toISOString()
      .replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(
      eventDetails
    )}&location=${encodeURIComponent(eventLocation)}`;

    window.open(googleCalendarUrl, "_blank");
  };

  // Highlight dates with slots in calendar
  const highlightDatesWithSlots = (date) => {
    const dateString = date.toISOString().split("T")[0];
    if (datesWithSlots[dateString]) {
      return "highlight-date";
    }
    return null;
  };

  // Quick fill symptoms
  const fillSymptomSuggestion = (suggestion) => {
    setSymptoms(suggestion);
    if (symptomsRef.current) {
      symptomsRef.current.focus();
    }
  };

  // Load skeleton UI while loading
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-8"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-full mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded-lg w-full"
                ></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-full mb-4"></div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-32 bg-gray-200 rounded-lg w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show success view
  if (view === "success") {
    const selectedDoctorData = doctors.find((d) => d._id === selectedDoctor);
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 animate-fadeIn">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Appointment Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked.
          </p>

          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8 max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <User size={28} className="text-indigo-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-xl">
                  {selectedDoctorData?.name || "Doctor"}
                </h3>
                <p className="text-indigo-600">
                  {selectedDoctorData?.specialization || "Specialist"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-gray-700 mb-1">
                  <Calendar size={16} className="mr-2 text-indigo-500" />
                  <span className="text-sm font-medium">Date</span>
                </div>
                <p className="font-medium">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center text-gray-700 mb-1">
                  <Clock size={16} className="mr-2 text-indigo-500" />
                  <span className="text-sm font-medium">Time</span>
                </div>
                <p className="font-medium">{selectedSlot}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={addToCalendar}
              className="px-6 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center transition-all"
            >
              <Calendar size={20} className="mr-2" />
              Add to Calendar
            </button>

            <button
              onClick={handleStartNewBooking}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl flex items-center justify-center transition-all"
            >
              <Calendar size={20} className="mr-2" />
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show doctor comparison view
  if (view === "compare" && doctorsToCompare.length > 0) {
    const selectedDoctorsData = doctors.filter((d) =>
      doctorsToCompare.includes(d._id)
    );

    return (
      <div className="bg-white rounded-xl shadow-xl p-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-800">
            Compare Doctors
          </h2>
          <button
            onClick={() => setView("default")}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <ArrowRight size={18} className="mr-1" />
            Back to Booking
          </button>
        </div>

        <div
          className={`grid ${
            selectedDoctorsData.length === 3 ? "grid-cols-3" : "grid-cols-2"
          } gap-4 mb-8`}
        >
          {selectedDoctorsData.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg border-2 border-indigo-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-4 border-b border-indigo-100 bg-indigo-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                    <User size={24} className="text-indigo-600" />
                  </div>
                  <button
                    onClick={() =>
                      handleDoctorChange(doctor._id) || setView("default")
                    }
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700"
                  >
                    Select
                  </button>
                </div>
                <h3 className="font-bold text-lg text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-indigo-600 text-sm font-medium">
                  {doctor.specialization}
                </p>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-3">
                  <Star className="text-yellow-500 mr-1" size={16} />
                  <span className="font-medium">
                    {doctor.rating || "4.8"} / 5
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    Next Available
                  </div>
                  <div className="font-medium">
                    {doctor.availability && doctor.availability.length > 0
                      ? `${new Date(
                          doctor.availability[0].date
                        ).toLocaleDateString()} at ${
                          doctor.availability[0].timeSlots[0]
                        }`
                      : "No availability"}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    Consultation Fee
                  </div>
                  <div className="font-medium">${doctor.fee || "85"}</div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Experience</div>
                  <div className="font-medium">
                    {doctor.experience || "8"} years
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setView("default")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            Return to Booking
          </button>
        </div>
      </div>
    );
  }

  // Default booking view
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-6 flex items-center">
        <Calendar className="mr-3 text-indigo-600" size={28} />
        Book Your Appointment
      </h2>

      {/* Quick actions bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={bookNextAvailable}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
        >
          <Zap size={16} className="mr-2" />
          Book Next Available
        </button>

        {doctorsToCompare.length > 0 && (
          <button
            onClick={() => setView("compare")}
            className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
          >
            <Eye size={16} className="mr-2" />
            Compare ({doctorsToCompare.length})
          </button>
        )}
      </div>

      {/* Fixed bottom selection summary - only shows when doctor and slot selected */}
      {selectedDoctor && selectedSlot && (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-800 text-white py-3 px-4 z-20 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <CheckCircle size={20} className="mr-2 text-green-400" />
              <span>
                Selected:{" "}
                <strong>
                  {doctors.find((d) => d._id === selectedDoctor)?.name}
                </strong>
                ,{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                at <strong>{selectedSlot}</strong>
              </span>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
            >
              <CheckCircle size={16} className="mr-2" />
              Confirm
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile accordion layout */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Search Section */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("search")}
                className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Search size={20} className="mr-2 text-indigo-600" />
                  <span className="font-medium">Find a Doctor</span>
                </div>
                <ChevronIcon isOpen={isAccordionOpen.search} />
              </button>

              {isAccordionOpen.search && (
                <div className="p-4">
                  <DoctorSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchSuggestions={searchSuggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    selectedSpeciality={selectedSpeciality}
                    setSelectedSpeciality={setSelectedSpeciality}
                    specializations={specializations}
                  />
                </div>
              )}
            </div>

            {/* Doctors Section */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("doctors")}
                className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <User size={20} className="mr-2 text-indigo-600" />
                  <span className="font-medium">Select Doctor</span>
                  {selectedDoctor && (
                    <CheckCircle size={16} className="ml-2 text-green-500" />
                  )}
                </div>
                <ChevronIcon isOpen={isAccordionOpen.doctors} />
              </button>

              {isAccordionOpen.doctors && (
                <div className="p-4">
                  <DoctorsList
                    doctors={doctors}
                    filteredDoctors={filteredDoctors}
                    selectedDoctor={selectedDoctor}
                    handleDoctorChange={handleDoctorChange}
                    favoritesList={favoritesList}
                    toggleFavorite={toggleFavorite}
                    recentDoctors={recentDoctors}
                    doctorsToCompare={doctorsToCompare}
                    addToComparison={addToComparison}
                  />
                </div>
              )}
            </div>

            {/* Date/Time Section */}
            <div
              id="date-time-section"
              className="border-2 border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleSection("dateTime")}
                className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Calendar size={20} className="mr-2 text-indigo-600" />
                  <span className="font-medium">Select Date & Time</span>
                  {selectedSlot && (
                    <CheckCircle size={16} className="ml-2 text-green-500" />
                  )}
                </div>
                <ChevronIcon isOpen={isAccordionOpen.dateTime} />
              </button>

              {isAccordionOpen.dateTime && (
                <div className="p-4">
                  <DateTimeSelection
                    selectedDoctor={selectedDoctor}
                    selectedDate={selectedDate}
                    handleDateChange={handleDateChange}
                    availableSlots={availableSlots}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    highlightDatesWithSlots={highlightDatesWithSlots}
                    datesWithSlots={datesWithSlots}
                  />
                </div>
              )}
            </div>

            {/* Symptoms Section */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("symptoms")}
                className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <FileText size={20} className="mr-2 text-indigo-600" />
                  <span className="font-medium">Symptoms / Reason</span>
                  {symptoms && (
                    <CheckCircle size={16} className="ml-2 text-green-500" />
                  )}
                </div>
                <ChevronIcon isOpen={isAccordionOpen.symptoms} />
              </button>

              {isAccordionOpen.symptoms && (
                <div className="p-4">
                  <SymptomsInput
                    symptoms={symptoms}
                    setSymptoms={setSymptoms}
                    symptomsRef={symptomsRef}
                    symptomSuggestions={symptomSuggestions}
                    fillSymptomSuggestion={fillSymptomSuggestion}
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={
                !selectedDoctor ||
                !selectedSlot ||
                !symptoms ||
                bookingInProgress
              }
              className={`w-full py-3 rounded-xl text-white font-medium flex items-center justify-center mt-6 
                ${
                  !selectedDoctor ||
                  !selectedSlot ||
                  !symptoms ||
                  bookingInProgress
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                }`}
            >
              {bookingInProgress ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />{" "}
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="mr-2" /> Book Appointment
                </>
              )}
            </button>
          </div>
        ) : (
          /* Desktop layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <DoctorSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchSuggestions={searchSuggestions}
                handleSuggestionClick={handleSuggestionClick}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                selectedSpeciality={selectedSpeciality}
                setSelectedSpeciality={setSelectedSpeciality}
                specializations={specializations}
              />

              <DoctorsList
                doctors={doctors}
                filteredDoctors={filteredDoctors}
                selectedDoctor={selectedDoctor}
                handleDoctorChange={handleDoctorChange}
                favoritesList={favoritesList}
                toggleFavorite={toggleFavorite}
                recentDoctors={recentDoctors}
                doctorsToCompare={doctorsToCompare}
                addToComparison={addToComparison}
              />
            </div>

            <div className="space-y-6">
              <DateTimeSelection
                selectedDoctor={selectedDoctor}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                highlightDatesWithSlots={highlightDatesWithSlots}
                datesWithSlots={datesWithSlots}
              />

              <SymptomsInput
                symptoms={symptoms}
                setSymptoms={setSymptoms}
                symptomsRef={symptomsRef}
                symptomSuggestions={symptomSuggestions}
                fillSymptomSuggestion={fillSymptomSuggestion}
              />

              <button
                type="submit"
                disabled={
                  !selectedDoctor ||
                  !selectedSlot ||
                  !symptoms ||
                  bookingInProgress
                }
                className={`w-full py-3 rounded-xl text-white font-medium flex items-center justify-center mt-4
                  ${
                    !selectedDoctor ||
                    !selectedSlot ||
                    !symptoms ||
                    bookingInProgress
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                  }`}
              >
                {bookingInProgress ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="mr-2" /> Book Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-scaleIn">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <AlertCircle className="mr-2 text-indigo-600" size={24} />
              Confirm Appointment
            </h3>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Please review your appointment details:
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Doctor:</span>{" "}
                  <span>
                    {doctors.find((d) => d._id === selectedDoctor)?.name}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Date:</span>{" "}
                  <span>
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Time:</span>{" "}
                  <span>{selectedSlot}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Reason:</span>{" "}
                  <span>{symptoms}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="py-2 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg flex-1"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const ChevronIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform ${isOpen ? "transform rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const DoctorSearch = ({
  searchTerm,
  setSearchTerm,
  searchSuggestions,
  handleSuggestionClick,
  showFilters,
  setShowFilters,
  selectedSpeciality,
  setSelectedSpeciality,
  specializations,
}) => {
  return (
    <div>
      <div className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctors by name or specialty"
            className="w-full p-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-3">
            <Search size={20} className="text-gray-500" />
          </div>
        </div>

        {searchSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
            {searchSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.id)}
                className="w-full p-3 text-left hover:bg-indigo-50 flex items-center border-b border-gray-100 last:border-none"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <User size={16} className="text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium">{suggestion.text}</div>
                  <div className="text-sm text-gray-600">
                    {suggestion.subtext}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
        >
          <Filter size={16} className="mr-1" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <select
              value={selectedSpeciality}
              onChange={(e) => setSelectedSpeciality(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const DoctorsList = ({
  doctors,
  filteredDoctors,
  selectedDoctor,
  handleDoctorChange,
  favoritesList,
  toggleFavorite,
  recentDoctors,
  doctorsToCompare,
  addToComparison,
}) => {
  return (
    <div>
      {recentDoctors.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center">
            <BookOpen size={16} className="mr-1 text-indigo-600" />
            Recent Doctors
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentDoctors.map((id) => {
              const doctor = doctors.find((d) => d._id === id);
              if (!doctor) return null;

              return (
                <button
                  key={id}
                  onClick={() => handleDoctorChange(id)}
                  className={`px-3 py-2 rounded-lg border text-sm flex items-center
                    ${
                      selectedDoctor === id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                    <User size={12} className="text-indigo-600" />
                  </div>
                  {doctor.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredDoctors.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all
                ${
                  selectedDoctor === doctor._id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              onClick={() => handleDoctorChange(doctor._id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <User size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-indigo-600">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(doctor._id);
                    }}
                    className={`p-1.5 rounded-full 
                      ${
                        favoritesList.includes(doctor._id)
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    <Heart
                      size={16}
                      fill={
                        favoritesList.includes(doctor._id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToComparison(doctor._id);
                    }}
                    className={`p-1.5 rounded-full
                      ${
                        doctorsToCompare.includes(doctor._id)
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    <PlusCircle
                      size={16}
                      fill={
                        doctorsToCompare.includes(doctor._id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </div>

              {selectedDoctor === doctor._id && (
                <div className="mt-3 pt-3 border-t border-indigo-100 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 block">Rating</span>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      <span className="font-medium">
                        {doctor.rating || "4.8"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Experience</span>
                    <span className="font-medium">
                      {doctor.experience || "8"} years
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-gray-500">
          No doctors found matching your criteria.
        </div>
      )}
    </div>
  );
};

const DateTimeSelection = ({
  selectedDoctor,
  selectedDate,
  handleDateChange,
  availableSlots,
  selectedSlot,
  setSelectedSlot,
  highlightDatesWithSlots,
  datesWithSlots,
}) => {
  return (
    <div>
      {selectedDoctor ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="border border-gray-200 rounded-lg p-2">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                inline
                dayClassName={highlightDatesWithSlots}
              />
            </div>
          </div>

          {Object.keys(datesWithSlots).length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {Object.entries(datesWithSlots)
                .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                .slice(0, 5)
                .map(([date, count]) => (
                  <button
                    key={date}
                    onClick={() => handleDateChange(new Date(date))}
                    className={`text-xs px-2 py-1 rounded border 
                      ${
                        selectedDate.toISOString().split("T")[0] === date
                          ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                          : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                      }`}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    <span className="ml-1 text-xs text-indigo-600">
                      ({count})
                    </span>
                  </button>
                ))}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots
            </label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-1 text-center text-sm rounded-lg border-2 transition-all
                      ${
                        selectedSlot === slot
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
                No available slots for selected date.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <Calendar size={32} className="mb-2 text-gray-400" />
          <p>Please select a doctor first</p>
          <p className="text-sm mt-1">Time slots will appear here</p>
        </div>
      )}
    </div>
  );
};

const SymptomsInput = ({
  symptoms,
  setSymptoms,
  symptomsRef,
  symptomSuggestions,
  fillSymptomSuggestion,
}) => {
  return (
    <div>
      <label
        htmlFor="symptoms"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Describe your symptoms or reason for visit
      </label>
      <textarea
        ref={symptomsRef}
        id="symptoms"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        rows="4"
        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
        placeholder="Please describe your symptoms or reason for the appointment"
      ></textarea>

      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-2">Quick suggestions</p>
        <div className="flex flex-wrap gap-2">
          {symptomSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => fillSymptomSuggestion(suggestion)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
