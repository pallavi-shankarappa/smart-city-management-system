const User = require("../models/User");

const listOfficers = async (req, res, next) => {
  try {
    const officers = await User.find({ role: "officer" })
      .select("_id name email role")
      .sort({ name: 1 });

    return res.json({ success: true, data: officers });
  } catch (error) {
    next(error);
  }
};

module.exports = { listOfficers };

