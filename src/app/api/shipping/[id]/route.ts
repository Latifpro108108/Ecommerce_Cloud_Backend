import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shipping/[id] - Get single shipping record
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const shipping = await prisma.shipping.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
            orderItems: {
              include: {
                product: {
                  select: {
                    productName: true,
                    imageURL: true,
                  },
                },
              },
            },
          },
        },
        courier: true,
      },
    });

    if (!shipping) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Shipping record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: { shipping },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch shipping record',
      },
      { status: 500 }
    );
  }
}

// PUT /api/shipping/[id] - Update shipping status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, deliveryDate } = body;

    // Check if shipping record exists
    const existingShipping = await prisma.shipping.findUnique({
      where: { id },
    });

    if (!existingShipping) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Shipping record not found',
        },
        { status: 404 }
      );
    }

    // Valid shipping statuses
    const validStatuses = ['pending', 'shipped', 'in_transit', 'delivered', 'failed'];
    
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid shipping status',
        },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (deliveryDate) updateData.deliveryDate = new Date(deliveryDate);

    // If status is delivered, set delivery date to now if not provided
    if (status === 'delivered' && !deliveryDate) {
      updateData.deliveryDate = new Date();
    }

    const shipping = await prisma.shipping.update({
      where: { id },
      data: updateData,
      include: {
        order: {
          select: {
            id: true,
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

    return NextResponse.json({
      status: 'success',
      message: 'Shipping record updated successfully',
      data: { shipping },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update shipping record',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/shipping/[id] - Cancel shipping
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if shipping record exists
    const shipping = await prisma.shipping.findUnique({
      where: { id },
    });

    if (!shipping) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Shipping record not found',
        },
        { status: 404 }
      );
    }

    // Check if shipping can be cancelled
    if (shipping.status === 'delivered') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cannot cancel delivered shipment',
        },
        { status: 400 }
      );
    }

    // Update shipping status to failed (cancelled)
    await prisma.shipping.update({
      where: { id },
      data: { status: 'failed' },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Shipping cancelled successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to cancel shipping',
      },
      { status: 500 }
    );
  }
}
