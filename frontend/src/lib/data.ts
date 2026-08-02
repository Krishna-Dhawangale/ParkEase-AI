// Mock data for ParkEase AI

export const mockParkingFacilities = [
  {
    id: 'p1',
    name: 'Central Metro Parking Hub',
    address: 'Near Central Station, MG Road',
    distance: 0.3,
    walkTime: 4,
    price: 60,
    priceUnit: 'hr',
    available: 47,
    total: 120,
    rating: 4.8,
    reviews: 2341,
    security: 5,
    aiRecommended: true,
    greenScore: 92,
    hasEV: true,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=220&fit=crop',
    amenities: ['CCTV', 'EV Charging', 'Covered', 'Valet'],
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: 'p2',
    name: 'Tech Park Multi-Level',
    address: 'Outer Ring Road, Whitefield',
    distance: 0.8,
    walkTime: 10,
    price: 40,
    priceUnit: 'hr',
    available: 23,
    total: 200,
    rating: 4.5,
    reviews: 1876,
    security: 4,
    aiRecommended: false,
    greenScore: 78,
    hasEV: true,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=220&fit=crop',
    amenities: ['CCTV', 'EV Charging', 'Open Air'],
    coordinates: { lat: 12.9698, lng: 77.7500 },
  },
  {
    id: 'p3',
    name: 'Airport Express Parking',
    address: 'Kempegowda International Airport',
    distance: 1.2,
    walkTime: 15,
    price: 120,
    priceUnit: 'hr',
    available: 89,
    total: 500,
    rating: 4.9,
    reviews: 5621,
    security: 5,
    aiRecommended: false,
    greenScore: 88,
    hasEV: true,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1597079910443-60c43fc4a729?w=400&h=220&fit=crop',
    amenities: ['CCTV', 'EV Charging', 'Covered', 'Shuttle'],
    coordinates: { lat: 13.1986, lng: 77.7066 },
  },
];

export const mockRecentBookings = [
  { id: 'PE7X2A1', vehicle: 'KA 05 MN 4521', slot: 'A-12', parking: 'Central Metro Hub', time: '09:30 AM', duration: '2h', status: 'active', amount: 120 },
  { id: 'PE9B3C2', vehicle: 'KA 01 AB 1234', slot: 'B-07', parking: 'Tech Park Multi-Level', time: '08:00 AM', duration: '3h', status: 'completed', amount: 120 },
  { id: 'PE2D4E3', vehicle: 'MH 12 XY 5678', slot: 'C-22', parking: 'Airport Express', time: '06:00 PM', duration: '5h', status: 'upcoming', amount: 600 },
  { id: 'PE5F6G4', vehicle: 'TN 09 PQ 9012', slot: 'A-04', parking: 'Central Metro Hub', time: '11:30 AM', duration: '1h', status: 'completed', amount: 60 },
  { id: 'PE8H7I5', vehicle: 'DL 03 RS 3456', slot: 'D-15', parking: 'Tech Park Multi-Level', time: '02:00 PM', duration: '4h', status: 'cancelled', amount: 160 },
];

export const mockLiveActivity = [
  { id: 1, type: 'entry', vehicle: 'KA 05 MN 4521', slot: 'A-12', time: '2 min ago', icon: '🚗' },
  { id: 2, type: 'exit', vehicle: 'MH 02 AB 9876', slot: 'B-03', time: '5 min ago', icon: '🚙' },
  { id: 3, type: 'reserved', vehicle: 'DL 01 XY 1234', slot: 'C-08', time: '8 min ago', icon: '📅' },
  { id: 4, type: 'entry', vehicle: 'TN 07 PQ 5678', slot: 'A-19', time: '12 min ago', icon: '🚗' },
  { id: 5, type: 'payment', vehicle: 'KA 01 RS 3456', slot: 'B-11', time: '15 min ago', icon: '💳' },
  { id: 6, type: 'exit', vehicle: 'GJ 05 MN 7890', slot: 'D-02', time: '18 min ago', icon: '🚙' },
];

export const mockOccupancyData = [
  { time: '6 AM', occupancy: 15, revenue: 900 },
  { time: '7 AM', occupancy: 32, revenue: 1920 },
  { time: '8 AM', occupancy: 68, revenue: 4080 },
  { time: '9 AM', occupancy: 87, revenue: 5220 },
  { time: '10 AM', occupancy: 76, revenue: 4560 },
  { time: '11 AM', occupancy: 82, revenue: 4920 },
  { time: '12 PM', occupancy: 91, revenue: 5460 },
  { time: '1 PM', occupancy: 88, revenue: 5280 },
  { time: '2 PM', occupancy: 73, revenue: 4380 },
  { time: '3 PM', occupancy: 69, revenue: 4140 },
  { time: '4 PM', occupancy: 78, revenue: 4680 },
  { time: '5 PM', occupancy: 94, revenue: 5640 },
  { time: '6 PM', occupancy: 89, revenue: 5340 },
  { time: '7 PM', occupancy: 71, revenue: 4260 },
  { time: '8 PM', occupancy: 54, revenue: 3240 },
  { time: '9 PM', occupancy: 38, revenue: 2280 },
  { time: '10 PM', occupancy: 21, revenue: 1260 },
];

export const mockRevenueTrend = [
  { month: 'Jan', revenue: 284000, bookings: 4720 },
  { month: 'Feb', revenue: 312000, bookings: 5200 },
  { month: 'Mar', revenue: 298000, bookings: 4967 },
  { month: 'Apr', revenue: 341000, bookings: 5683 },
  { month: 'May', revenue: 378000, bookings: 6300 },
  { month: 'Jun', revenue: 421000, bookings: 7017 },
  { month: 'Jul', revenue: 389000, bookings: 6483 },
];

export const mockAIInsights = [
  {
    id: 1,
    type: 'prediction',
    title: 'Peak occupancy alert',
    message: 'Occupancy expected to reach 94% by 6 PM today based on historical patterns and live traffic.',
    confidence: 92,
    impact: 'high',
    icon: 'TrendingUp',
    color: 'amber',
  },
  {
    id: 2,
    type: 'opportunity',
    title: 'Weekend demand surge',
    message: 'Weekend bookings increased by 18% compared to last month. Consider dynamic pricing.',
    confidence: 87,
    impact: 'medium',
    icon: 'BarChart3',
    color: 'brand',
  },
  {
    id: 3,
    type: 'optimization',
    title: 'Underutilized floor detected',
    message: 'Floor 3 utilization is only 34%. Redirect signage from entry gate can improve by 28%.',
    confidence: 94,
    impact: 'medium',
    icon: 'Layers',
    color: 'info',
  },
  {
    id: 4,
    type: 'improvement',
    title: 'Search time reduced',
    message: 'AI slot recommendations have reduced average search time by 42% this week.',
    confidence: 98,
    impact: 'high',
    icon: 'Zap',
    color: 'success',
  },
  {
    id: 5,
    type: 'revenue',
    title: 'Revenue growth detected',
    message: 'Revenue increased by 11% this month. EV charging slots contributing ₹18,000 additional.',
    confidence: 96,
    impact: 'high',
    icon: 'IndianRupee',
    color: 'success',
  },
  {
    id: 6,
    type: 'maintenance',
    title: 'Maintenance window optimal',
    message: 'Best maintenance window: Tuesday 2–4 AM. Only 3% historical occupancy during this slot.',
    confidence: 89,
    impact: 'low',
    icon: 'Wrench',
    color: 'secondary',
  },
];

export const mockNotifications = [
  { id: 1, type: 'booking', title: 'Booking Confirmed', message: 'Your booking PE7X2A1 at Central Metro Hub is confirmed.', time: '2 min ago', read: false, icon: 'CheckCircle', color: 'success' },
  { id: 2, type: 'payment', title: 'Payment Successful', message: '₹120 paid successfully via UPI for slot A-12.', time: '10 min ago', read: false, icon: 'CreditCard', color: 'brand' },
  { id: 3, type: 'vehicle', title: 'Vehicle Entered', message: 'KA 05 MN 4521 entered Central Metro Hub.', time: '12 min ago', read: false, icon: 'Car', color: 'info' },
  { id: 4, type: 'reminder', title: 'Parking Reminder', message: 'Your booking expires in 30 minutes. Extend?', time: '28 min ago', read: true, icon: 'Clock', color: 'amber' },
  { id: 5, type: 'exit', title: 'Vehicle Exited', message: 'MH 02 AB 9876 exited. Receipt generated.', time: '1h ago', read: true, icon: 'LogOut', color: 'secondary' },
  { id: 6, type: 'alert', title: 'Conflict Detected', message: 'Slot C-15 has a double-booking conflict. Resolved automatically.', time: '2h ago', read: true, icon: 'AlertTriangle', color: 'danger' },
  { id: 7, type: 'receipt', title: 'Receipt Generated', message: 'Download your receipt for booking PE9B3C2.', time: '3h ago', read: true, icon: 'FileText', color: 'brand' },
];

export const mockVehicleTypes = [
  { name: 'Sedan', count: 1840, percentage: 38 },
  { name: 'SUV', count: 1456, percentage: 30 },
  { name: 'Hatchback', count: 972, percentage: 20 },
  { name: 'EV', count: 436, percentage: 9 },
  { name: 'Others', count: 145, percentage: 3 },
];

export const mockAdminStats = {
  totalSlots: 500,
  available: 143,
  occupied: 312,
  reserved: 34,
  maintenance: 11,
  todayRevenue: 48720,
  todayBookings: 812,
  avgParkingTime: 2.4,
  aiAccuracy: 96.2,
  healthScore: 94,
  evCharging: 8,
  cameras: 24,
  barriers: 4,
};

export const mockFloors = [
  {
    id: 1,
    name: 'Ground Floor',
    slots: generateFloorSlots(1, 40),
  },
  {
    id: 2,
    name: 'Floor 1',
    slots: generateFloorSlots(2, 40),
  },
  {
    id: 3,
    name: 'Floor 2',
    slots: generateFloorSlots(3, 40),
  },
  {
    id: 4,
    name: 'Floor 3',
    slots: generateFloorSlots(4, 40),
  },
];

function generateFloorSlots(floor: number, count: number) {
  const statuses = ['available', 'occupied', 'reserved', 'ev', 'vip', 'emergency', 'maintenance'] as const;
  const weights = [0.35, 0.40, 0.10, 0.08, 0.04, 0.01, 0.02];
  
  return Array.from({ length: count }, (_, i) => {
    const rand = Math.random();
    let cumulative = 0;
    let status: (typeof statuses)[number] = 'available';
    for (let j = 0; j < weights.length; j++) {
      cumulative += weights[j];
      if (rand < cumulative) {
        status = statuses[j];
        break;
      }
    }
    
    return {
      id: `F${floor}-${String(i + 1).padStart(2, '0')}`,
      number: `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
      status,
      vehicle: status === 'occupied' ? `KA ${String(Math.floor(Math.random()*99)).padStart(2,'0')} XX ${Math.floor(1000+Math.random()*9000)}` : null,
      entryTime: status === 'occupied' ? '09:30 AM' : null,
      reservedUntil: status === 'reserved' ? '03:30 PM' : null,
    };
  });
}
