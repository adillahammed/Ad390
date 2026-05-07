import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      include: {
        district: true
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
