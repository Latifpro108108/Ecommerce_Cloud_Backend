import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            categoryName: true,
            description: true,
          },
        },
        vendor: {
          select: {
            id: true,
            vendorName: true,
            region: true,
            city: true,
            isVerified: true,
            isActive: true,
            rating: true,
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
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

    // Calculate average rating
    const ratings = product.reviews.map((review) => review.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    return NextResponse.json({
      status: 'success',
      data: {
        product: {
          ...product,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: ratings.length,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      productName, 
      description, 
      price, 
      stockQuantity, 
      categoryId, 
      imageURL,
      sku,
      brand,
      weight,
      isActive 
    } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (productName) updateData.productName = productName;
    if (description) updateData.description = description;
    if (price) {
      const priceValue = parseFloat(price);
      if (priceValue <= 0) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Price must be greater than 0',
          },
          { status: 400 }
        );
      }
      updateData.price = priceValue;
    }
    if (stockQuantity !== undefined) {
      const stockValue = parseInt(stockQuantity);
      if (stockValue < 0) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Stock quantity cannot be negative',
          },
          { status: 400 }
        );
      }
      updateData.stockQuantity = stockValue;
    }
    if (categoryId) updateData.categoryId = categoryId;
    if (imageURL !== undefined) updateData.imageURL = imageURL;
    if (sku !== undefined) updateData.sku = sku;
    if (brand !== undefined) updateData.brand = brand;
    if (weight !== undefined) {
      if (weight && parseFloat(weight) <= 0) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Weight must be greater than 0',
          },
          { status: 400 }
        );
      }
      updateData.weight = weight ? parseFloat(weight) : null;
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            categoryName: true,
          },
        },
        vendor: {
          select: {
            id: true,
            vendorName: true,
            region: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Soft delete product (set isActive to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
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

    // Soft delete - set isActive to false instead of hard delete
    // This preserves reviews and order history
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Product deactivated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to deactivate product',
      },
      { status: 500 }
    );
  }
}
