import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
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
            product: true,
          },
        },
        payment: true,
        shipping: {
          include: {
            courier: true,
          },
        },
      },
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

    return NextResponse.json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch order',
      },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes, discountAmount } = body;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Order not found',
        },
        { status: 404 }
      );
    }

    // Valid order statuses
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid order status',
        },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (discountAmount !== undefined) {
      if (parseFloat(discountAmount) < 0) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Discount amount cannot be negative',
          },
          { status: 400 }
        );
      }
      updateData.discountAmount = parseFloat(discountAmount);
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
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
    });

    return NextResponse.json({
      status: 'success',
      message: 'Order updated successfully',
      data: { order },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update order',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
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

    // Check if order can be cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cannot cancel this order',
        },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    await prisma.order.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to cancel order',
      },
      { status: 500 }
    );
  }
}
