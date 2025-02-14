import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const SECRET_KEY = "your_secret_key"; // Use a strong secret key in production

app.use(express.json());

// CORS Configuration to allow specific origin and credentials
const corsOptions = {
  origin: "http://localhost:5173", // Your frontend's URL
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allowed headers
  credentials: true, // Allow sending cookies or authorization headers
};

app.use(cors(corsOptions)); // Apply CORS middleware with the configuration

// Database connection
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pank0986!",
  database: "ins",
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// Admin Signup API
app.post("/api/admin/signup", async (req, res) => {
  const { adminName, email, password } = req.body;

  try {
    if (!adminName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the admin already exists
    const [existingAdmins] = await db.execute(
      "SELECT * FROM admin WHERE email = ?",
      [email],
    );
    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO admin (admin_name, email, password) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [
      adminName,
      email,
      hashedPassword,
    ]);

    const token = jwt.sign({ id: result.insertId }, SECRET_KEY, {
      expiresIn: "24h",
    });
    console.log(token);
    res.status(201).json({
      message: "Admin account created successfully",
      token,
      admin: { id: result.insertId, adminName, email },
    });
  } catch (error) {
    // Check if error is instance of Error (common in Express error handling)
    if (error instanceof Error) {
      console.error("Admin signup error:", error.message);
      return res.status(500).json({
        message: "Error creating admin account",
        error: error.message,
      });
    }
    // Fallback to generic error handling
    console.error("Unknown error during admin signup:", error);
    res.status(500).json({ message: "Unknown error during admin signup" });
  }
});

// Admin Login API
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.execute("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin.id }, SECRET_KEY, { expiresIn: "24h" });

    res.json({
      message: "Login successful",
      token,
      admin: { id: admin.id, adminName: admin.admin_name, email: admin.email },
    });
  } catch (error) {
    // Check if error is instance of Error (common in Express error handling)
    if (error instanceof Error) {
      console.error("Admin login error:", error.message);
      return res
        .status(500)
        .json({ message: "Database error", error: error.message });
    }
    // Fallback to generic error handling
    console.error("Unknown error during admin login:", error);
    res.status(500).json({ message: "Unknown error during admin login" });
  }
});

// Admin Profile API
app.get("/api/admin/profile", verifyToken, async (req, res) => {
  try {
    // Query the admin data using the decoded user ID from the token
    const [results] = await db.execute(
      "SELECT admin_name, email FROM admin WHERE id = ?",
      [req.user.id],
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = results[0]; // Get the admin data from the query result

    // Generate a new token for the admin (this can be useful if the token was refreshed)
    const token = jwt.sign({ id: req.user.id }, SECRET_KEY, {
      expiresIn: "24h",
    });

    // Send the admin's name, email, and the new token in the response
    res.json({
      message: "Admin authenticated",
      admin: {
        adminName: admin.admin_name,
        email: admin.email,
      },
      token, // Send the new token along with the admin details
    });
  } catch (error) {
    // Handle known error types
    if (error instanceof Error) {
      console.error("Profile fetch error:", error.message);
      return res
        .status(500)
        .json({ message: "Error retrieving admin data", error: error.message });
    }
    // Handle any unexpected errors
    console.error("Unknown error during profile fetch:", error);
    res.status(500).json({ message: "Unknown error during profile fetch" });
  }
});

// Start the Express server
const PORT = 3001; // Keep port 3001 (or change to 3000 if needed)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Admin Logout API
app.post("/api/admin/logout", (req, res) => {
  // To log out, we simply clear the token from the client side
  // No need to verify the token on the server, just clear the session or token on the client side
  res.json({ message: "Admin logged out successfully" });
});
