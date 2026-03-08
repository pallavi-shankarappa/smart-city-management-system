import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, name, iat, exp }

    const dbUser = await User.findById(payload.id).select("-password");
    if (!dbUser) {
      return res.status(401).json({ message: "User not found" });
    }
    req.dbUser = dbUser;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

