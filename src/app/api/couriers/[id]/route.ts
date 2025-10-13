import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/couriers/[id] - Get single courier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const courier = await prisma.courier.findUnique({
      where: { id },
      include: {
        shipments: {
          take: 10,
          include: {
            order: {
              select: {
                id: true,
                totalAmount: true,
                customer: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            shippingDate: 'desc',
          },
        },
        _count: {
          select: {
            shipments: true,
          },
        },
      },
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

    return NextResponse.json({
      status: 'success',
      data: { courier },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch courier',
      },
      { status: 500 }
    );
  }
}

// PUT /api/couriers/[id] - Update courier
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { courierName, phoneNumber, email, region, isActive } = body;

    // Check if courier exists
    const existingCourier = await prisma.courier.findUnique({
      where: { id },
    });

    if (!existingCourier) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Courier not found',
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (courierName) updateData.courierName = courierName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email !== undefined) updateData.email = email?.toLowerCase();
    if (region) updateData.region = region;
    if (isActive !== undefined) updateData.isActive = isActive;

    const courier = await prisma.courier.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Courier updated successfully',
      data: { courier },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update courier',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/couriers/[id] - Delete courier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if courier exists
    const courier = await prisma.courier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            shipments: true,
          },
        },
      },
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

    // Check if courier has active shipments
    const activeShipments = await prisma.shipping.count({
      where: {
        courierId: id,
        status: {
          in: ['pending', 'shipped', 'in_transit'],
        },
      },
    });

    if (activeShipments > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cannot delete courier with active shipments',
        },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.courier.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Courier deactivated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete courier',
      },
      { status: 500 }
    );
  }
}
