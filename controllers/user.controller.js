import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileUrl = "";
    if (req.file) {
      profileUrl = req.file.path;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profile: profileUrl,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);

    if (error.message.includes("File too large")) {
      return res.status(400).json({ message: "Image size should be less than 5MB" });
    }
    if (error.message.includes("image formats")) {
      return res.status(400).json({ message: "Only JPG, JPEG, PNG images are allowed" });
    }

    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found", success: false });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};