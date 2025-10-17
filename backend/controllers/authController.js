import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/users.model.js";
import { generateToken } from "../utils/generateToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";

// register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    if (user) {
      const refreshToken = generateRefreshToken(user._id);
      
      const maxAge = process.env.JWT_REFRESH_EXPIRES_IN
        ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000 
        : 30 * 24 * 60 * 60 * 1000; 

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: maxAge,
      });

      return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
    return res.status(400).json({ message: "Invalid user data" });
  } catch (err) {
    console.error("Registration error:", err);
  }
};

// login
export const logInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const refreshToken = generateRefreshToken(user._id);

      const maxAge = process.env.JWT_REFRESH_EXPIRES_IN
        ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: maxAge,
      });

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
    return res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    console.error("Login error:", err);
  }
};

//logout
export const logOutUser = async (req, res, next) => {
  try {
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.log("Logout error:", err);
  }
};

// profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) return res.json(user);
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.log("Profile error:", err)
  }
};

// refresh token
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET not set");

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // create new access token
    const accessToken = generateToken(decoded.id);
    return res.json({ token: accessToken });
  } catch (err) {
    console.log("Refresh token error:", err)
  }
};
