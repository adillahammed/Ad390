import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const districtId = searchParams.get('districtId');

  if (!districtId) {
    return NextResponse.json({ error: 'District ID is required' }, { status: 400 });
  }

  try {
    const places = await prisma.place.findMany({
      where: { districtId },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
