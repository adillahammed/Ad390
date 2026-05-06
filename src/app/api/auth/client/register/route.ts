import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { email: validatedData.email },
    });

    if (existingClient) {
      return NextResponse.json({ error: "Email already registered as a Client" }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create client
    const newClient = await prisma.client.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        company: validatedData.company,
        role: "CLIENT"
      },
    });

    // Create secure session
    await createSession({
      id: newClient.id,
      email: newClient.email,
      name: newClient.name,
      role: 'CLIENT',
    });

    return NextResponse.json(
      { message: "Registration successful", user: { id: newClient.id, name: newClient.name, email: newClient.email } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Client registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
