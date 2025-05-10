import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "doctor" },
    mobile: { type: String },
    age: { type: Number },
    gender: { type: String },
    profileImg: { type: String },
    specialization: { type: String },
    degree: { type: String },
    experience: { type: String },
    bio: { type: String },
    availability: [
    {
      date: {
        type: String,
        required: true,           // e.g. "2025-05-11"
        match: /^\d{4}-\d{2}-\d{2}$/  // optional: enforce YYYY-MM-DD
      },
      timeSlots: [
        {
          type: String,
          required: true          // e.g. "13:00"
        }
      ]
    }
  ],

    ratings: {
      averageRating: { type: Number, default: 0 }, // Average rating for the doctor
      totalRatings: { type: Number, default: 0 }, // Total number of ratings
    },
    consultationCount: { type: Number, default: 0 }, // Total number of consultations
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  },
  { timestamps: true }
);

// Hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
