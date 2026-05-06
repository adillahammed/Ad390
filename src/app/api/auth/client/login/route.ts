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

    // Find client
    const client = await prisma.client.findUnique({
      where: { email: validatedData.email },
    });

    if (!client) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, client.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create secure session
    await createSession({
      id: client.id,
      email: client.email,
      name: client.name,
      role: 'CLIENT',
    });

    return NextResponse.json(
      { message: "Login successful", user: { id: client.id, name: client.name, email: client.email } },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Client login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
