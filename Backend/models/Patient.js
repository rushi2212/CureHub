import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const patientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "patient" },
    age: { type: Number },
    mobile: { type: String },
    gender: { type: String },
    address: { type: String },
    bloodGroup: { type: String },
    emergencyContact: { type: String },
    profileImg: { type: String },
    medicalHistory: [
      {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        symptoms: { type: String },
        date: { type: String },
        time: { type: String },
        status: {
          type: String,
          enum: ["Accepted", "Rejected", "Pending"],
          default: "Pending",
        },
        prescription: { type: String }, // Added prescription field
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
