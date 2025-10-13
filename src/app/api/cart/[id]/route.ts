import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cart/[id] - Get cart by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const cart = await prisma.cart.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                price: true,
                imageURL: true,
                stockQuantity: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cart not found',
        },
        { status: 404 }
      );
    }

    // Calculate totals
    const totalItems = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    return NextResponse.json({
      status: 'success',
      data: {
        cart: {
          ...cart,
          totalItems,
          totalAmount,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch cart',
      },
      { status: 500 }
    );
  }
}

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { productId, quantity } = body;

    // Validation
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Product ID and quantity are required',
        },
        { status: 400 }
      );
    }

    // Check if cart exists
    const cart = await prisma.cart.findUnique({
      where: { id },
    });

    if (!cart) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cart not found',
        },
        { status: 404 }
      );
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: id,
        productId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Item not found in cart',
        },
        { status: 404 }
      );
    }

    // Check product stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    if (quantity > product.stockQuantity) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Insufficient stock',
        },
        { status: 400 }
      );
    }

    // Update or remove cart item
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: parseInt(quantity) },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                price: true,
                imageURL: true,
                stockQuantity: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Cart updated successfully',
      data: { cart: updatedCart },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update cart',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Clear cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if cart exists
    const cart = await prisma.cart.findUnique({
      where: { id },
    });

    if (!cart) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cart not found',
        },
        { status: 404 }
      );
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to clear cart',
      },
      { status: 500 }
    );
  }
}
