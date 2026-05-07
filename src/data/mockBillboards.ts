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
  isPremium?: boolean;
  landmark?: string;
}

export const mockBillboards: Billboard[] = [
  {
    id: 'b-1',
    title: 'Mavoor Road LED Mega-Screen',
    location: 'Mavoor Road Junction',
    city: 'Kozhikode',
    type: 'Digital',
    size: '40ft x 20ft',
    dailyTraffic: 180000,
    pricePerDay: 5500,
    image: '/images/billboards/mavoor-road-led.png',
    tags: ['High Traffic', 'Premium', 'Commercial Hub'],
    available: true,
    isPremium: true,
    landmark: 'Near Focus Mall',
  },
  {
    id: 'b-2',
    title: 'MG Road Premium Rooftop',
    location: 'MG Road',
    city: 'Kochi',
    type: 'Static',
    size: '60ft x 20ft',
    dailyTraffic: 220000,
    pricePerDay: 4500,
    image: '/images/billboards/mg-road-premium.png',
    tags: ['Business District', 'Shopping Hub'],
    available: true,
    isPremium: true,
    landmark: 'Near Maharaja\'s College',
  },
  {
    id: 'b-3',
    title: 'Technopark Tech-Pillar Digital',
    location: 'Technopark Phase 1',
    city: 'Thiruvananthapuram',
    type: 'Digital',
    size: '30ft x 15ft',
    dailyTraffic: 95000,
    pricePerDay: 4800,
    image: '/images/billboards/technopark-digital.png',
    tags: ['IT Hub', 'Corporate Audience'],
    available: true,
    isPremium: true,
    landmark: 'Main Entrance',
  },
  {
    id: 'b-4',
    title: 'Marine Drive Sunset Unipole',
    location: 'Marine Drive Walkway',
    city: 'Kochi',
    type: 'Static',
    size: '40ft x 20ft',
    dailyTraffic: 140000,
    pricePerDay: 4200,
    image: '/images/billboards/marine-drive-waterfront.png',
    tags: ['Scenic View', 'Tourist Spot'],
    available: true,
    isPremium: true,
    landmark: 'Near Rainbow Bridge',
  },
];
