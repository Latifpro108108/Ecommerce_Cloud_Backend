import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/vendors - Get all vendors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isVerified = searchParams.get('isVerified');
    const region = searchParams.get('region');

    const where: any = {
      isActive: true, // Only show active vendors by default
    };
    if (isVerified !== null) where.isVerified = isVerified === 'true';
    if (region) where.region = region;

    const vendors = await prisma.vendor.findMany({
      where,
      select: {
        id: true,
        vendorName: true,
        email: true,
        phoneNumber: true,
        businessAddress: true,
        region: true,
        city: true,
        businessLicense: true,
        taxId: true,
        joinedDate: true,
        isVerified: true,
        isActive: true,
        rating: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        joinedDate: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { vendors },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch vendors',
      },
      { status: 500 }
    );
  }
}

// POST /api/vendors - Create new vendor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vendorName,
      email,
      phoneNumber,
      businessAddress,
      region,
      city,
      businessLicense,
      taxId,
    } = body;

    // Validation
    if (!vendorName || !email || !phoneNumber || !businessAddress) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingVendor) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Vendor with this email or phone number already exists',
        },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        vendorName,
        email: email.toLowerCase(),
        phoneNumber,
        businessAddress,
        region: region || 'Greater Accra',
        city: city || 'Accra',
        businessLicense,
        taxId,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Vendor created successfully',
        data: { vendor },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create vendor',
      },
      { status: 500 }
    );
  }
}
