import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res, next) {
  console.log("Registering user. Payload received:", req.body);
  try {
    const { name, email, password, role = "citizen", department, phone } = req.body;

    // Check for missing required fields manually (extra safety)
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !name, email: !email, password: !password });
      return res.status(400).json({
        message: "All required fields are mandatory",
        missingFields: {
          name: !name,
          email: !email,
          password: !password,
        },
      });
    }

    console.log("Checking if user exists with email:", email);
    const existingUser = await User.findOne({ email });
    console.log("Existing user found:", existingUser);

    if (existingUser) {
      console.log("Registration failed: User already exists");
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    console.log("Creating user in MongoDB...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: role === "officer" ? department : undefined,
      phone,
    });
    console.log("User created successfully:", user);

    console.log("Generating JWT token...");
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("Token generated successfully");

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

