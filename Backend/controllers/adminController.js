// Backend/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import nodemailer from "nodemailer";


// Generate random password
const generatePassword = (name) => {
  const randomString = Math.random().toString(36).slice(-6);
  return `${name}${randomString}`.substring(0, 8);
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Add doctor by admin
export const addDoctor = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Generate password
    const password = generatePassword(name);
    
    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      role: "doctor",
    });

    // Send email with credentials
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Doctor Account Credentials",
      html: `
        <h1>Welcome to CureHub!</h1>
        <p>Your doctor account has been created by admin.</p>
        <p>Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please login and change your password immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
  
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      await Doctor.deleteOne({ _id: req.params.id }); // Correct way to delete
  
      res.json({ message: "Doctor removed successfully" });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  export const getPatients = async (req, res) => {
    try {
      const patients = await Patient.find({}).select("-password");
      res.json(patients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };