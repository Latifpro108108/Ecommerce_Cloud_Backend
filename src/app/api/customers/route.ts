import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET /api/customers - Get all customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        region: true,
        city: true,
        dateJoined: true,
        isActive: true,
      },
      orderBy: {
        dateJoined: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      data: { customers },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch customers',
      },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      region,
      city,
      address,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer with this email or phone number already exists',
        },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phoneNumber,
        password: hashedPassword,
        region: region || 'Greater Accra',
        city: city || 'Accra',
        address: address || '',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        region: true,
        city: true,
        address: true,
        dateJoined: true,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Customer created successfully',
        data: { customer },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create customer',
      },
      { status: 500 }
    );
  }
}
