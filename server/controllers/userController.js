import { User } from "../models/User.js";

export async function listOfficers(req, res, next) {
  try {
    const officers = await User.find({ role: "officer" }).select("name email department role");
    res.json({ data: officers });
  } catch (err) {
    next(err);
  }
}

