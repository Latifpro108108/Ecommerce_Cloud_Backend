// GoMart Customer Routes
// Authentication and customer management endpoints

const express = require('express');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { protect, generateToken, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Register new customer
// @route   POST /api/customers/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    region,
    city,
    address
  } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required fields'
    });
  }

  // Check if customer already exists
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      OR: [
        { email },
        { phoneNumber }
      ]
    }
  });

  if (existingCustomer) {
    return res.status(400).json({
      status: 'error',
      message: 'Customer with this email or phone number already exists'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create customer
  const customer = await prisma.customer.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      region: region || 'Greater Accra',
      city: city || 'Accra',
      address: address || ''
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      region: true,
      city: true,
      address: true,
      dateJoined: true,
      isActive: true
    }
  });

  // Create cart for customer
  await prisma.cart.create({
    data: {
      customerId: customer.id
    }
  });

  // Generate token
  const token = generateToken(customer.id);

  res.status(201).json({
    status: 'success',
    message: 'Customer registered successfully',
    data: {
      customer,
      token
    }
  });
}));

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password'
    });
  }

  // Find customer
  const customer = await prisma.customer.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!customer) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, customer.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!customer.isActive) {
    return res.status(401).json({
      status: 'error',
      message: 'Account is inactive, please contact support'
    });
  }

  // Generate token
  const token = generateToken(customer.id);

  res.json({
    status: 'success',
    message: 'Login successful',
    data: {
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        region: customer.region,
        city: customer.city,
        address: customer.address,
        dateJoined: customer.dateJoined,
        isActive: customer.isActive
      },
      token
    }
  });
}));

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      region: true,
      city: true,
      address: true,
      dateJoined: true,
      isActive: true
    }
  });

  res.json({
    status: 'success',
    data: { customer }
  });
}));

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    region,
    city,
    address
  } = req.body;

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;
  if (region) updateData.region = region;
  if (city) updateData.city = city;
  if (address) updateData.address = address;

  const customer = await prisma.customer.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      region: true,
      city: true,
      address: true,
      dateJoined: true,
      isActive: true
    }
  });

  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: { customer }
  });
}));

// @desc    Change password
// @route   PUT /api/customers/change-password
// @access  Private
router.put('/change-password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide current and new password'
    });
  }

  // Get customer with password
  const customer = await prisma.customer.findUnique({
    where: { id: req.user.id }
  });

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, customer.password);

  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      status: 'error',
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.customer.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword }
  });

  res.json({
    status: 'success',
    message: 'Password changed successfully'
  });
}));

module.exports = router;
