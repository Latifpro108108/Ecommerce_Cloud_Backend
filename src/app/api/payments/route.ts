import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/payments - Get all payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');

    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    const payments = await prisma.payment.findMany({
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
              },
            },
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { payments },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch payments',
      },
      { status: 500 }
    );
  }
}

// POST /api/payments - Process payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      paymentMethod,
      transactionReference,
      fees = 0,
      currency = 'GHS',
    } = body;

    // Validation
    if (!orderId || !paymentMethod) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Order ID and payment method are required',
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

    // Check if payment already exists for this order
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId },
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment already exists for this order',
        },
        { status: 400 }
      );
    }

    // Valid payment methods for Ghana
    const validPaymentMethods = [
      'MTN Mobile Money',
      'Vodafone Cash',
      'AirtelTigo Money',
      'Bank Transfer',
      'Cash on Delivery',
      'Credit Card',
    ];

    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid payment method',
        },
        { status: 400 }
      );
    }

    // Validate fees
    if (fees && parseFloat(fees) < 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Fees cannot be negative',
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: order.totalAmount,
        paymentMethod,
        transactionReference,
        fees: fees ? parseFloat(fees) : 0,
        currency,
        status: 'pending',
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
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Payment initiated successfully',
        data: { payment },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to process payment',
      },
      { status: 500 }
    );
  }
}
