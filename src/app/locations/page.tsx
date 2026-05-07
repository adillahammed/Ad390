import { prisma } from '@/lib/prisma';
import LocationsList from './LocationsList';

export const revalidate = 60; // Revalidate every minute

export default async function LocationsPage() {
  const billboards = await prisma.billboard.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      image: true,
      type: true,
      pricePerDay: true,
      location: true,
      city: true,
      dailyTraffic: true,
      size: true,
      tags: true,
      available: true,
      landmark: true,
      // isPremium is a virtual field or comes from tags? 
      // Checking schema... it's not in schema. It might be based on a tag.
    }
  });

  const formattedBillboards = billboards.map(b => ({
    ...b,
    tags: b.tags ? JSON.parse(b.tags) : [],
    isPremium: b.tags?.includes('Premium') || false
  }));

  return (
    <LocationsList initialBillboards={formattedBillboards} />
  );
}
