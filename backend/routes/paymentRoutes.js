// GoMart Payment Routes
// Payment processing endpoints with Mobile Money support

const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Process payment for order
// @route   POST /api/payments/process
// @access  Private
router.post('/process', protect, asyncHandler(async (req, res) => {
  const {
    orderId,
    paymentMethod,
    transactionReference
  } = req.body;

  // Validation
  if (!orderId || !paymentMethod) {
    return res.status(400).json({
      status: 'error',
      message: 'Order ID and payment method are required'
    });
  }

  // Verify order belongs to customer
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: req.user.id
    }
  });

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      orderId,
      amount: order.totalAmount,
      paymentMethod,
      transactionReference,
      status: 'pending'
    }
  });

  res.json({
    status: 'success',
    message: 'Payment initiated successfully',
    data: { payment }
  });
}));

module.exports = router;
