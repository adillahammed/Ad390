import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BillboardCard from '@/components/BillboardCard';
import { MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '../../page.module.css';

export default async function PlaceBillboardsPage({ 
  params 
}: { 
  params: Promise<{ districtSlug: string, placeSlug: string }> 
}) {
  const { districtSlug, placeSlug } = await params;

  const district = await prisma.district.findUnique({
    where: { slug: districtSlug }
  });

  if (!district) notFound();

  const place = await prisma.place.findFirst({
    where: { 
      slug: placeSlug,
      districtId: district.id
    }
  });

  if (!place) notFound();

  const billboards = await prisma.billboard.findMany({
    where: {
      districtId: district.id,
      placeId: place.id
    },
    include: {
      district: true,
      place: true
    }
  });

  const formattedBillboards = billboards.map(b => ({
    ...b,
    tags: b.tags ? JSON.parse(b.tags) : []
  }));

  return (
    <div className={styles.locationsPage}>
      <div className={styles.heroBanner}>
        <div className="container">
          <Link href="/locations" className="text-muted flex items-center gap-2 mb-4 hover:text-white transition-colors">
            <ArrowLeft size={16} /> All Kerala Locations
          </Link>
          <h1>{place.name}, <span className="text-gradient">{district.name}</span></h1>
          <p className="text-muted">{billboards.length} premium billboard spots in this area.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {formattedBillboards.map((billboard) => (
            <BillboardCard key={billboard.id} billboard={billboard} />
          ))}
          {formattedBillboards.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No billboards found here yet</h3>
              <p>Check back later or browse other areas in {district.name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
