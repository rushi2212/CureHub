// Backend/routes/patientRoutes.js
import express from "express";
import {
  getDoctorsWithAvailability,
  bookAppointment,
  getPatientAppointments,
  updatePatientProfile,
  handleChatbotRequest,
  analyzeReport,
  recommendDoctors,
  cancelAppointment,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";
// const multer = require("multer");
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";

const router = express.Router();

router.get("/doctors", protect, getDoctorsWithAvailability);
router.get("/doctors/data", getDoctorsWithAvailability);
router.post("/appointments", protect, bookAppointment);
router.get("/appointments", protect, getPatientAppointments);
router.delete("/appointments/:id", protect, cancelAppointment);
router.put("/profile", protect, updatePatientProfile);
// Chatbot route
router.post("/chatbot", handleChatbotRequest);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for file uploads
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// POST route for uploading and analyzing reports
router.post("/analyze", upload.single("file"), analyzeReport);

router.post("/recommendations", recommendDoctors);

export default router;
