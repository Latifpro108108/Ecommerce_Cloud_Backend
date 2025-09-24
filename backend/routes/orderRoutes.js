// GoMart Order Routes
// Order management endpoints

const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get customer orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { customerId: req.user.id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              productName: true,
              imageURL: true
            }
          }
        }
      },
      payment: true,
      shipping: true
    },
    orderBy: {
      orderDate: 'desc'
    }
  });

  res.json({
    status: 'success',
    data: { orders }
  });
}));

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      customerId: req.user.id
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      },
      payment: true,
      shipping: {
        include: {
          courier: true
        }
      }
    }
  });

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  res.json({
    status: 'success',
    data: { order }
  });
}));

module.exports = router;
