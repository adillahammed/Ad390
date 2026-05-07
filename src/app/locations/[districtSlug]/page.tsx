import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BillboardCard from '@/components/BillboardCard';
import { MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '../page.module.css';

export default async function DistrictBillboardsPage({ 
  params 
}: { 
  params: Promise<{ districtSlug: string }> 
}) {
  const { districtSlug } = await params;

  const district = await prisma.district.findUnique({
    where: { slug: districtSlug },
    include: {
      places: {
        include: {
          _count: {
            select: { billboards: true }
          }
        }
      }
    }
  });

  if (!district) notFound();

  const billboards = await prisma.billboard.findMany({
    where: {
      districtId: district.id
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
          <h1>Advertising in <span className="text-gradient">{district.name}</span></h1>
          <p className="text-muted">Browse {billboards.length} premium spots across {district.places.length} areas.</p>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {district.places.map(place => (
              <Link 
                key={place.id}
                href={`/locations/${district.slug}/${place.slug}`}
                className="glass px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition-all"
              >
                {place.name} ({place._count.billboards})
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {formattedBillboards.map((billboard) => (
            <BillboardCard key={billboard.id} billboard={billboard} />
          ))}
          {formattedBillboards.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No billboards found in {district.name} yet</h3>
              <p>Try searching in another district or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
