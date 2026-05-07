import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const districtId = searchParams.get('districtId');
  const placeId = searchParams.get('placeId');

  const where: any = {};
  if (districtId) where.districtId = districtId;
  if (placeId) where.placeId = placeId;

  try {
    const billboards = await prisma.billboard.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        district: true,
        place: true
      }
    });

    const formattedBillboards = billboards.map(b => ({
      ...b,
      tags: b.tags ? JSON.parse(b.tags) : []
    }));

    return NextResponse.json(formattedBillboards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch billboards' }, { status: 500 });
  }
}
