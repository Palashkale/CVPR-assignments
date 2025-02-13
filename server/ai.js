import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import Groq from "groq-sdk"; // Import Groq SDK

// Initialize express app
const app = express();
const port = 3001;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for specific frontend domain
app.use(cors({ origin: "http://localhost:5173" })); // Enable CORS for frontend

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "Pank0986!", // Replace with your MySQL password
  database: "gecawings", // Your database name
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Could not connect to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

// API route to save the health profile data
app.post("/api/saveHealthProfile", async (req, res) => {
  const { age, weight, height, bloodPressure, conditions, medications } =
    req.body;

  try {
    const query = `
      INSERT INTO table_profiles (age, weight, height, bloodPressure, conditions, medications)
      VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
      age,
      weight,
      height,
      bloodPressure,
      conditions,
      medications,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error saving health profile:", err);
        return res
          .status(500)
          .json({ message: "Failed to save health profile" });
      }
      return res.status(200).json({
        id: result.insertId,
        age,
        weight,
        height,
        bloodPressure,
        conditions,
        medications,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error occurred while saving health profile" });
  }
});

// API route to generate an AI recommendation using Groq API
app.post("/api/generateRecommendation", async (req, res) => {
  const { age, weight, height, bloodPressure, conditions, medications } =
    req.body;

  const prompt = `
    Based on the following health data, recommend a suitable health insurance plan for the user:
    Age: ${age}
    Weight: ${weight}
    Height: ${height}
    Blood Pressure: ${bloodPressure}
    Medical Conditions: ${conditions}
    Medications: ${medications}

    please recommend insuarance according to the following data describe it properly and dgenerate 5-6 plans
    :

  `;

  try {
    // Initialize Groq SDK
    const apiKey = "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"; // Load API key from environment variable

    if (!apiKey) {
      console.error("Groq API key is missing. Please set GROQ_API_KEY.");
      return res
        .status(500)
        .json({ message: "Internal server error: API key missing" });
    }

    const groq = new Groq({ apiKey });

    // Make a call to the Groq API
    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile", // Specify the model
      max_tokens: 100, // Limit response to 100 words
    });

    const recommendation = groqResponse.choices[0]?.message?.content?.trim();
    if (!recommendation) {
      return res
        .status(500)
        .json({ message: "Failed to generate recommendation" });
    }

    res.status(200).json({ recommendation });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ message: "Failed to generate recommendation" });
  }
});

// API route to save the insurance recommendation
app.post("/api/saveRecommendation", async (req, res) => {
  const { recommendation } = req.body;

  try {
    const query = `
      INSERT INTO InsuranceAIRecommendations (recommendation)
      VALUES (?)`;

    const values = [recommendation];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error saving recommendation:", err);
        return res
          .status(500)
          .json({ message: "Failed to save recommendation" });
      }
      return res.status(200).json({
        id: result.insertId,
        recommendation,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error occurred while saving recommendation" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
