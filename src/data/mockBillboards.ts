export interface Billboard {
  id: string;
  title: string;
  location: string;
  city: string;
  type: 'Digital' | 'Static' | '3D Digital' | 'Neon';
  size: string;
  dailyTraffic: number;
  pricePerDay: number;
  image: string;
  tags: string[];
  available: boolean;
}

export const mockBillboards: Billboard[] = [
  {
    id: 'b-1',
    title: 'Times Square Megatron',
    location: 'Broadway & 45th St',
    city: 'New York',
    type: '3D Digital',
    size: '80ft x 40ft',
    dailyTraffic: 350000,
    pricePerDay: 5000,
    image: 'https://images.unsplash.com/photo-1555580399-5ee428989182?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['High Visibility', 'Premium', 'Tourist Area'],
    available: true,
  },
  {
    id: 'b-2',
    title: 'Sunset Blvd Panoramic',
    location: 'Sunset Blvd & Vine St',
    city: 'Los Angeles',
    type: 'Digital',
    size: '48ft x 14ft',
    dailyTraffic: 120000,
    pricePerDay: 1200,
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Traffic Jam', 'Entertainment'],
    available: true,
  },
  {
    id: 'b-3',
    title: 'Shibuya Crossing Tower',
    location: 'Shibuya Station Square',
    city: 'Tokyo',
    type: 'Digital',
    size: '60ft x 60ft',
    dailyTraffic: 2500000,
    pricePerDay: 8000,
    image: 'https://images.unsplash.com/photo-1542051812871-34f215f5e277?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Iconic', 'Massive Foot Traffic'],
    available: false,
  },
  {
    id: 'b-4',
    title: 'Piccadilly Lights',
    location: 'Piccadilly Circus',
    city: 'London',
    type: 'Digital',
    size: '100ft x 30ft',
    dailyTraffic: 200000,
    pricePerDay: 4500,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Premium', 'Curved'],
    available: true,
  },
];
