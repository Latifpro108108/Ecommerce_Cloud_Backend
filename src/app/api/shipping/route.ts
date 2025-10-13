import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shipping - Get all shipping records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const courierId = searchParams.get('courierId');
    const region = searchParams.get('region');

    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (status) where.status = status;
    if (courierId) where.courierId = courierId;
    if (region) where.region = region;

    const shipments = await prisma.shipping.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        courier: {
          select: {
            id: true,
            courierName: true,
            phoneNumber: true,
            region: true,
          },
        },
      },
      orderBy: {
        shippingDate: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { shipments },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch shipping records',
      },
      { status: 500 }
    );
  }
}

// POST /api/shipping - Create shipping record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      shippingAddress,
      city,
      region,
      postalCode,
      courierId,
    } = body;

    // Validation
    if (!orderId || !shippingAddress || !city || !region || !courierId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Order not found',
        },
        { status: 404 }
      );
    }

    // Verify courier exists
    const courier = await prisma.courier.findUnique({
      where: { id: courierId },
    });

    if (!courier) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Courier not found',
        },
        { status: 404 }
      );
    }

    // Check if shipping already exists for this order
    const existingShipping = await prisma.shipping.findFirst({
      where: { orderId },
    });

    if (existingShipping) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Shipping record already exists for this order',
        },
        { status: 400 }
      );
    }

    const shipping = await prisma.shipping.create({
      data: {
        orderId,
        shippingAddress,
        city,
        region,
        postalCode,
        courierId,
        shippingDate: new Date(),
      },
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        courier: {
          select: {
            courierName: true,
            phoneNumber: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Shipping record created successfully',
        data: { shipping },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create shipping record',
      },
      { status: 500 }
    );
  }
}
