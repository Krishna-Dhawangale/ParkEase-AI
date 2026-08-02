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

// [DEVELOPMENT MOCK]
export const kpiCards: KPICard[] = [
  {
    id: 'total-slots',
    title: 'Total Parking Slots',
    value: '0',
    change: 0,
    trend: 'up',
    icon: 'LayoutGrid',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    color: 'blue',
  },
  {
    id: 'occupied',
    title: 'Occupied Slots',
    value: '0',
    change: 0,
    trend: 'up',
    icon: 'Car',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    color: 'emerald',
  },
  {
    id: 'available',
    title: 'Available Slots',
    value: '0',
    change: 0,
    trend: 'up',
    icon: 'CircleParking',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    color: 'cyan',
  },
  {
    id: 'today-revenue',
    title: "Today's Revenue",
    value: '₹0',
    change: 0,
    trend: 'up',
    icon: 'IndianRupee',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    color: 'indigo',
  },
  {
    id: 'monthly-revenue',
    title: 'Monthly Revenue',
    value: '₹0',
    change: 0,
    trend: 'up',
    icon: 'TrendingUp',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    color: 'violet',
  },
  {
    id: 'total-bookings',
    title: 'Total Bookings',
    value: '0',
    change: 0,
    trend: 'up',
    icon: 'CalendarCheck',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    color: 'teal',
  },
  {
    id: 'health-score',
    title: 'Parking Health Score',
    value: '0',
    change: 0,
    trend: 'up',
    icon: 'HeartPulse',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    suffix: '%',
    color: 'emerald',
  },
  {
    id: 'ai-accuracy',
    title: 'AI Recommendation',
    value: '0',
    change: 0,
    trend: 'up',
    icon: 'Brain',
    sparkline: [0, 0, 0, 0, 0, 0, 0],
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

// [DEVELOPMENT MOCK]
export const revenueData: RevenueDataPoint[] = [];

// ─── Booking Data ───────────────────────────────────────────────────────────────

export interface BookingDataPoint {
  day: string;
  bookings: number;
  cancellations: number;
  walkins: number;
}

// [DEVELOPMENT MOCK]
export const bookingData: BookingDataPoint[] = [];

// ─── Occupancy Data ─────────────────────────────────────────────────────────────

export interface OccupancySegment {
  name: string;
  value: number;
  color: string;
}

// [DEVELOPMENT MOCK]
export const occupancyData: OccupancySegment[] = [];

// ─── Peak Hour Data ─────────────────────────────────────────────────────────────

export interface PeakHourDataPoint {
  hour: string;
  occupancy: number;
  entries: number;
  exits: number;
}

// [DEVELOPMENT MOCK]
export const peakHourData: PeakHourDataPoint[] = [];

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

// [DEVELOPMENT MOCK]
export const recentBookings: RecentBooking[] = [];

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

// [DEVELOPMENT MOCK]
export const recentPayments: RecentPayment[] = [];

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

// [DEVELOPMENT MOCK]
export const recentAlerts: RecentAlert[] = [];
