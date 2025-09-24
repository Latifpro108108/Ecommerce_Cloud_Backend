// GoMart Category Routes
// Product category management endpoints

const express = require('express');
const { prisma } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      categoryName: 'asc'
    }
  });

  res.json({
    status: 'success',
    data: { categories }
  });
}));

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        take: 8,
        include: {
          vendor: {
            select: {
              vendorName: true,
              isVerified: true
            }
          }
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    }
  });

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }

  res.json({
    status: 'success',
    data: { category }
  });
}));

module.exports = router;
