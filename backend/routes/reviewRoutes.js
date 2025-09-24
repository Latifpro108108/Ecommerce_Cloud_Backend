// GoMart Review Routes
// Product review and rating endpoints

const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  // Validation
  if (!productId || !rating) {
    return res.status(400).json({
      status: 'error',
      message: 'Product ID and rating are required'
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      status: 'error',
      message: 'Rating must be between 1 and 5'
    });
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Check if customer already reviewed this product
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId: req.user.id,
      productId
    }
  });

  if (existingReview) {
    return res.status(400).json({
      status: 'error',
      message: 'You have already reviewed this product'
    });
  }

  const review = await prisma.review.create({
    data: {
      customerId: req.user.id,
      productId,
      rating,
      comment
    },
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
    data: { review }
  });
}));

module.exports = router;
