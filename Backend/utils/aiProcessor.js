// const tf = require("@tensorflow/tfjs-node");
import tf from "@tensorflow/tfjs-node";

export const processFileWithAI = async (fileBuffer) => {
  try {
    // Load the model (ensure you have the correct path to your model)
    const model = await tf.loadLayersModel("file://path/to/model.json");

    // Preprocess the image (convert buffer to Tensor)
    const imageTensor = tf.node.decodeImage(fileBuffer, 3)
      .resizeBilinear([224, 224]) // Resize to match model input shape
      .expandDims(0) // Add batch dimension
      .div(255.0); // Normalize pixel values

    // Predict using the model
    const predictions = model.predict(imageTensor);

    // Post-process predictions (convert Tensor to JSON)
    const result = predictions.arraySync();

    // Return the analysis result
    return { result, message: "Report analyzed successfully" };
  } catch (error) {
    console.error("Error processing file with AI:", error);
    throw new Error("AI model failed to analyze the report.");
  }
};


