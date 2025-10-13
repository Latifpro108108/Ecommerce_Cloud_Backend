import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/vendors/[id] - Get single vendor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        products: {
          take: 10,
          where: {
            isActive: true, // Only show active products
          },
          select: {
            id: true,
            productName: true,
            price: true,
            imageURL: true,
            stockQuantity: true,
            sku: true,
            brand: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Vendor not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: { vendor },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch vendor',
      },
      { status: 500 }
    );
  }
}

// PUT /api/vendors/[id] - Update vendor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      vendorName,
      phoneNumber,
      businessAddress,
      region,
      city,
      businessLicense,
      taxId,
      isVerified,
      isActive,
      rating,
    } = body;

    // Check if vendor exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Vendor not found',
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (vendorName) updateData.vendorName = vendorName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (businessAddress) updateData.businessAddress = businessAddress;
    if (region) updateData.region = region;
    if (city) updateData.city = city;
    if (businessLicense !== undefined) updateData.businessLicense = businessLicense;
    if (taxId !== undefined) updateData.taxId = taxId;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (rating !== undefined) {
      if (rating && (rating < 0 || rating > 5)) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Rating must be between 0 and 5',
          },
          { status: 400 }
        );
      }
      updateData.rating = rating;
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Vendor updated successfully',
      data: { vendor },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update vendor',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/vendors/[id] - Deactivate vendor (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Vendor not found',
        },
        { status: 404 }
      );
    }

    // Soft delete - deactivate vendor and their products
    await prisma.$transaction([
      // Deactivate vendor
      prisma.vendor.update({
        where: { id },
        data: { isActive: false },
      }),
      // Deactivate all vendor's products
      prisma.product.updateMany({
        where: { vendorId: id },
        data: { isActive: false },
      }),
    ]);

    return NextResponse.json({
      status: 'success',
      message: 'Vendor deactivated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to deactivate vendor',
      },
      { status: 500 }
    );
  }
}
