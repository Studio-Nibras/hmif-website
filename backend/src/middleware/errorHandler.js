function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Request error:", error.message);

  const statusCode =
    Number.isInteger(error.status) && error.status >= 400 && error.status <= 599
      ? error.status
      : 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode < 500 ? error.message : "Internal server error",
  });
}

module.exports = errorHandler;
