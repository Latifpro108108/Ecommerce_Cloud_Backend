import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/payments/[id] - Get single payment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const payment = await prisma.payment.findUnique({
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
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: { payment },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch payment',
      },
      { status: 500 }
    );
  }
}

// PUT /api/payments/[id] - Update payment status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, transactionReference } = body;

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment not found',
        },
        { status: 404 }
      );
    }

    // Valid payment statuses
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid payment status',
        },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (transactionReference) updateData.transactionReference = transactionReference;

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
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
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Payment updated successfully',
      data: { payment },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update payment',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/payments/[id] - Cancel payment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if payment exists
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment not found',
        },
        { status: 404 }
      );
    }

    // Check if payment can be cancelled
    if (payment.status === 'completed' || payment.status === 'refunded') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cannot cancel completed or refunded payment',
        },
        { status: 400 }
      );
    }

    // Update payment status to failed (cancelled)
    await prisma.payment.update({
      where: { id },
      data: { status: 'failed' },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Payment cancelled successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to cancel payment',
      },
      { status: 500 }
    );
  }
}
