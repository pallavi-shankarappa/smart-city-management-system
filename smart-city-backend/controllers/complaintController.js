const Complaint = require("../models/Complaint");

// CREATE COMPLAINT
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, lat, lng } = req.body;

    const complaint = new Complaint({
      title,
      description,
      category,

      citizen: req.user.id,

      image: req.file ? req.file.filename : null,

      location: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      data: complaint
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating complaint"
    });
  }
};


// GET COMPLAINTS
const getComplaints = async (req, res, next) => {
  try {
    const {
      status,
      category,
      keyword,
      page = 1,
      limit = 5,
      sort = "latest",
      assigned, // "me" | "unassigned" | "any"
      sortBy, // createdAt | status | category
      sortOrder, // asc | desc
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    let query = {};

    if (req.user.role === "citizen") {
      query.citizen = req.user.id;
    }

    if (req.user.role === "officer") {
      if (assigned === "me") query.assignedOfficer = req.user.id;
      if (assigned === "unassigned") query.assignedOfficer = { $exists: false };
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sortBy) {
      const order = sortOrder === "asc" ? 1 : -1;
      if (["createdAt", "status", "category"].includes(sortBy)) {
        sortOption = { [sortBy]: order };
      }
    }

    const total = await Complaint.countDocuments(query);

    const complaints = await Complaint.find(query)
      .populate("citizen", "name email")
      .populate("assignedOfficer", "name email")
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      data: complaints,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });

  } catch (error) {
    next(error);
  }
};

// GET COMPLAINT BY ID
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("citizen", "name email")
      .populate("assignedOfficer", "name email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (req.user.role === "citizen" && String(complaint.citizen?._id) !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// UPDATE STATUS
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const validTransitions = {
      pending: ["in-progress"],
      "in-progress": ["resolved"],
      resolved: []
    };

    if (!validTransitions[complaint.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${complaint.status} to ${status}`
      });
    }

    complaint.status = status;
    await complaint.save();

    res.json({
      message: "Status updated successfully",
      complaint,
    });

  } catch (error) {
    next(error);
  }
};


// ASSIGN COMPLAINT
const assignComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assignedOfficer = req.body.officerId;
    complaint.status = "in-progress";

    await complaint.save();

    res.json({
      message: "Complaint assigned successfully",
      complaint,
    });

  } catch (error) {
    next(error);
  }
};


// DASHBOARD STATS
const getDashboardStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "pending" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const inProgress = await Complaint.countDocuments({ status: "in-progress" });

    res.json({
      total,
      pending,
      resolved,
      inProgress,
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getDashboardStats
};