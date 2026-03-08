import { Complaint } from "../models/Complaint.js";

export async function createComplaint(req, res, next) {
  try {
    const { title, description, category, department, lat, lng } = req.body;

    const dept = department || category;

    if (!title || !description || !dept) {
      return res.status(400).json({ message: "Title, description, and department are required" });
    }

    const complaint = await Complaint.create({
      title,
      description,
      department: dept,
      citizen: req.user.id,
      image: req.file ? req.file.filename : undefined,
      location:
        lat && lng
          ? {
              lat: Number(lat),
              lng: Number(lng),
            }
          : undefined,
    });

    res.status(201).json({ message: "Complaint created", data: complaint });
  } catch (err) {
    next(err);
  }
}

export async function listComplaints(req, res, next) {
  try {
    const { keyword, category, status, sort = "latest", page = 1, limit = 10 } = req.query;

    const query = {};

    if (req.user.role === "citizen") {
      query.citizen = req.user.id;
    }

    if (category) query.department = category;
    if (status) query.status = status;
    if (keyword) query.title = { $regex: keyword, $options: "i" };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const cursor = Complaint.find(query)
      .populate("citizen", "name email")
      .populate("assignedOfficer", "name email");

    cursor.sort(sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 });

    const [items, total] = await Promise.all([
      cursor.skip((pageNum - 1) * limitNum).limit(limitNum),
      Complaint.countDocuments(query),
    ]);

    res.json({
      data: items,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

export async function getComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id)
      .populate("citizen", "name email")
      .populate("assignedOfficer", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role === "citizen" && complaint.citizen.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ data: complaint });
  } catch (err) {
    next(err);
  }
}

export async function updateComplaintStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    const populated = await complaint
      .populate("citizen", "name email")
      .populate("assignedOfficer", "name email");

    res.json({ message: "Status updated", data: populated });
  } catch (err) {
    next(err);
  }
}

export async function assignComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const { officerId } = req.body;

    if (!officerId) {
      return res.status(400).json({ message: "officerId is required" });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assignedOfficer = officerId;
    await complaint.save();

    const populated = await complaint
      .populate("citizen", "name email")
      .populate("assignedOfficer", "name email");

    res.json({ message: "Complaint assigned", data: populated });
  } catch (err) {
    next(err);
  }
}

