import { body, validationResult } from "express-validator";

/* ================================
   Validate Complaint Creation
================================ */
export const validateComplaint = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .isIn(["Water", "Road", "Garbage", "Street Light", "Drainage", "Electricity", "Traffic", "Public Transport", "Park", "Sewage", "Other"])
    .withMessage("Invalid category"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

/* ================================
   Validate Status Update
================================ */
export const validateStatusUpdate = [
  body("status")
    .isIn(["Pending", "In Progress", "Resolved"])
    .withMessage("Invalid status value"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

/* ================================
   Validate Assign Complaint
================================ */
export const validateAssign = [
  body("officerId")
    .notEmpty()
    .withMessage("Officer ID is required")
    .isMongoId()
    .withMessage("Invalid Officer ID"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

/* ================================
   Validate User Registration
================================ */
export const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(["citizen", "officer", "admin"])
    .withMessage("Invalid role"),

  body("phone")
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("department")
    .if(body("role").equals("officer"))
    .notEmpty()
    .withMessage("Department is required for officers"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation failed in middleware:", errors.array());
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];
