import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    // Find vendor
    const vendor = await prisma.vendor.findUnique({
      where: { email: validatedData.email },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, vendor.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create secure session
    await createSession({
      id: vendor.id,
      email: vendor.email,
      name: vendor.name,
      role: 'VENDOR',
    });

    return NextResponse.json(
      { message: "Login successful", user: { id: vendor.id, name: vendor.name, email: vendor.email } },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Vendor login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
