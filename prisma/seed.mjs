import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcryptPkg from 'bcryptjs';
const { genSalt, hash } = bcryptPkg;

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Kerala-focused database with realistic visuals and management system data...');

  const salt = await genSalt(10);
  const hashedPassword = await hash('password123', salt);

  // 0. Clear existing data
  console.log('Clearing existing data...');
  await prisma.billboardMedia.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.billboard.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.district.deleteMany({});

  // 1. Create a Vendor
  const vendor = await prisma.vendor.upsert({
    where: { email: 'vendor@adscape.com' },
    update: {},
    create: {
      email: 'vendor@adscape.com',
      password: hashedPassword,
      name: 'Kerala Media Hub',
      company: 'AdScape Kerala Partners',
    },
  });

  // 2. Define Districts and Places
  const keralaData = [
    {
      name: 'Kozhikode',
      slug: 'kozhikode',
      image: '/images/locations/kozhikode.png',
      places: [
        { 
          name: 'Mavoor Road', 
          billboard: { 
            title: 'Mavoor Road LED Mega-Screen', 
            image: '/images/billboards/mavoor-road-led.png', 
            type: 'Digital LED', 
            price: 5500,
            status: 'APPROVED',
            description: 'Massive high-resolution LED screen at the busiest junction in Kozhikode.',
            address: 'Mavoor Road Junction, Near Focus Mall',
            trafficLevel: 'Extreme',
            landmark: 'Near Focus Mall',
            visibilityRating: 5
          } 
        },
        { name: 'Ramanattukara' }, 
        { name: 'Kozhikode Beach' }, 
        { 
          name: 'Hilite Mall Area',
          billboard: {
            title: 'Hilite Mall Premium Digital',
            image: '/images/billboards/mavoor-road-led.png',
            type: 'Digital',
            price: 6000,
            status: 'PENDING',
            description: 'Premium digital hoarding near Hilite Mall entrance.',
            address: 'NH 66 Bypass, Hilite Mall Area',
            trafficLevel: 'High',
            landmark: 'Hilite Mall Entrance',
            visibilityRating: 4
          }
        }
      ]
    },
    {
      name: 'Kochi (Ernakulam)',
      slug: 'kochi',
      image: '/images/locations/kochi.png',
      places: [
        { 
          name: 'MG Road', 
          billboard: { 
            title: 'MG Road Premium Rooftop', 
            image: '/images/billboards/mg-road-premium.png', 
            type: 'Static Unipole', 
            price: 4500,
            status: 'APPROVED',
            description: 'Strategic rooftop placement on MG Road, Kochi.',
            address: 'MG Road, Kochi, Opp. Maharaja\'s College',
            trafficLevel: 'High',
            landmark: 'Opp. Maharaja\'s College',
            visibilityRating: 5
          } 
        },
        { 
          name: 'Marine Drive', 
          billboard: { 
            title: 'Marine Drive Waterfront Unipole', 
            image: '/images/billboards/marine-drive-waterfront.png', 
            type: 'Static', 
            price: 4200,
            status: 'APPROVED',
            description: 'Scenic waterfront unipole at Marine Drive.',
            address: 'Marine Drive Walkway, Kochi',
            trafficLevel: 'Medium',
            landmark: 'Rainbow Bridge',
            visibilityRating: 5
          } 
        },
        { name: 'Edappally' },
        { name: 'Kakkanad' }
      ]
    },
    {
      name: 'Thiruvananthapuram',
      slug: 'thiruvananthapuram',
      image: '/images/locations/trivandrum.png',
      places: [
        { 
          name: 'Technopark', 
          billboard: { 
            title: 'Technopark Tech-Pillar Digital', 
            image: '/images/billboards/technopark-digital.png', 
            type: 'Digital Pillar', 
            price: 4800,
            status: 'APPROVED',
            description: 'Digital pillar at the entrance of Technopark Phase 1.',
            address: 'Technopark Main Entrance, Kazhakkoottam',
            trafficLevel: 'High',
            landmark: 'Main Gate',
            visibilityRating: 5
          } 
        },
        { name: 'Kazhakkoottam' },
        { name: 'Kowdiar' }
      ]
    }
  ];

  for (const districtInfo of keralaData) {
    const district = await prisma.district.upsert({
      where: { slug: districtInfo.slug },
      update: { image: districtInfo.image },
      create: {
        name: districtInfo.name,
        slug: districtInfo.slug,
        image: districtInfo.image,
      }
    });

    console.log(`Updated District: ${district.name}`);

    for (const placeInfo of districtInfo.places) {
      const placeSlug = placeInfo.name.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '');
      const place = await prisma.place.upsert({
        where: { districtId_slug: { districtId: district.id, slug: placeSlug } },
        update: {},
        create: {
          name: placeInfo.name,
          slug: placeSlug,
          districtId: district.id
        }
      });

      if (placeInfo.billboard) {
        const billboard = await prisma.billboard.create({
          data: {
            title: placeInfo.billboard.title,
            description: placeInfo.billboard.description,
            location: placeInfo.name,
            address: placeInfo.billboard.address,
            city: district.name,
            type: placeInfo.billboard.type,
            size: '40ft x 20ft',
            dailyTraffic: 150000,
            pricePerDay: placeInfo.billboard.price,
            image: placeInfo.billboard.image,
            status: placeInfo.billboard.status || 'PENDING',
            landmark: placeInfo.billboard.landmark,
            trafficLevel: placeInfo.billboard.trafficLevel,
            visibilityRating: placeInfo.billboard.visibilityRating,
            tags: JSON.stringify(['High Traffic', 'Premium', 'Commercial Hub']),
            vendorId: vendor.id,
            districtId: district.id,
            placeId: place.id
          }
        });

        // Add some media for each billboard
        await prisma.billboardMedia.create({
          data: {
            url: placeInfo.billboard.image,
            type: 'IMAGE',
            billboardId: billboard.id
          }
        });
      }
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
