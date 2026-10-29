function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Request error:", error.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

module.exports = errorHandler;
