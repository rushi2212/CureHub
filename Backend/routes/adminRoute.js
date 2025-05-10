// Backend/routes/authRoutes.js
import express from "express";
import { 
  addDoctor,
  getDoctors,
  deleteDoctor,
  getPatients
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// Doctor management routes
router.post("/doctors", protect, addDoctor);
router.get("/doctors", protect, getDoctors);
router.delete("/doctors/:id", protect, deleteDoctor);
router.get("/patients", protect, getPatients);

export default router;