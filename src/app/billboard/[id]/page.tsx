import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowLeft, Maximize, Users, Info, Building2 } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import styles from './page.module.css';
import BookingWidget from './BookingWidget';
import BillboardImagePreview from './BillboardImagePreview';

// Next.js 15+ Params type
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BillboardDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const billboard = await prisma.billboard.findUnique({
    where: { id },
    include: { 
      vendor: true,
      media: true,
    }
  });

  if (!billboard) {
    notFound();
  }

  // Combine main image with media gallery
  const allMedia = [
    { url: billboard.image, type: 'IMAGE' },
    ...billboard.media.map(m => ({ url: m.url, type: m.type }))
  ];

  // Prepare safe data for client components (no Dates)
  const safeBillboard = {
    id: billboard.id,
    title: billboard.title,
    type: billboard.type,
    pricePerDay: billboard.pricePerDay,
    available: billboard.available,
  };

  const tags = billboard.tags ? JSON.parse(billboard.tags) : [];

  return (
    <div className={styles.detailPage}>
      <div className={styles.heroSection}>
        <BillboardImagePreview media={allMedia} title={billboard.title} />
        
        <div className={`container ${styles.heroContent}`}>
          <Link href="/locations" className={`${styles.backBtn} glass`}>
            <ArrowLeft size={20} /> Back to Locations
          </Link>
          
          <div className={styles.headerInfo}>
            <div className={styles.titleSection}>
              <div className={styles.typeTag}>{billboard.type}</div>
              <h1 className={styles.title}>{billboard.title}</h1>
              <p className={styles.location}>
                <MapPin size={20} /> {billboard.location}, {billboard.city}
              </p>
              {billboard.landmark && (
                <p className={styles.landmark}>
                  <Building2 size={16} /> Near {billboard.landmark}
                </p>
              )}
            </div>
            
            <div className={`${styles.priceCard} glass`}>
              <div className={styles.priceHeader}>Base Price per day</div>
              <div className={styles.priceAmount}>
                {formatINR(billboard.pricePerDay)}
              </div>
              <div className={styles.availability}>
                {billboard.available ? (
                  <span className={styles.statusAvailable}>● Accepting Bookings/Bids</span>
                ) : (
                  <span className={styles.statusBooked}>● Currently Unavailable</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`container ${styles.mainContent}`}>
        <div className={styles.leftColumn}>
          <section className={styles.section}>
            <h2>Overview</h2>
            <div className={styles.statsGrid}>
              <div className={`${styles.statBox} glass`}>
                <Users className={styles.statIcon} />
                <div className={styles.statValue}>{(billboard.dailyTraffic / 1000).toFixed(0)}k+</div>
                <div className={styles.statLabel}>Daily Traffic</div>
              </div>
              <div className={`${styles.statBox} glass`}>
                <Maximize className={styles.statIcon} />
                <div className={styles.statValue}>{billboard.size}</div>
                <div className={styles.statLabel}>Dimensions</div>
              </div>
              <div className={`${styles.statBox} glass`}>
                <Info className={styles.statIcon} />
                <div className={styles.statValue}>{billboard.type}</div>
                <div className={styles.statLabel}>Display Type</div>
              </div>
            </div>
            
            <div className={styles.description}>
              {billboard.description ? (
                <div className={styles.fullDescription}>
                  {billboard.description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p>
                  The {billboard.title} is a premium {billboard.type.toLowerCase()} advertising space located in the heart of {billboard.city}. 
                  Positioned exactly at {billboard.location}, this billboard offers unparalleled visibility to a massive daily audience of {billboard.dailyTraffic.toLocaleString()} people.
                  Perfect for brand awareness campaigns, product launches, and high-impact visual storytelling.
                </p>
              )}
            </div>
            
            <div className={styles.tagsContainer}>
              {tags.map((tag: string, i: number) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Location Map</h2>
            <div className={`${styles.mapPlaceholder} glass`}>
              Interactive Map Integration
            </div>
          </section>
        </div>
        
        <div className={styles.rightColumn}>
          <BookingWidget billboard={safeBillboard} />
        </div>
      </div>
    </div>
  );
}
