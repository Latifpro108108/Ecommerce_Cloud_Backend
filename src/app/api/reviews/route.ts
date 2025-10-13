import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/reviews - Get all reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const customerId = searchParams.get('customerId');
    const rating = searchParams.get('rating');

    const where: any = {};
    if (productId) where.productId = productId;
    if (customerId) where.customerId = customerId;
    if (rating) where.rating = parseInt(rating);

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            productName: true,
            imageURL: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { reviews },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch reviews',
      },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, productId, rating, comment } = body;

    // Validation
    if (!customerId || !productId || !rating) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer ID, product ID, and rating are required',
        },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Rating must be between 1 and 5',
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer not found',
        },
        { status: 404 }
      );
    }

    // Check if customer already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        customerId,
        productId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'You have already reviewed this product',
        },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        customerId,
        productId,
        rating: parseInt(rating),
        comment,
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            productName: true,
            imageURL: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Review created successfully',
        data: { review },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create review',
      },
      { status: 500 }
    );
  }
}
