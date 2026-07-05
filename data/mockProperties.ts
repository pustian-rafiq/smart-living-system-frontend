import type { Property } from '@/types/property'

const baseProperties: Property[] = [
  {
    id: '1',
    ownerId: 'owner1',
    name: 'Green Valley Mess',
    type: 'mess',
    rent: 3500,
    area: 'Mirpur-10',
    address: 'House 45, Road 7, Block C',
    city: 'Dhaka',
    latitude: 23.8067,
    longitude: 90.3683,
    available: true,
    gender: 'male',
    seatType: 'shared',
    mealIncluded: true,
    mealPlan: 'all',
    mealCost: 2000,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ],
    videoThumbnail:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    facilities: ['WiFi', 'AC', 'Generator', 'Security', 'Parking'],
    nearbyFacilities: ['Bus Stop', 'University', 'Hospital'],
    buildingAge: 5,
    floorLevel: 2,
    furnishing: 'furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-01-20',
    description:
      'Clean and spacious mess with modern amenities. Perfect for students and working professionals.',
    ownerName: 'Abdul Karim',
    ownerPhone: '+8801712345678',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    ownerId: 'owner2',
    name: 'Sunshine Apartment',
    type: 'apartment',
    rent: 15000,
    area: 'Uttara',
    address: 'Flat 4B, Building 12, Sector 7',
    city: 'Dhaka',
    latitude: 23.8744,
    longitude: 90.3904,
    available: true,
    gender: null,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    ],
    videoThumbnail:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    facilities: ['WiFi', 'AC', 'Lift', 'Security', 'Parking', 'Balcony'],
    nearbyFacilities: ['Metro Station', 'Shopping Mall', 'School'],
    buildingAge: 8,
    floorLevel: 4,
    furnishing: 'semi-furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-01-25',
    description:
      '2 BHK apartment in prime location. Well-maintained building with all modern facilities.',
    ownerName: 'Fatima Begum',
    ownerPhone: '+8801712345679',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    ownerId: 'owner3',
    name: 'Student Hub Mess',
    type: 'mess',
    rent: 3200,
    area: 'Dhanmondi',
    address: 'House 23, Road 27',
    city: 'Dhaka',
    latitude: 23.7465,
    longitude: 90.376,
    available: true,
    gender: 'male',
    seatType: 'single',
    mealIncluded: true,
    mealPlan: 'lunch',
    mealCost: 1500,
    images: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    facilities: ['WiFi', 'Generator', 'Security', 'Common Kitchen'],
    nearbyFacilities: ['University', 'Bus Stop'],
    buildingAge: 10,
    floorLevel: 1,
    furnishing: 'furnished',
    parking: false,
    security: true,
    verified: false,
    verificationStatus: 'pending',
    description:
      'Affordable mess for students. Close to universities and public transport.',
    ownerName: 'Rashid Ahmed',
    ownerPhone: '+8801712345680',
    createdAt: '2024-01-18',
  },
  {
    id: '4',
    ownerId: 'owner4',
    name: 'Ladies Hostel',
    type: 'hostel',
    rent: 4000,
    area: 'Mohammadpur',
    address: 'House 12, Road 8, Block A',
    city: 'Dhaka',
    latitude: 23.7639,
    longitude: 90.36,
    available: true,
    gender: 'female',
    seatType: 'shared',
    mealIncluded: false,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800',
    ],
    facilities: ['WiFi', 'AC', 'Generator', 'Security', 'CCTV', 'Common Room'],
    nearbyFacilities: ['University', 'Hospital', 'Shopping Mall'],
    buildingAge: 3,
    floorLevel: 3,
    furnishing: 'furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-01-25',
    description:
      'Safe and secure ladies hostel with 24/7 security. All modern amenities available.',
    ownerName: 'Nazma Khatun',
    ownerPhone: '+8801712345681',
    createdAt: '2024-01-22',
  },
  {
    id: '5',
    ownerId: 'owner5',
    name: 'Modern Flat',
    type: 'apartment',
    rent: 18000,
    area: 'Bashundhara',
    address: 'Flat 8A, Tower 3, Block B',
    city: 'Dhaka',
    latitude: 23.8162,
    longitude: 90.4254,
    available: false,
    gender: null,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ],
    videoThumbnail:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    facilities: [
      'WiFi',
      'AC',
      'Lift',
      'Security',
      'Parking',
      'Gym',
      'Swimming Pool',
    ],
    nearbyFacilities: ['Metro Station', 'Hospital', 'University'],
    buildingAge: 2,
    floorLevel: 8,
    furnishing: 'furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-01-12',
    description:
      'Luxury 3 BHK apartment in high-rise building. Premium location with all amenities.',
    ownerName: 'Kamal Hossain',
    ownerPhone: '+8801712345682',
    createdAt: '2024-01-10',
  },
  {
    id: '6',
    ownerId: 'owner6',
    name: 'Budget Mess',
    type: 'mess',
    rent: 2800,
    area: 'Mirpur-1',
    address: 'House 8, Road 3',
    city: 'Dhaka',
    latitude: 23.8053,
    longitude: 90.3644,
    available: true,
    gender: 'mixed',
    seatType: 'shared',
    mealIncluded: false,
    images: ['https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800'],
    facilities: ['WiFi', 'Security'],
    nearbyFacilities: ['Bus Stop'],
    buildingAge: 15,
    floorLevel: 1,
    furnishing: 'unfurnished',
    parking: false,
    security: true,
    verified: false,
    verificationStatus: 'unverified',
    description:
      'Budget-friendly mess for students. Basic amenities available.',
    ownerName: 'Hasan Ali',
    ownerPhone: '+8801712345683',
    createdAt: '2024-01-25',
  },
  {
    id: '7',
    ownerId: 'owner7',
    name: 'Family Apartment',
    type: 'apartment',
    rent: 12000,
    area: 'Gulshan',
    address: 'Flat 5C, Building 20, Road 45',
    city: 'Dhaka',
    latitude: 23.7949,
    longitude: 90.4034,
    available: true,
    gender: null,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    facilities: ['WiFi', 'AC', 'Lift', 'Security', 'Parking', 'Playground'],
    nearbyFacilities: ['School', 'Park', 'Shopping Mall'],
    buildingAge: 12,
    floorLevel: 2,
    furnishing: 'semi-furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-01-15',
    description:
      'Spacious 2 BHK apartment perfect for families. Quiet neighborhood with good schools nearby.',
    ownerName: 'Rahman Mia',
    ownerPhone: '+8801712345684',
    createdAt: '2024-01-12',
  },
  {
    id: '8',
    ownerId: 'owner8',
    name: 'Executive Mess',
    type: 'mess',
    rent: 4500,
    area: 'Banani',
    address: 'House 30, Road 11',
    city: 'Dhaka',
    latitude: 23.7949,
    longitude: 90.4034,
    available: true,
    gender: 'male',
    seatType: 'single',
    mealIncluded: true,
    mealPlan: 'all',
    mealCost: 2500,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800',
    ],
    facilities: [
      'WiFi',
      'AC',
      'Generator',
      'Security',
      'Parking',
      'Gym',
      'Laundry',
    ],
    nearbyFacilities: ['Metro Station', 'Office Area', 'Restaurant'],
    buildingAge: 4,
    floorLevel: 2,
    furnishing: 'furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-01-30',
    description:
      'Premium mess for working professionals. All modern facilities with excellent service.',
    ownerName: 'Iqbal Hossain',
    ownerPhone: '+8801712345685',
    createdAt: '2024-01-28',
  },
  {
    id: '9',
    ownerId: 'owner9',
    name: 'Cozy Hostel',
    type: 'hostel',
    rent: 3800,
    area: 'Wari',
    address: 'House 15, Road 5',
    city: 'Dhaka',
    latitude: 23.7104,
    longitude: 90.4074,
    available: true,
    gender: 'male',
    seatType: 'single',
    mealIncluded: false,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    facilities: ['WiFi', 'AC', 'Security', 'Common Room'],
    nearbyFacilities: ['University', 'Bus Stop', 'Market'],
    buildingAge: 6,
    floorLevel: 2,
    furnishing: 'furnished',
    parking: false,
    security: true,
    verified: false,
    verificationStatus: 'pending',
    description:
      'Comfortable hostel for students. Clean rooms and friendly environment.',
    ownerName: 'Rafiqul Islam',
    ownerPhone: '+8801712345686',
    createdAt: '2024-02-01',
  },
  {
    id: '10',
    ownerId: 'owner10',
    name: 'Luxury Apartment',
    type: 'apartment',
    rent: 25000,
    area: 'Gulshan-2',
    address: 'Flat 12A, Tower 5, Road 90',
    city: 'Dhaka',
    latitude: 23.7949,
    longitude: 90.4034,
    available: true,
    gender: null,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    facilities: [
      'WiFi',
      'AC',
      'Lift',
      'Security',
      'Parking',
      'Gym',
      'Swimming Pool',
      'Rooftop Garden',
    ],
    nearbyFacilities: ['Metro Station', 'Shopping Mall', 'Hospital', 'School'],
    buildingAge: 1,
    floorLevel: 12,
    furnishing: 'furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-02-08',
    description:
      'Premium 4 BHK apartment with stunning city views. All luxury amenities included.',
    ownerName: 'Shahid Khan',
    ownerPhone: '+8801712345687',
    createdAt: '2024-02-05',
  },
  {
    id: '11',
    ownerId: 'owner11',
    name: 'Comfort Hostel',
    type: 'hostel',
    rent: 3600,
    area: 'Tejgaon',
    address: 'House 22, Road 8',
    city: 'Dhaka',
    latitude: 23.7596,
    longitude: 90.3885,
    available: true,
    gender: 'female',
    seatType: 'shared',
    mealIncluded: true,
    mealPlan: 'breakfast',
    mealCost: 1000,
    images: ['https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800'],
    facilities: ['WiFi', 'AC', 'Security', 'Common Kitchen'],
    nearbyFacilities: ['Office Area', 'Bus Stop', 'Market'],
    buildingAge: 7,
    floorLevel: 1,
    furnishing: 'furnished',
    parking: true,
    security: true,
    verified: false,
    verificationStatus: 'pending',
    description:
      'Safe and comfortable hostel for working women. Close to business district.',
    ownerName: 'Salma Begum',
    ownerPhone: '+8801712345688',
    createdAt: '2024-02-08',
  },
  {
    id: '12',
    ownerId: 'owner12',
    name: 'Budget Apartment',
    type: 'apartment',
    rent: 10000,
    area: 'Rampura',
    address: 'Flat 3B, Building 8, Road 2',
    city: 'Dhaka',
    latitude: 23.7639,
    longitude: 90.4254,
    available: true,
    gender: null,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    facilities: ['WiFi', 'AC', 'Security'],
    nearbyFacilities: ['Bus Stop', 'Market'],
    buildingAge: 20,
    floorLevel: 3,
    furnishing: 'unfurnished',
    parking: false,
    security: true,
    verified: false,
    verificationStatus: 'unverified',
    description:
      'Affordable 1 BHK apartment. Perfect for small families or working professionals.',
    ownerName: 'Mizanur Rahman',
    ownerPhone: '+8801712345689',
    createdAt: '2024-02-10',
  },
  {
    id: '13',
    ownerId: 'owner13',
    name: 'Premium Mess',
    type: 'mess',
    rent: 5000,
    area: 'Dhanmondi',
    address: 'House 50, Road 15',
    city: 'Dhaka',
    latitude: 23.7465,
    longitude: 90.376,
    available: true,
    gender: 'male',
    seatType: 'single',
    mealIncluded: true,
    mealPlan: 'all',
    mealCost: 3000,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    facilities: [
      'WiFi',
      'AC',
      'Generator',
      'Security',
      'Parking',
      'Gym',
      'Laundry',
      'Study Room',
    ],
    nearbyFacilities: ['University', 'Hospital', 'Metro Station'],
    buildingAge: 3,
    floorLevel: 3,
    furnishing: 'furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-02-15',
    description:
      'Premium mess with all facilities. Best for serious students and professionals.',
    ownerName: 'Tariqul Islam',
    ownerPhone: '+8801712345690',
    createdAt: '2024-02-12',
  },
  {
    id: '14',
    ownerId: 'owner14',
    name: 'Spacious Apartment',
    type: 'apartment',
    rent: 20000,
    area: 'Banani',
    address: 'Flat 6C, Building 25, Road 11',
    city: 'Dhaka',
    latitude: 23.7949,
    longitude: 90.4034,
    available: true,
    gender: null,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    facilities: ['WiFi', 'AC', 'Lift', 'Security', 'Parking', 'Gym'],
    nearbyFacilities: ['Metro Station', 'Shopping Mall', 'Office Area'],
    buildingAge: 5,
    floorLevel: 6,
    furnishing: 'semi-furnished',
    parking: true,
    security: true,
    verified: true,
    verificationStatus: 'verified',
    verifiedAt: '2024-02-18',
    description:
      'Spacious 3 BHK apartment in prime Banani location. Modern building with all amenities.',
    ownerName: 'Nazrul Islam',
    ownerPhone: '+8801712345691',
    createdAt: '2024-02-15',
  },
  {
    id: '15',
    ownerId: 'owner15',
    name: 'Student Hostel',
    type: 'hostel',
    rent: 3400,
    area: 'Farmgate',
    address: 'House 18, Road 3',
    city: 'Dhaka',
    latitude: 23.7596,
    longitude: 90.3885,
    available: true,
    gender: 'male',
    seatType: 'shared',
    mealIncluded: false,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    facilities: ['WiFi', 'AC', 'Security', 'Common Room'],
    nearbyFacilities: ['University', 'Bus Stop', 'Market'],
    buildingAge: 8,
    floorLevel: 2,
    furnishing: 'furnished',
    parking: false,
    security: true,
    verified: false,
    verificationStatus: 'unverified',
    description:
      'Student-friendly hostel near universities. Affordable and convenient location.',
    ownerName: 'Karim Uddin',
    ownerPhone: '+8801712345692',
    createdAt: '2024-02-18',
  },
]



function enrichProperty(p: Property): Property {
  const depositMonths = p.depositMonths ?? (p.type === 'apartment' ? 2 : 1)
  return {
    ...p,
    ownerId: p.ownerId || `owner${p.id}`,
    depositMonths,
    instantBook: p.instantBook ?? Boolean(p.verified && p.available),
    published: p.published ?? true,
    listingStatus: p.listingStatus ?? 'published',
    updatedAt: p.updatedAt ?? p.createdAt,
  }
}

export let mockProperties: Property[] = baseProperties.map(enrichProperty)

export function syncPropertyRatings(
  ratings: Record<string, { rating: number; reviewCount: number }>
): void {
  mockProperties = mockProperties.map(p => {
    const r = ratings[p.id]
    if (!r) return p
    return { ...p, rating: r.rating, reviewCount: r.reviewCount }
  })
}

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find(p => p.id === id)
}

export function getPropertiesByOwner(ownerId: string): Property[] {
  return mockProperties.filter(p => p.ownerId === ownerId)
}

export function getPublishedProperties(): Property[] {
  return mockProperties.filter(
    p => p.published !== false && p.listingStatus !== 'draft' && p.listingStatus !== 'paused'
  )
}

export function addProperty(property: Property): Property {
  mockProperties = [property, ...mockProperties]
  return property
}

export function updateProperty(
  id: string,
  patch: Partial<Property>
): Property | null {
  const idx = mockProperties.findIndex(p => p.id === id)
  if (idx === -1) return null
  const updated = {
    ...mockProperties[idx],
    ...patch,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  mockProperties = [
    ...mockProperties.slice(0, idx),
    updated,
    ...mockProperties.slice(idx + 1),
  ]
  return updated
}

// Helper function to get unique cities
export function getCities(): string[] {
  return Array.from(new Set(mockProperties.map(p => p.city))).sort()
}

// Helper function to get areas by city
export function getAreasByCity(city: string): string[] {
  return Array.from(
    new Set(mockProperties.filter(p => p.city === city).map(p => p.area))
  ).sort()
}

// Helper function to get all nearby facilities
export function getAllNearbyFacilities(): string[] {
  const facilities = new Set<string>()
  mockProperties.forEach(p => {
    p.nearbyFacilities?.forEach(f => facilities.add(f))
  })
  return Array.from(facilities).sort()
}
