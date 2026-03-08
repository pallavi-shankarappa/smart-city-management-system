const Complaint = require("../models/Complaint");

const getStats = async (req, res, next) => {
  try {
    const baseQuery = {};

    // Citizens should only see their own stats. Officers see all complaints.
    if (req.user.role === "citizen") {
      baseQuery.citizen = req.user.id;
    }

    const [total, pending, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments(baseQuery),
      Complaint.countDocuments({ ...baseQuery, status: "pending" }),
      Complaint.countDocuments({ ...baseQuery, status: "in-progress" }),
      Complaint.countDocuments({ ...baseQuery, status: "resolved" }),
    ]);

    return res.json({
      success: true,
      data: { total, pending, inProgress, resolved },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };

