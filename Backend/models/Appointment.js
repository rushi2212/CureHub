import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Storing as a string (YYYY-MM-DD)
      required: true,
    },
    time: {
      type: String, // Storing as a string (HH:MM AM/PM)
      required: true,
    },
    prescription: [
      {
        medicine: String,
        dosage: String,
        instructions: String,
        
      },
    ], // Added prescription field
    status: {
      type: String,
      enum: ["Accepted", "Rejected", "Pending" , "Cancelled"],
      default: "Pending",
    },
    isFilled: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
