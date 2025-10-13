import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/couriers - Get all couriers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (region) where.region = region;
    if (isActive !== null) where.isActive = isActive === 'true';

    const couriers = await prisma.courier.findMany({
      where,
      include: {
        _count: {
          select: {
            shipments: true,
          },
        },
      },
      orderBy: {
        courierName: 'asc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { couriers },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch couriers',
      },
      { status: 500 }
    );
  }
}

// POST /api/couriers - Create new courier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courierName, phoneNumber, email, region } = body;

    // Validation
    if (!courierName || !phoneNumber || !region) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Courier name, phone number, and region are required',
        },
        { status: 400 }
      );
    }

    // Check if courier already exists
    const existingCourier = await prisma.courier.findFirst({
      where: {
        OR: [
          { phoneNumber },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingCourier) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Courier with this phone number or email already exists',
        },
        { status: 400 }
      );
    }

    // Valid Ghana regions
    const validRegions = [
      'Greater Accra',
      'Ashanti',
      'Western',
      'Eastern',
      'Central',
      'Northern',
      'Upper East',
      'Upper West',
      'Volta',
      'Brong Ahafo',
      'Western North',
      'Ahafo',
      'Bono East',
      'North East',
      'Savannah',
      'Oti',
    ];

    if (!validRegions.includes(region)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid Ghana region',
        },
        { status: 400 }
      );
    }

    const courier = await prisma.courier.create({
      data: {
        courierName,
        phoneNumber,
        email: email?.toLowerCase(),
        region,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Courier created successfully',
        data: { courier },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create courier',
      },
      { status: 500 }
    );
  }
}
