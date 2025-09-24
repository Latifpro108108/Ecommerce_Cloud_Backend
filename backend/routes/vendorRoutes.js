// GoMart Vendor Routes
// Vendor management endpoints

const express = require('express');
const { prisma } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all verified vendors
// @route   GET /api/vendors
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const vendors = await prisma.vendor.findMany({
    where: { isVerified: true },
    select: {
      id: true,
      vendorName: true,
      region: true,
      city: true,
      joinedDate: true,
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      vendorName: 'asc'
    }
  });

  res.json({
    status: 'success',
    data: { vendors }
  });
}));

module.exports = router;
