// GoMart Cart Routes
// Shopping cart management endpoints

const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get customer cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: req.user.id },
    include: {
      cartItems: {
        include: {
          product: {
            select: {
              id: true,
              productName: true,
              price: true,
              imageURL: true,
              stockQuantity: true
            }
          }
        }
      }
    }
  });

  if (!cart) {
    // Create cart if it doesn't exist
    const newCart = await prisma.cart.create({
      data: { customerId: req.user.id },
      include: {
        cartItems: true
      }
    });
    return res.json({
      status: 'success',
      data: { cart: newCart }
    });
  }

  // Calculate totals
  const totalItems = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.cartItems.reduce((sum, item) => 
    sum + (item.quantity * item.product.price), 0
  );

  res.json({
    status: 'success',
    data: {
      cart: {
        ...cart,
        totalItems,
        totalAmount
      }
    }
  });
}));

module.exports = router;
