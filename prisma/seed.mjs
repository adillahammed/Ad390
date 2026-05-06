import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcryptPkg from 'bcryptjs';
const { genSalt, hash } = bcryptPkg;

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const salt = await genSalt(10);
  const hashedPassword = await hash('password123', salt);

  // 1. Create a Vendor
  const vendor = await prisma.vendor.upsert({
    where: { email: 'vendor@adscape.com' },
    update: {},
    create: {
      email: 'vendor@adscape.com',
      password: hashedPassword,
      name: 'John Media',
      company: 'AdScape Partners',
    },
  });

  console.log(`Created vendor: ${vendor.email}`);

  // 2. Create Billboards
  const billboards = [
    {
      title: 'Times Square Megatron',
      location: 'Broadway & 45th St',
      city: 'New York',
      type: '3D Digital',
      size: '80ft x 40ft',
      dailyTraffic: 350000,
      pricePerDay: 5000,
      image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80',
      tags: JSON.stringify(['High Visibility', 'Premium', 'Tourist Area']),
      vendorId: vendor.id,
    },
    {
      title: 'Highway 101 Dominator',
      location: 'Silicon Valley Corridor',
      city: 'San Francisco',
      type: 'Digital LED',
      size: '48ft x 14ft',
      dailyTraffic: 250000,
      pricePerDay: 1200,
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Tech Hub', 'Commuter Route', 'High ROI']),
      vendorId: vendor.id,
    }
  ];

  for (const bb of billboards) {
    const existing = await prisma.billboard.findFirst({ where: { title: bb.title } });
    if (!existing) {
      await prisma.billboard.create({ data: bb });
      console.log(`Created billboard: ${bb.title}`);
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
