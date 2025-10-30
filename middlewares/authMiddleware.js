import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "User Not Authorized", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error.message);
    res.status(401).json({ message: "Authorization failed..!" });
  }
};