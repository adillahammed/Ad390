import { prisma } from '@/lib/prisma';
import LocationsList from './LocationsList';

export default async function LocationsPage() {
  const billboards = await prisma.billboard.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Convert tags back to array for the frontend components
  const formattedBillboards = billboards.map(b => ({
    ...b,
    tags: b.tags ? JSON.parse(b.tags) : []
  }));

  return (
    <LocationsList initialBillboards={formattedBillboards} />
  );
}
