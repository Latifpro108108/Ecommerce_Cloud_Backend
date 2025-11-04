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
      storeDescription,
      storeLogo,
      storeBanner,
      whatsappNumber,
      instagramHandle,
      facebookPage,
      payoutMethod,
      mobileMoneyNetwork,
      mobileMoneyNumber,
      bankName,
      bankAccountName,
      bankAccountNumber,
      deliveryRegions,
      featured,
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
    if (storeDescription !== undefined) updateData.storeDescription = storeDescription;
    if (storeLogo !== undefined) updateData.storeLogo = storeLogo;
    if (storeBanner !== undefined) updateData.storeBanner = storeBanner;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
    if (instagramHandle !== undefined) updateData.instagramHandle = instagramHandle;
    if (facebookPage !== undefined) updateData.facebookPage = facebookPage;
    if (payoutMethod !== undefined) updateData.payoutMethod = payoutMethod;
    if (mobileMoneyNetwork !== undefined) updateData.mobileMoneyNetwork = mobileMoneyNetwork;
    if (mobileMoneyNumber !== undefined) updateData.mobileMoneyNumber = mobileMoneyNumber;
    if (bankName !== undefined) updateData.bankName = bankName;
    if (bankAccountName !== undefined) updateData.bankAccountName = bankAccountName;
    if (bankAccountNumber !== undefined) updateData.bankAccountNumber = bankAccountNumber;
    if (deliveryRegions !== undefined) {
      updateData.deliveryRegions = Array.isArray(deliveryRegions) ? deliveryRegions : [];
    }
    if (featured !== undefined) updateData.featured = featured;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (rating !== undefined) {
      if (rating < 0 || rating > 5) {
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
