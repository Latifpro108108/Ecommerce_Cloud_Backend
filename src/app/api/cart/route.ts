import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cart - Get cart by customer ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer ID is required',
        },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { customerId },
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

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId },
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

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, productId, quantity } = body;

    // Validation
    if (!customerId || !productId || !quantity) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer ID, product ID, and quantity are required',
        },
        { status: 400 }
      );
    }

    // Verify product exists
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

    // Check stock availability
    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Insufficient stock',
        },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { customerId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId },
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + parseInt(quantity);
      
      if (product.stockQuantity < newQuantity) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Insufficient stock for requested quantity',
          },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: parseInt(quantity),
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
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
      message: 'Item added to cart successfully',
      data: { cart: updatedCart },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to add item to cart',
      },
      { status: 500 }
    );
  }
}
