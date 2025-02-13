import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const SECRET_KEY = "your_secret_key"; // Change in production

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Session Middleware (For traditional session-based auth, not JWT)
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false },
  }),
);

// Database Connection
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pank0986!",
  database: "ins",
});

// 🔹 Improved Middleware for Token Verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

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

// 🔹 Signup API (Returns JWT Token)
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;
    if (!name || !email || !phone_number || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (name, email, phone_number, password) VALUES (?, ?, ?, ?)";

    const [result] = await db.execute(query, [
      name,
      email,
      phone_number,
      hashedPassword,
    ]);

    const token = jwt.sign({ userId: result.insertId, email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: result.insertId, name, email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error storing user data", error });
  }
});

// 🔹 Login API (Generates JWT Token)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Database error", error });
  }
});

// 🔹 Protected Route - Fetch User Profile (Now Returns a Fresh Token)
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const [results] = await db.execute(
      "SELECT name, email FROM users WHERE id = ?",
      [req.user.userId],
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new token in case the frontend needs to refresh
    const newToken = jwt.sign(
      { userId: req.user.userId, email: req.user.email },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.json({
      message: "User authenticated",
      user: results[0],
      token: newToken, // Return new token in response
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error retrieving user data", error });
  }
});

// 🔹 Logout API (JWT-Based, No Session Clearing)
app.post("/api/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
