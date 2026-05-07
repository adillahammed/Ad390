import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalEarnings = await prisma.booking.aggregate({
      where: { 
        vendorId: session.id,
        status: 'APPROVED' 
      },
      _sum: { totalPrice: true }
    });

    const activeListingsCount = await prisma.billboard.count({
      where: { 
        vendorId: session.id,
        status: 'APPROVED'
      }
    });

    const pendingBookingsCount = await prisma.booking.count({
      where: { 
        vendorId: session.id,
        status: 'PENDING'
      }
    });

    const monthlyRevenue = await prisma.booking.aggregate({
      where: {
        vendorId: session.id,
        status: 'APPROVED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { totalPrice: true }
    });

    // Simulated stats for most viewed and inquiries
    const stats = {
      totalEarnings: totalEarnings._sum.totalPrice || 0,
      activeListings: activeListingsCount,
      pendingBookings: pendingBookingsCount,
      monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
      mostViewedBillboard: "Mavoor Road LED", // Placeholder
      inquiryCount: 12 // Placeholder
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
