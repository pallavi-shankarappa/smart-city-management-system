const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["electricity", "water", "road", "garbage"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },

    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
  lat: Number,
  lng: Number
},

    // ⭐ NEW FIELD (for uploaded image)
    image: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);