// GoMart Authentication Middleware
// JWT-based authentication for protecting routes

const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { asyncHandler } = require('./errorHandler');

// Protect routes - require valid JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (check if customer exists and is active)
    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    });

    if (!customer) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, user not found'
      });
    }

    if (!customer.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is inactive, please contact support'
      });
    }

    // Attach user to request
    req.user = customer;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token failed'
    });
  }
});

// Vendor protection - require vendor authentication
const protectVendor = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get vendor from token
    const vendor = await prisma.vendor.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        vendorName: true,
        isVerified: true
      }
    });

    if (!vendor) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, vendor not found'
      });
    }

    if (!vendor.isVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Vendor account not verified, please contact support'
      });
    }

    // Attach vendor to request
    req.vendor = vendor;
    next();
  } catch (error) {
    console.error('Vendor auth middleware error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token failed'
    });
  }
});

// Optional auth - doesn't require token but will attach user if valid token provided
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const customer = await prisma.customer.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true
        }
      });

      if (customer && customer.isActive) {
        req.user = customer;
      }
    } catch (error) {
      // Invalid token, but continue without user
      console.warn('Optional auth - invalid token provided');
    }
  }

  next();
});

// Generate JWT token
const generateToken = (id, type = 'customer') => {
  return jwt.sign(
    { id, type },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = {
  protect,
  protectVendor,
  optionalAuth,
  generateToken
};
