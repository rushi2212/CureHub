// Backend/controllers/patientController.js
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import axios from "axios";
import fs from "fs";
import path from "path";
// import { processFileWithAI } from "../utils/aiProcessor.js";
import * as tf from "@tensorflow/tfjs";
import { fileURLToPath } from "url";
import symptomsToSpecialization from "../data/symptomsToSpecialization.json" assert { type: "json" };
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Get all doctors with availability
export const getDoctorsWithAvailability = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .select("-password")
      .populate("availability");

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, symptoms, date, time } = req.body;
    const patientId = req.user._id;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if time slot is available
    const isAvailable = doctor.availability.some(
      (avail) => avail.date === date && avail.timeSlots.includes(time)
    );

    if (!isAvailable) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not available" });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      symptoms,
      date,
      time,
      status: "Pending",
    });

    await appointment.save();

    // Add to patient's medical history
    await Patient.findByIdAndUpdate(patientId, {
      $push: {
        medicalHistory: {
          doctorId,
          symptoms,
          date,
          time,
          status: "Pending",
        },
      },
    });

    // Add patient to doctor's patients list if not already there
    await Doctor.findByIdAndUpdate(doctorId, {
      $addToSet: { patients: patientId },
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//cancle Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;  // Capture the appointment ID from the URL
    const patientId = req.user._id;

    // Find appointment
    const appointment = await Appointment.findById(id); // Use `id` here to match the route

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ensure the appointment belongs to the logged-in patient
    if (appointment.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update appointment status to "Cancelled"
    appointment.status = "Cancelled";
    await appointment.save();

    // Also update status in Patient's medicalHistory
    await Patient.findByIdAndUpdate(patientId, {
      $set: {
        "medicalHistory.$[elem].status": "Cancelled",
      },
    }, {
      arrayFilters: [{ "elem.date": appointment.date, "elem.time": appointment.time }],
      new: true,
    });

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get patient appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;

    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name specialization degree")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
  try {
    const { name, mobile, age, gender, address, bloodGroup, emergencyContact } =
      req.body;
    const patientId = req.user._id;

    const patient = await Patient.findById(patientId);

    if (patient) {
      patient.name = name || patient.name;
      patient.mobile = mobile || patient.mobile;
      patient.age = age || patient.age;
      patient.gender = gender || patient.gender;
      patient.address = address || patient.address;
      patient.bloodGroup = bloodGroup || patient.bloodGroup;
      patient.emergencyContact = emergencyContact || patient.emergencyContact;

      if (req.file) {
        patient.profileImg = req.file.path;
      }

      const updatedPatient = await patient.save();

      res.json({
        _id: updatedPatient._id,
        name: updatedPatient.name,
        email: updatedPatient.email,
        mobile: updatedPatient.mobile,
        age: updatedPatient.age,
        gender: updatedPatient.gender,
        address: updatedPatient.address,
        bloodGroup: updatedPatient.bloodGroup,
        emergencyContact: updatedPatient.emergencyContact,
        profileImg: updatedPatient.profileImg,
        role: updatedPatient.role,
      });
    } else {
      res.status(404);
      throw new Error("Patient not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const handleChatbotRequest = async (req, res) => {
  const { message } = req.body;

  // Construct the request payload
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Based on the following patient symptoms and history, suggest probable medical conditions and further steps. Ensure the response is concise, accurate, and includes layman-friendly language:

Patient Symptoms: ${message}

Response requirements:
- List 2-3 possible conditions ranked by likelihood.
- Include a one-line explanation for each condition.
- Suggest 1-2 next steps for the patient (e.g., visit a specific specialist, take specific tests).

Format the response as:
1. Condition 1: Explanation
2. Condition 2: Explanation
3. Condition 3: Explanation

Next Steps:
- Step 1
- Step 2

Patient Message: '${message}'`,
          },
        ],
      },
    ],
  };

  try {
    // Send the request to the Gemini API
    const apiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log the full API response for debugging
    console.log("API Response:", JSON.stringify(apiResponse.data, null, 2));

    // Extract the response message
    const responseMessage =
      apiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated by the API.";

    // Send the response back to the client
    res.status(200).json({ response: responseMessage });
  } catch (error) {
    // Log the error details for debugging
    console.error("Error with Gemini API:", error.message || error);

    // Send an error response to the client
    res.status(500).json({
      error: "Unable to process your request. Please try again later.",
    });
  }
};

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeReport = async (req, res) => {
  try {
    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Path to the uploaded file
    const filePath = path.join(__dirname, "../uploads", req.file.filename);

    // Load the file into a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Process file with the AI model
    const analysisResult = await processFileWithAI(fileBuffer);

    // Delete the temporary file
    fs.unlinkSync(filePath);

    // Send the response back to the client
    res.status(200).json({
      message: "Analysis complete",
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("Error analyzing report:", error);

    // Handle errors and send response
    res.status(500).json({
      error: "Failed to process the uploaded report.",
      details: error.message,
    });
  }
};

// AI model processing function using TensorFlow.js
const processFileWithAI = async (fileBuffer) => {
  try {
    // Create a tensor from the file buffer
    const dataTensor = tf.tensor(
      new Uint8Array(fileBuffer),
      undefined,
      "int32"
    ); // Explicitly specify int32
    console.log("Tensor created:", dataTensor.shape);

    // Convert tensor to float32
    const floatTensor = dataTensor.toFloat();

    // Apply softmax to the float32 tensor
    const resultTensor = tf.softmax(floatTensor);
    const result = await resultTensor.array();

    // Dispose of tensors to free memory
    dataTensor.dispose();
    floatTensor.dispose();
    resultTensor.dispose();
    console.log("Result after softmax:", result);
    return { result };
  } catch (error) {
    console.error("Error in TensorFlow.js processing:", error);
    throw new Error("AI processing failed.");
  }
};

// Define a mapping of symptoms to specializations
// This is a simplified example. In a real-world scenario, this mapping would be more comprehensive.

// export const recommendDoctors = async (req, res) => {
//   try {
//     const { symptoms } = req.body; // Example: ["fever", "cough"]

//     if (!symptoms || !Array.isArray(symptoms)) {
//       return res.status(400).json({ message: "Invalid symptoms provided." });
//     }

//     // Map symptoms to specializations using the JSON file
//     const specializations = [
//       ...new Set(
//         symptoms
//           .map((symptom) => {
//             const mapping = symptomsToSpecialization.find(
//               (item) => item.symptom === symptom
//             );
//             return mapping ? mapping.specialization : null;
//           })
//           .filter(Boolean)
//       ),
//     ];

//     if (!specializations.length) {
//       return res
//         .status(404)
//         .json({ message: "No specializations found for the given symptoms." });
//     }

//     // Fetch doctors matching the specializations
//     const doctors = await Doctor.find({
//       specialization: { $in: specializations },
//     });

//     if (!doctors.length) {
//       return res
//         .status(404)
//         .json({ message: "No doctors found for the given symptoms." });
//     }

//     res.status(200).json({ doctors });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "An error occurred.", error: error.message });
//   }
// };

export const recommendDoctors = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ message: "Invalid symptoms provided." });
    }

    // Fetch all doctors with relevant fields
    const allDoctors = await Doctor.find({})
      .select("_id name specialization degree experience bio")
      .lean();

    if (!allDoctors.length) {
      return res
        .status(404)
        .json({ message: "No doctors found in the system." });
    }

    // Prepare prompt for Gemini AI
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: `I have a patient with the following symptoms: ${symptoms.join(
                ", "
              )}.
          
          Here is a list of doctors with their specializations and experience:
          ${JSON.stringify(allDoctors, null, 2)}
          
          Please analyze these symptoms and recommend the most suitable doctors from the list.
          Consider their specialization, experience, and other relevant factors.
          
          Return your response as a JSON array of doctor IDs in order of relevance (most relevant first).
          Format: ["id1", "id2", "id3"]
          Only return the array of IDs, nothing else.`,
            },
          ],
        },
      ],
    };

    // Call Gemini 2.0 Flash API directly
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      prompt,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract and parse the response
    const responseText = response.data.candidates[0].content.parts[0].text;
    let recommendedDoctorIds;

    try {
      recommendedDoctorIds = JSON.parse(responseText.trim());
      if (!Array.isArray(recommendedDoctorIds)) {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error parsing AI response:", responseText, error);
      return res.status(500).json({
        message: "Error processing AI recommendations.",
        error: "Invalid response format from AI",
      });
    }

    // Fetch complete doctor details for the recommended IDs
    const recommendedDoctors = await Doctor.find({
      _id: { $in: recommendedDoctorIds },
    });

    // Maintain the order from Gemini's response
    const orderedDoctors = recommendedDoctorIds
      .map((id) => recommendedDoctors.find((doc) => doc._id.toString() === id))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      doctors: orderedDoctors,
      aiRecommendation: true,
    });
  } catch (error) {
    console.error("Error in recommendDoctors:", error);

    let errorMessage = "An error occurred while recommending doctors.";
    if (error.response) {
      // Handle API response errors
      errorMessage = `AI API Error: ${error.response.status} - ${error.response.statusText}`;
      if (error.response.data && error.response.data.error) {
        errorMessage += ` - ${error.response.data.error.message}`;
      }
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      errorDetails: error.response?.data || error,
    });
  }
};
