// GoMart Product Routes
// Product catalog management endpoints

const express = require('express');
const { prisma } = require('../config/database');
const { protect, protectVendor, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    vendor,
    minPrice,
    maxPrice,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build where clause
  const where = {};

  if (category) {
    where.categoryId = category;
  }

  if (vendor) {
    where.vendorId = vendor;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (search) {
    where.OR = [
      { productName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Get products with relations
  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          categoryName: true
        }
      },
      vendor: {
        select: {
          id: true,
          vendorName: true,
          region: true,
          city: true,
          isVerified: true
        }
      },
      reviews: {
        select: {
          rating: true
        }
      }
    },
    skip,
    take: parseInt(limit),
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  // Add average rating to each product
  const productsWithRating = products.map(product => {
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;
    
    return {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
      reviews: undefined // Remove reviews array from response
    };
  });

  // Get total count for pagination
  const totalProducts = await prisma.product.count({ where });

  res.json({
    status: 'success',
    data: {
      products: productsWithRating,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / parseInt(limit)),
        totalProducts,
        hasNext: skip + parseInt(limit) < totalProducts,
        hasPrev: parseInt(page) > 1
      }
    }
  });
}));

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          categoryName: true,
          description: true
        }
      },
      vendor: {
        select: {
          id: true,
          vendorName: true,
          region: true,
          city: true,
          isVerified: true
        }
      },
      reviews: {
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Calculate average rating
  const ratings = product.reviews.map(review => review.rating);
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
    : 0;

  res.json({
    status: 'success',
    data: {
      product: {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length
      }
    }
  });
}));

// @desc    Create new product (Vendor only)
// @route   POST /api/products
// @access  Private (Vendor)
router.post('/', protectVendor, asyncHandler(async (req, res) => {
  const {
    productName,
    description,
    price,
    stockQuantity,
    categoryId,
    imageURL
  } = req.body;

  // Validation
  if (!productName || !description || !price || !stockQuantity || !categoryId) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required fields'
    });
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid category ID'
    });
  }

  const product = await prisma.product.create({
    data: {
      productName,
      description,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      categoryId,
      vendorId: req.vendor.id,
      imageURL
    },
    include: {
      category: {
        select: {
          id: true,
          categoryName: true
        }
      },
      vendor: {
        select: {
          id: true,
          vendorName: true,
          region: true,
          city: true
        }
      }
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: { product }
  });
}));

// @desc    Update product (Vendor only - own products)
// @route   PUT /api/products/:id
// @access  Private (Vendor)
router.put('/:id', protectVendor, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    description,
    price,
    stockQuantity,
    categoryId,
    imageURL
  } = req.body;

  // Check if product exists and belongs to vendor
  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!existingProduct) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  if (existingProduct.vendorId !== req.vendor.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to update this product'
    });
  }

  // Build update data
  const updateData = {};
  if (productName) updateData.productName = productName;
  if (description) updateData.description = description;
  if (price) updateData.price = parseFloat(price);
  if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
  if (categoryId) updateData.categoryId = categoryId;
  if (imageURL) updateData.imageURL = imageURL;

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: {
        select: {
          id: true,
          categoryName: true
        }
      },
      vendor: {
        select: {
          id: true,
          vendorName: true,
          region: true,
          city: true
        }
      }
    }
  });

  res.json({
    status: 'success',
    message: 'Product updated successfully',
    data: { product }
  });
}));

// @desc    Delete product (Vendor only - own products)
// @route   DELETE /api/products/:id
// @access  Private (Vendor)
router.delete('/:id', protectVendor, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if product exists and belongs to vendor
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  if (product.vendorId !== req.vendor.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to delete this product'
    });
  }

  await prisma.product.delete({
    where: { id }
  });

  res.json({
    status: 'success',
    message: 'Product deleted successfully'
  });
}));

module.exports = router;
