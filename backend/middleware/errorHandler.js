export function notFound(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = { statusCode: 404, message };
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { statusCode: 400, message };
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { statusCode: 400, message };
  }

  const status = error.statusCode || 500;
  res.status(status).json({
    message: error.message || "Internal server error",
  });
}

