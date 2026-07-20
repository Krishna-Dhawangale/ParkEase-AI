// ─── Dashboard Mock Data ────────────────────────────────────────────────────────

export interface KPICard {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
  sparkline: number[];
  suffix?: string;
  color: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan' | 'indigo' | 'teal';
}

export const kpiCards: KPICard[] = [
  {
    id: 'total-slots',
    title: 'Total Parking Slots',
    value: '2,480',
    change: 4.2,
    trend: 'up',
    icon: 'LayoutGrid',
    sparkline: [30, 35, 28, 42, 38, 45, 50],
    color: 'blue',
  },
  {
    id: 'occupied',
    title: 'Occupied Slots',
    value: '1,847',
    change: 12.5,
    trend: 'up',
    icon: 'Car',
    sparkline: [60, 55, 70, 65, 72, 68, 75],
    color: 'emerald',
  },
  {
    id: 'available',
    title: 'Available Slots',
    value: '633',
    change: -8.3,
    trend: 'down',
    icon: 'CircleParking',
    sparkline: [40, 45, 30, 35, 28, 32, 25],
    color: 'cyan',
  },
  {
    id: 'today-revenue',
    title: "Today's Revenue",
    value: '₹1,24,500',
    change: 18.7,
    trend: 'up',
    icon: 'IndianRupee',
    sparkline: [20, 35, 40, 55, 48, 62, 70],
    color: 'indigo',
  },
  {
    id: 'monthly-revenue',
    title: 'Monthly Revenue',
    value: '₹28,45,000',
    change: 22.4,
    trend: 'up',
    icon: 'TrendingUp',
    sparkline: [40, 42, 48, 52, 58, 55, 65],
    color: 'violet',
  },
  {
    id: 'total-bookings',
    title: 'Total Bookings',
    value: '8,462',
    change: 15.3,
    trend: 'up',
    icon: 'CalendarCheck',
    sparkline: [50, 55, 60, 58, 65, 70, 72],
    color: 'teal',
  },
  {
    id: 'health-score',
    title: 'Parking Health Score',
    value: '94.2',
    change: 2.1,
    trend: 'up',
    icon: 'HeartPulse',
    sparkline: [88, 90, 89, 91, 92, 93, 94],
    suffix: '%',
    color: 'emerald',
  },
  {
    id: 'ai-accuracy',
    title: 'AI Recommendation',
    value: '97.8',
    change: 1.4,
    trend: 'up',
    icon: 'Brain',
    sparkline: [94, 95, 96, 95, 97, 96, 98],
    suffix: '%',
    color: 'amber',
  },
];

// ─── Revenue Data ───────────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 185000, expenses: 62000, profit: 123000 },
  { month: 'Feb', revenue: 210000, expenses: 68000, profit: 142000 },
  { month: 'Mar', revenue: 245000, expenses: 72000, profit: 173000 },
  { month: 'Apr', revenue: 228000, expenses: 70000, profit: 158000 },
  { month: 'May', revenue: 262000, expenses: 75000, profit: 187000 },
  { month: 'Jun', revenue: 298000, expenses: 80000, profit: 218000 },
  { month: 'Jul', revenue: 315000, expenses: 82000, profit: 233000 },
  { month: 'Aug', revenue: 288000, expenses: 78000, profit: 210000 },
  { month: 'Sep', revenue: 340000, expenses: 85000, profit: 255000 },
  { month: 'Oct', revenue: 365000, expenses: 88000, profit: 277000 },
  { month: 'Nov', revenue: 392000, expenses: 92000, profit: 300000 },
  { month: 'Dec', revenue: 425000, expenses: 95000, profit: 330000 },
];

// ─── Booking Data ───────────────────────────────────────────────────────────────

export interface BookingDataPoint {
  day: string;
  bookings: number;
  cancellations: number;
  walkins: number;
}

export const bookingData: BookingDataPoint[] = [
  { day: 'Mon', bookings: 142, cancellations: 12, walkins: 34 },
  { day: 'Tue', bookings: 168, cancellations: 8, walkins: 42 },
  { day: 'Wed', bookings: 155, cancellations: 15, walkins: 38 },
  { day: 'Thu', bookings: 178, cancellations: 10, walkins: 45 },
  { day: 'Fri', bookings: 210, cancellations: 18, walkins: 55 },
  { day: 'Sat', bookings: 245, cancellations: 22, walkins: 68 },
  { day: 'Sun', bookings: 198, cancellations: 14, walkins: 52 },
];

// ─── Occupancy Data ─────────────────────────────────────────────────────────────

export interface OccupancySegment {
  name: string;
  value: number;
  color: string;
}

export const occupancyData: OccupancySegment[] = [
  { name: 'Occupied', value: 1847, color: '#3B82F6' },
  { name: 'Reserved', value: 215, color: '#F59E0B' },
  { name: 'Available', value: 338, color: '#10B981' },
  { name: 'Maintenance', value: 80, color: '#6B7280' },
];

// ─── Peak Hour Data ─────────────────────────────────────────────────────────────

export interface PeakHourDataPoint {
  hour: string;
  occupancy: number;
  entries: number;
  exits: number;
}

export const peakHourData: PeakHourDataPoint[] = [
  { hour: '6AM', occupancy: 15, entries: 12, exits: 3 },
  { hour: '7AM', occupancy: 28, entries: 22, exits: 5 },
  { hour: '8AM', occupancy: 52, entries: 38, exits: 8 },
  { hour: '9AM', occupancy: 74, entries: 35, exits: 12 },
  { hour: '10AM', occupancy: 85, entries: 20, exits: 10 },
  { hour: '11AM', occupancy: 88, entries: 15, exits: 12 },
  { hour: '12PM', occupancy: 92, entries: 18, exits: 14 },
  { hour: '1PM', occupancy: 90, entries: 12, exits: 15 },
  { hour: '2PM', occupancy: 86, entries: 10, exits: 14 },
  { hour: '3PM', occupancy: 82, entries: 8, exits: 12 },
  { hour: '4PM', occupancy: 78, entries: 10, exits: 14 },
  { hour: '5PM', occupancy: 65, entries: 5, exits: 18 },
  { hour: '6PM', occupancy: 48, entries: 4, exits: 22 },
  { hour: '7PM', occupancy: 35, entries: 3, exits: 16 },
  { hour: '8PM', occupancy: 22, entries: 2, exits: 15 },
  { hour: '9PM', occupancy: 12, entries: 1, exits: 11 },
];

// ─── Recent Bookings ────────────────────────────────────────────────────────────

export type BookingStatus = 'Active' | 'Completed' | 'Cancelled' | 'Pending';

export interface RecentBooking {
  id: string;
  vehicle: string;
  vehicleType: string;
  user: string;
  time: string;
  status: BookingStatus;
  amount: string;
  slot: string;
}

export const recentBookings: RecentBooking[] = [
  { id: 'PE-7842', vehicle: 'MH 12 AB 1234', vehicleType: 'Sedan', user: 'Rahul Sharma', time: '2 min ago', status: 'Active', amount: '₹120', slot: 'A-12' },
  { id: 'PE-7841', vehicle: 'KA 05 MN 5678', vehicleType: 'SUV', user: 'Priya Patel', time: '8 min ago', status: 'Active', amount: '₹180', slot: 'B-05' },
  { id: 'PE-7840', vehicle: 'DL 01 CA 9012', vehicleType: 'Hatchback', user: 'Amit Kumar', time: '15 min ago', status: 'Completed', amount: '₹90', slot: 'C-18' },
  { id: 'PE-7839', vehicle: 'TN 09 BZ 3456', vehicleType: 'Sedan', user: 'Deepa Nair', time: '22 min ago', status: 'Active', amount: '₹150', slot: 'A-07' },
  { id: 'PE-7838', vehicle: 'GJ 06 DF 7890', vehicleType: 'Bike', user: 'Karan Mehta', time: '35 min ago', status: 'Pending', amount: '₹40', slot: 'D-22' },
  { id: 'PE-7837', vehicle: 'RJ 14 GH 2345', vehicleType: 'SUV', user: 'Sneha Gupta', time: '42 min ago', status: 'Completed', amount: '₹200', slot: 'B-11' },
  { id: 'PE-7836', vehicle: 'UP 32 JK 6789', vehicleType: 'Sedan', user: 'Vikas Singh', time: '55 min ago', status: 'Cancelled', amount: '₹0', slot: 'A-03' },
  { id: 'PE-7835', vehicle: 'MP 09 LM 0123', vehicleType: 'Hatchback', user: 'Anita Desai', time: '1 hr ago', status: 'Completed', amount: '₹110', slot: 'C-09' },
];

// ─── Recent Payments ────────────────────────────────────────────────────────────

export type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = 'UPI' | 'Card' | 'Wallet' | 'Net Banking' | 'Cash';

export interface RecentPayment {
  id: string;
  customer: string;
  method: PaymentMethod;
  amount: string;
  status: PaymentStatus;
  time: string;
}

export const recentPayments: RecentPayment[] = [
  { id: 'TXN-98421', customer: 'Rahul Sharma', method: 'UPI', amount: '₹120', status: 'Success', time: '2 min ago' },
  { id: 'TXN-98420', customer: 'Priya Patel', method: 'Card', amount: '₹180', status: 'Success', time: '8 min ago' },
  { id: 'TXN-98419', customer: 'Amit Kumar', method: 'Wallet', amount: '₹90', status: 'Success', time: '15 min ago' },
  { id: 'TXN-98418', customer: 'Deepa Nair', method: 'UPI', amount: '₹150', status: 'Pending', time: '22 min ago' },
  { id: 'TXN-98417', customer: 'Karan Mehta', method: 'Cash', amount: '₹40', status: 'Success', time: '35 min ago' },
  { id: 'TXN-98416', customer: 'Sneha Gupta', method: 'Card', amount: '₹200', status: 'Success', time: '42 min ago' },
  { id: 'TXN-98415', customer: 'Vikas Singh', method: 'Net Banking', amount: '₹0', status: 'Refunded', time: '55 min ago' },
  { id: 'TXN-98414', customer: 'Anita Desai', method: 'UPI', amount: '₹110', status: 'Failed', time: '1 hr ago' },
];

// ─── Recent Alerts ──────────────────────────────────────────────────────────────

export type AlertPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';
export type AlertType = 'Parking Full' | 'Camera Offline' | 'Barrier Error' | 'Sensor Offline' | 'Payment Failed' | 'AI Warning';

export interface RecentAlert {
  id: string;
  type: AlertType;
  message: string;
  priority: AlertPriority;
  timestamp: string;
  status: AlertStatus;
  location: string;
}

export const recentAlerts: RecentAlert[] = [
  { id: 'ALT-001', type: 'Parking Full', message: 'Zone A has reached 100% capacity', priority: 'Critical', timestamp: '1 min ago', status: 'Active', location: 'Zone A' },
  { id: 'ALT-002', type: 'Camera Offline', message: 'CCTV Camera #14 is not responding', priority: 'High', timestamp: '5 min ago', status: 'Active', location: 'Gate 3' },
  { id: 'ALT-003', type: 'Barrier Error', message: 'Exit barrier stuck in open position', priority: 'High', timestamp: '12 min ago', status: 'Acknowledged', location: 'Exit B' },
  { id: 'ALT-004', type: 'Sensor Offline', message: 'Slot sensor B-15 to B-20 offline', priority: 'Medium', timestamp: '18 min ago', status: 'Acknowledged', location: 'Zone B' },
  { id: 'ALT-005', type: 'Payment Failed', message: 'Payment gateway timeout errors detected', priority: 'High', timestamp: '25 min ago', status: 'Active', location: 'System' },
  { id: 'ALT-006', type: 'AI Warning', message: 'Anomalous traffic pattern detected', priority: 'Medium', timestamp: '32 min ago', status: 'Active', location: 'Zone C' },
  { id: 'ALT-007', type: 'Sensor Offline', message: 'Slot sensor D-01 to D-05 intermittent', priority: 'Low', timestamp: '45 min ago', status: 'Resolved', location: 'Zone D' },
  { id: 'ALT-008', type: 'Camera Offline', message: 'CCTV Camera #8 feed interrupted', priority: 'Medium', timestamp: '1 hr ago', status: 'Resolved', location: 'Gate 1' },
];
