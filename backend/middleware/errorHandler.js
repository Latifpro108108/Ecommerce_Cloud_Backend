// GoMart Error Handling Middleware
// Centralized error handling for the API

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  console.error('🚨 Error:', err);

  // Prisma Client Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    let message = 'Database operation failed';
    
    switch (err.code) {
      case 'P2002':
        // Unique constraint violation
        const field = err.meta?.target?.[0] || 'field';
        message = `A record with this ${field} already exists`;
        error = { statusCode: 400, message };
        break;
      case 'P2014':
        // Required relation violation
        message = 'The change you are trying to make would violate a required relation';
        error = { statusCode: 400, message };
        break;
      case 'P2003':
        // Foreign key constraint violation
        message = 'Foreign key constraint violation';
        error = { statusCode: 400, message };
        break;
      case 'P2025':
        // Record not found
        message = 'Record not found';
        error = { statusCode: 404, message };
        break;
      default:
        error = { statusCode: 500, message };
    }
  }

  // Prisma Validation Errors
  if (err.name === 'PrismaClientValidationError') {
    const message = 'Invalid data provided';
    error = { statusCode: 400, message };
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { statusCode: 401, message };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { statusCode: 401, message };
  }

  // Validation Errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { statusCode: 400, message };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err 
    })
  });
};

// Async handler wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};
