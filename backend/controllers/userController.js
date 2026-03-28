import { User } from "../models/User.js";

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function listOfficers(req, res, next) {
  try {
    const officers = await User.find({ role: "officer" }).select("name email department role");
    res.json({ data: officers });
  } catch (err) {
    next(err);
  }
}

