import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      include: {
        _count: {
          select: { billboards: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(districts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch districts' }, { status: 500 });
  }
}
