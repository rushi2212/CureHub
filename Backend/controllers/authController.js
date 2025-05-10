import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role, age, mobile, gender } = req.body;

  let userModel;
  if (role === "admin") userModel = Admin;
  else if (role === "doctor") userModel = Doctor;
  else if (role === "patient") userModel = Patient;
  else return res.status(400).json({ message: "Invalid role" });

  const userExists = await userModel.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await userModel.create({ name, email, password, role, age, mobile, gender });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login User
// export const loginUser = async (req, res) => {
//   const { email, password, role } = req.body;

//   let userModel;
//   if (role === "admin") userModel = Admin;
//   else if (role === "doctor") userModel = Doctor;
//   else if (role === "patient") userModel = Patient;
//   else return res.status(400).json({ message: "Invalid role" });

//   const user = await userModel.findOne({ email });
//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401).json({ message: "Invalid email or password" });
//   }
// };
export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;
  
    let userModel;
    if (role === "admin") userModel = Admin;
    else if (role === "doctor") userModel = Doctor;
    else if (role === "patient") userModel = Patient;
    else return res.status(400).json({ message: "Invalid role selected" });
  
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
  
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  };

  export const getCurrentUser = async (req, res) => {
    try {
      let user;
      
      // Check which model the user belongs to based on their role
      switch(req.user.role) {
        case 'admin':
          user = await Admin.findById(req.user._id).select('-password');
          break;
        case 'doctor':
          user = await Doctor.findById(req.user._id).select('-password');
          break;
        case 'patient':
          user = await Patient.findById(req.user._id).select('-password');
          break;
        default:
          return res.status(400).json({ message: 'Invalid user role' });
      }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };