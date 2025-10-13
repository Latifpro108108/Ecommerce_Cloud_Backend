import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          take: 8,
          include: {
            vendor: {
              select: {
                vendorName: true,
                isVerified: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch category',
      },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { categoryName, description } = body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Category not found',
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (categoryName) updateData.categoryName = categoryName;
    if (description !== undefined) updateData.description = description;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update category',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Category not found',
        },
        { status: 404 }
      );
    }

    // Check if category has products
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cannot delete category with existing products',
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete category',
      },
      { status: 500 }
    );
  }
}
