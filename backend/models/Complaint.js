import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
{
  lat: { type: Number },
  lng: { type: Number }
},
{ _id: false }
);

const complaintSchema = new mongoose.Schema(
{
  // CATEGORY (Main issue type)
  category: {
    type: String,
    required: true,
    enum: [
      "Water",
      "Road",
      "Garbage",
      "Street Light",
      "Drainage",
      "Electricity",
      "Traffic",
      "Public Transport",
      "Park",
      "Sewage",
      "Other"
    ]
  },

  // TITLE (Specific issue)
  title: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "No Water Supply",
      "Low Water Pressure",
      "Pipe Leakage",
      "Garbage Not Collected",
      "Dustbin Overflow",
      "Large Pothole",
      "Road Completely Damaged",
      "Street Light Not Working",
      "Drainage Blocked",
      "Sewage Overflow",
      "Power Outage",
      "Electric Pole Damaged",
      "Traffic Signal Not Working",
      "Illegal Parking",
      "Park Maintenance Required",
      "Public Bus Delay",
      "Other"
    ]
  },

  // DESCRIPTION (Detailed issue)
  description: {
    type: String,
    required: true,
    enum: [
      "Water leaking from pipeline",
      "No water supply since morning",
      "Water pressure extremely low",
      "Dirty water coming from taps",
      "Garbage not collected for many days",
      "Dustbin overflowing with waste",
      "Large pothole causing accidents",
      "Road flooded with water",
      "Street light flickering or not working",
      "Drainage blocked causing water stagnation",
      "Sewage overflowing on road",
      "Power outage in the area",
      "Electric pole damaged or tilted",
      "Traffic signal lights not functioning",
      "Illegal parking blocking traffic",
      "Park area not maintained",
      "Public transport delay",
      "Other"
    ]
  },

  // If user selects "Other"
  customTitle: {
    type: String,
    trim: true
  },

  customDescription: {
    type: String,
    trim: true
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Emergency"],
    default: "Medium"
  },

  ward: {
    type: String,
    required: true,
    enum: [
      "Ward 1",
      "Ward 2",
      "Ward 3",
      "Ward 4",
      "Ward 5",
      "Ward 6",
      "Ward 7",
      "Ward 8",
      "Ward 9",
      "Ward 10"
    ]
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },

  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  image: {
    type: String
  },

  evidenceImage: {
    type: String
  },

  location: locationSchema
},
{ timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);