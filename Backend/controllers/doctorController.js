// Backend/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import nodemailer from "nodemailer";
import Appointment from "../models/Appointment.js";
import multer from "multer";
import mongoose from "mongoose";

// Update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      mobile,
      age,
      gender,
      specialization,
      degree,
      experience,
      bio,
    } = req.body;

    const doctor = await Doctor.findById(req.user._id);

    if (doctor) {
      doctor.name = name || doctor.name;
      doctor.mobile = mobile || doctor.mobile;
      doctor.age = age || doctor.age;
      doctor.gender = gender || doctor.gender;
      doctor.specialization = specialization || doctor.specialization;
      doctor.degree = degree || doctor.degree;
      doctor.experience = experience || doctor.experience;
      doctor.bio = bio || doctor.bio;

      if (req.file) {
        doctor.profileImg = req.file.path;
      }

      const updatedDoctor = await doctor.save();

      res.json({
        _id: updatedDoctor._id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        mobile: updatedDoctor.mobile,
        age: updatedDoctor.age,
        gender: updatedDoctor.gender,
        specialization: updatedDoctor.specialization,
        degree: updatedDoctor.degree,
        experience: updatedDoctor.experience,
        bio: updatedDoctor.bio,
        profileImg: updatedDoctor.profileImg,
        role: updatedDoctor.role,
      });
    } else {
      res.status(404);
      throw new Error("Doctor not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add availability slots

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const addAvailability = async (req, res) => {
  try {
    const { date, timeSlots } = req.body;

    // 1) Validate date format
    if (!ISO_DATE_RE.test(date)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2) Find existing date entry
    const idx = doctor.availability.findIndex(a => a.date === date);

    if (idx >= 0) {
      // Merge and de-duplicate slots
      const existing = doctor.availability[idx].timeSlots;
      const merged = Array.from(new Set([...existing, ...timeSlots]));
      doctor.availability[idx].timeSlots = merged;
    } else {
      // Push new date + slots
      doctor.availability.push({ date, timeSlots });
    }

    // 3) Sort by date string ascending
    doctor.availability.sort((a, b) => a.date.localeCompare(b.date));

    await doctor.save();

    // 4) Return the cleaned, sorted availability
    return res.json(doctor.availability);
  } catch (error) {
    console.error("addAvailability error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get doctor availability
export const getAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id).select("availability");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Make a shallow copy and sort by date string (YYYY-MM-DD)
    const sortedAvailability = [...doctor.availability].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return res.json(sortedAvailability);
  } catch (error) {
    console.error("getAvailability error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get patient appointments
//   export const getPatientAppointments = async (req, res) => {
//     try {
//       const patients = await Patient.find({
//         'medicalHistory.doctorId': req.user._id
//       }).select('name email medicalHistory');

//       // Filter and format appointments
//       const appointments = patients.flatMap(patient =>
//         patient.medicalHistory
//           .filter(appointment => appointment.doctorId.equals(req.user._id))
//           .map(appointment => ({
//             patientId: patient._id,
//             patientName: patient.name,
//             patientEmail: patient.email,
//             appointmentId: appointment._id,
//             symptoms: appointment.symptoms,
//             date: appointment.date,
//             time: appointment.time,
//             status: appointment.status
//           }))
//       );

//       res.json(appointments);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   };

// Update appointment status
//   export const updateAppointmentStatus = async (req, res) => {
//     try {
//       const { patientId, appointmentId, status } = req.body;

//       const patient = await Patient.findById(patientId);

//       if (!patient) {
//         return res.status(404).json({ message: 'Patient not found' });
//       }

//       const appointment = patient.medicalHistory.id(appointmentId);

//       if (!appointment) {
//         return res.status(404).json({ message: 'Appointment not found' });
//       }

//       appointment.status = status;
//       await patient.save();

//       res.json({ message: 'Appointment status updated successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   };

export const getPatientAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id; // Assuming the doctor is logged in

    // Fetch appointments related to the logged-in doctor
    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email") // Populate patient details
      .select("_id patientId date time symptoms status isFilled prescription");

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this doctor" });
    }

    // Format response
    const formattedAppointments = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      patientId: appointment.patientId._id,
      patientName: appointment.patientId.name,
      patientEmail: appointment.patientId.email,
      symptoms: appointment.symptoms,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      isFilled : appointment.isFilled,
      prescription:appointment.prescription
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server Error" });
  }
};

export const removeAvailabilitySlot = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;

    // 1) Validate date format
    if (!ISO_DATE_RE.test(date)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2) Find the date entry
    const dateEntry = doctor.availability.find(a => a.date === date);
    if (!dateEntry) {
      return res.status(404).json({ message: "Date not found in availability" });
    }

    // 3) Remove the specific time slot
    dateEntry.timeSlots = dateEntry.timeSlots.filter(t => t !== timeSlot);

    // 4) If no slots remain for that date, remove the date entry entirely
    if (dateEntry.timeSlots.length === 0) {
      doctor.availability = doctor.availability.filter(a => a.date !== date);
    }

    // 5) Sort availability ascending by date string
    doctor.availability.sort((a, b) => a.date.localeCompare(b.date));

    await doctor.save();

    // 6) Return the updated, sorted availability
    return res.json(doctor.availability);
  } catch (error) {
    console.error("removeAvailabilitySlot error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const doctorId = req.user._id; // Assuming the doctor is logged in

    // Validate status
    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify the appointment belongs to this doctor
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    // Update the status
    appointment.status = status;
    await appointment.save();

    // If accepted, add patient to doctor's patients list if not already there
    if (status === "Accepted") {
      await Doctor.findByIdAndUpdate(doctorId, {
        $addToSet: { patients: appointment.patientId },
      });
    }

    // Also update in patient's medicalHistory for backward compatibility
    await Patient.updateOne(
      {
        _id: appointment.patientId,
        "medicalHistory._id": appointmentId, // This assumes you're still storing appointments in both places
      },
      {
        $set: { "medicalHistory.$.status": status },
      }
    );

    res.json({
      message: "Appointment status updated successfully",
      updatedAppointment: {
        _id: appointment._id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        status: appointment.status,
        date: appointment.date,
        time: appointment.time,
        symptoms: appointment.symptoms,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add prescription to an accepted patient
// import Appointment from "../models/appointmentModel.js";
const addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { prescription, doctorId } = req.body;

    // Validate input data
    if (!appointmentId || !doctorId) {
      return res.status(400).json({
        message: "Appointment ID and Doctor ID are required",
      });
    }

    // Validate prescription format
    if (!prescription || !Array.isArray(prescription)) {
      return res.status(400).json({
        message: "Prescription must be an array of medicine objects",
      });
    }

    // Validate each prescription item
    for (const item of prescription) {
      if (!item.medicine || item.medicine.trim() === "") {
        return res.status(400).json({
          message: "Medicine name cannot be empty for any prescription item",
        });
      }
      if (!item.dosage || item.dosage.trim() === "") {
        return res.status(400).json({
          message: "Dosage cannot be empty for any prescription item",
        });
      }
      // instructions is optional, so no validation needed
    }

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(appointmentId) ||
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the doctor is the one assigned to this appointment
    if (appointment.doctorId.toString() !== doctorId) {
      return res.status(403).json({
        message:
          "Only the assigned doctor can add prescriptions to this appointment",
      });
    }

    // Check if the appointment was accepted
    if (appointment.status !== "Accepted") {
      return res.status(403).json({
        message: "Prescriptions can only be added to accepted appointments",
      });
    }

    // Update prescription and mark as filled
    appointment.prescription = prescription;
    appointment.isFilled = true;

    await appointment.save();

    res.status(200).json({
      message: "Prescription added successfully",
      appointment: {
        _id: appointment._id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        symptoms: appointment.symptoms,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        isFilled: appointment.isFilled,
        prescription: appointment.prescription,
      },
    });
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// Get all accepted patients for the doctor
const getAcceptedPatients = async (req, res) => {
  console.log(req.query);
  try {
    const { doctorid } = req.query;

    // 1. Validate ID
    if (!mongoose.isValidObjectId(doctorid)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // 2. Instantiate properly with `new`
    const doctorObjectId = new mongoose.Types.ObjectId(doctorid);

    // 3. Query with $elemMatch
    const patients = await Patient.find({
      medicalHistory: {
        $elemMatch: {
          doctorId: doctorObjectId,
          status: "Accepted",
        },
      },
    }).select("name email medicalHistory");

    console.log(patients);
    // 4. Shape the response
    const acceptedPatients = patients.map((patient) => ({
      patientId: patient._id,
      patientName: patient.name,
      patientEmail: patient.email,
      records: patient.medicalHistory.filter(
        (record) =>
          record.doctorId.equals(doctorObjectId) && record.status === "Accepted"
      ),
    }));

    res.status(200).json(acceptedPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export { addPrescription, getAcceptedPatients };
