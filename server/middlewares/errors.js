/**
 * Middleware to handle 404 errors - Not Found
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the errorHandler middleware
};

/**
 * Middleware to handle errors
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({ message: err.message });
};

module.exports = {
  notFound,
  errorHandler
};
