import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/user.schema.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;