import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().min(2, "Company name is required"),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if vendor exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { email: validatedData.email },
    });

    if (existingVendor) {
      return NextResponse.json({ error: "Email already registered as a Vendor" }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create vendor
    const newVendor = await prisma.vendor.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        company: validatedData.company,
        phone: validatedData.phone,
        role: "VENDOR"
      },
    });

    // Create secure session
    await createSession({
      id: newVendor.id,
      email: newVendor.email,
      name: newVendor.name,
      role: 'VENDOR',
    });

    return NextResponse.json(
      { message: "Registration successful", user: { id: newVendor.id, name: newVendor.name, email: newVendor.email } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Vendor registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
