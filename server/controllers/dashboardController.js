import { Complaint } from "../models/Complaint.js";

export async function getStats(req, res, next) {
  try {
    const match = {};

    if (req.user.role === "citizen") {
      match.citizen = req.user.id;
    }

    const [total, pending, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments(match),
      Complaint.countDocuments({ ...match, status: "pending" }),
      Complaint.countDocuments({ ...match, status: "in-progress" }),
      Complaint.countDocuments({ ...match, status: "resolved" }),
    ]);

    res.json({
      data: {
        total,
        pending,
        inProgress,
        resolved,
      },
    });
  } catch (err) {
    next(err);
  }
}

