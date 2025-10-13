import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
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
        payment: true,
        shipping: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerId, 
      orderItems, 
      totalAmount, 
      discountAmount = 0,
      notes,
      currency = 'GHS' 
    } = body;

    // Validation
    if (!customerId || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer ID and order items are required',
        },
        { status: 400 }
      );
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer not found',
        },
        { status: 404 }
      );
    }

    // Generate unique order number
    const orderCount = await prisma.order.count();
    const orderNumber = `GM-${new Date().getFullYear()}-${String(orderCount + 1).padStart(6, '0')}`;

    // Validate total amount
    if (parseFloat(totalAmount) <= 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Total amount must be greater than 0',
        },
        { status: 400 }
      );
    }

    // Validate discount amount
    if (discountAmount && parseFloat(discountAmount) < 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Discount amount cannot be negative',
        },
        { status: 400 }
      );
    }

    // Create order with order items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        totalAmount: parseFloat(totalAmount),
        discountAmount: discountAmount ? parseFloat(discountAmount) : 0,
        notes,
        currency,
        orderItems: {
          create: orderItems.map((item: any) => {
            // Validate item quantities
            if (parseInt(item.quantity) <= 0) {
              throw new Error('Item quantity must be greater than 0');
            }
            if (parseFloat(item.unitPrice) <= 0) {
              throw new Error('Item unit price must be greater than 0');
            }
            return {
              productId: item.productId,
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
              subtotal: parseFloat(item.subtotal),
            };
          }),
        },
      },
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

    return NextResponse.json(
      {
        status: 'success',
        message: 'Order created successfully',
        data: { order },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
