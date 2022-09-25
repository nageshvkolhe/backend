function errorHandler(err, req, resp, next) {
  if (err.name === "UnauthorizedError") {
    resp.status(401).json({ message: "The user is not authorised !!" });
  }

  if (err.name === "ValidationError") {
    resp.status(401).json({ message: err });
  }

  return resp.status(500).json({ message: err });
}
module.exports = errorHandler;
