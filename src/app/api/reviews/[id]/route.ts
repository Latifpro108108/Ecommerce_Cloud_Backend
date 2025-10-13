import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/reviews/[id] - Get single review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        product: {
          select: {
            productName: true,
            imageURL: true,
            price: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Review not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: { review },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch review',
      },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { rating, comment } = body;

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Review not found',
        },
        { status: 404 }
      );
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Rating must be between 1 and 5',
        },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (rating) updateData.rating = parseInt(rating);
    if (comment !== undefined) updateData.comment = comment;

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      status: 'success',
      message: 'Review updated successfully',
      data: { review },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update review',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Review not found',
        },
        { status: 404 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Review deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete review',
      },
      { status: 500 }
    );
  }
}
