import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const billboards = await prisma.billboard.findMany({
      where: { vendorId: session.id },
      include: {
        district: true,
        place: true,
        media: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.error('Error fetching vendor billboards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      title, description, location, address, city, type, size, height, 
      dailyTraffic, pricePerDay, weeklyPrice, monthlyPrice, image, 
      districtId, placeId, landmark, trafficLevel, visibilityRating, 
      audienceType, lighting, media 
    } = body;

    const billboard = await prisma.billboard.create({
      data: {
        title,
        description,
        location,
        address,
        city,
        type,
        size,
        height,
        dailyTraffic: parseInt(dailyTraffic),
        pricePerDay: parseFloat(pricePerDay),
        weeklyPrice: weeklyPrice ? parseFloat(weeklyPrice) : null,
        monthlyPrice: monthlyPrice ? parseFloat(monthlyPrice) : null,
        image,
        tags: JSON.stringify(['High Traffic', 'Commercial']), // Default tags for now
        status: 'PENDING',
        landmark,
        trafficLevel,
        visibilityRating: parseInt(visibilityRating),
        audienceType,
        lighting: !!lighting,
        vendorId: session.id,
        districtId,
        placeId,
        media: {
          create: media?.map((url: string) => ({ url, type: 'IMAGE' })) || []
        }
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('Error creating billboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
