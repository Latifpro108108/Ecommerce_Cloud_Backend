import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please provide email/phone and password',
        },
        { status: 400 }
      );
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: normalizedIdentifier },
          { phoneNumber: identifier.trim() },
        ],
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, customer.password);
    if (!passwordValid) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const { password: _pw, ...safeCustomer } = customer;

    return NextResponse.json({
      status: 'success',
      message: 'Login successful',
      data: { customer: safeCustomer },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to login',
      },
      { status: 500 }
    );
  }
}

