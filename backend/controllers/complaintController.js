import { Complaint } from "../models/Complaint.js";

export async function createComplaint(req, res, next) {
  try {
    const { title, description, category, customCategory, priority, ward, lat, lng, customTitle, customDescription } = req.body;

    if (!title || !description || !category || !ward) {
      return res.status(400).json({ message: "Title, description, category, and ward are required" });
    }

    if (title === 'Other' && !customTitle) {
      return res.status(400).json({ message: "Custom title is required" });
    }

    if (description === 'Other' && !customDescription) {
      return res.status(400).json({ message: "Custom description is required" });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      customCategory: category === "Other" ? customCategory : undefined,
      customTitle: title === "Other" ? customTitle : undefined,
      customDescription: description === "Other" ? customDescription : undefined,
      priority: priority || "Medium",
      ward,
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
    const { keyword, category, status, priority, ward, sort = "latest", page = 1, limit = 10 } = req.query;

    const query = {};

    if (req.user.role === "citizen") {
      query.citizen = req.user.id;
    }

    if (category && category !== "All") query.category = category;
    if (status && status !== "All") query.status = status;
    if (priority && priority !== "All") query.priority = priority;
    if (ward && ward !== "All") query.ward = ward;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const cursor = Complaint.find(query)
      .populate("citizen", "name email");

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
      .populate("citizen", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Citizens can only view their own complaints
    if (req.user.role === "citizen" && complaint.citizen._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ data: complaint });
  } catch (err) {
    next(err);
  }
}

export async function updateComplaintStatus(req, res, next) {
  console.log("Status received in backend:", req.body.status);
  try {
    const { id } = req.params;
    const { status } = req.body;
    const evidenceImage = req.file ? req.file.filename : undefined;

    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // If resolving, require evidence photo
    if (status === "Resolved" && !evidenceImage && !complaint.evidenceImage) {
      return res.status(400).json({ message: "Evidence photo is required to resolve complaint" });
    }

    complaint.status = status;
    if (evidenceImage) complaint.evidenceImage = evidenceImage;
    
    await complaint.save();

    const populated = await Complaint.findById(id)
      .populate("citizen", "name email");

    res.json({ message: `Status updated to ${status}`, data: populated });
  } catch (err) {
    next(err);
  }
}

