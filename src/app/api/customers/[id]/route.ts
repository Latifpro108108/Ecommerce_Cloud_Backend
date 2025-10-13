import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/customers/[id] - Get single customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const customer = await prisma.customer.findUnique({
      where: { id },
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

    if (!customer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: { customer },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch customer',
      },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { firstName, lastName, phoneNumber, region, city, address } = body;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer not found',
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (region) updateData.region = region;
    if (city) updateData.city = city;
    if (address) updateData.address = address;

    const customer = await prisma.customer.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      status: 'success',
      message: 'Customer updated successfully',
      data: { customer },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update customer',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Customer not found',
        },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete customer',
      },
      { status: 500 }
    );
  }
}
