import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Download,
  RefreshCw,
  MoreVertical,
  Users2,
  UserCheck,
  UserX,
  Star,
  Mail,
  Phone,
  Car,
  CalendarCheck,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Crown,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────────

type CustomerTier = 'Regular' | 'Silver' | 'Gold' | 'Platinum';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehicleType: string;
  tier: CustomerTier;
  totalBookings: number;
  totalSpent: string;
  lastVisit: string;
  joinDate: string;
  isActive: boolean;
  avatar: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const mockCustomers: Customer[] = [];

const tierConfig: Record<CustomerTier, { color: string; bg: string }> = {
  Regular: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  Silver: { color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-700' },
  Gold: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  Platinum: { color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
};

const avatarColors = [
  'bg-blue-600', 'bg-rose-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600',
  'bg-cyan-600', 'bg-indigo-600', 'bg-pink-600', 'bg-teal-600', 'bg-orange-600',
];

// ─── Component ──────────────────────────────────────────────────────────────────

const Users = () => {
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<'All' | CustomerTier>('All');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    return mockCustomers.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.vehicle.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchTier = filterTier === 'All' || c.tier === filterTier;
      return matchSearch && matchTier;
    });
  }, [search, filterTier]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const counts = useMemo(() => ({
    total: mockCustomers.length,
    active: mockCustomers.filter((c) => c.isActive).length,
    platinum: mockCustomers.filter((c) => c.tier === 'Platinum').length,
    totalRevenue: '₹0',
  }), []);

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Customers</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage customer accounts, loyalty tiers, and visit history.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:flex">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Customers', value: counts.total, icon: Users2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Active', value: counts.active, icon: UserCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Premium', value: counts.platinum, icon: Crown, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Lifetime Revenue', value: counts.totalRevenue, icon: IndianRupee, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {(['All', 'Platinum', 'Gold', 'Silver', 'Regular'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => { setFilterTier(tier); setPage(1); }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filterTier === tier
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {tier}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-72"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Bookings</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map((customer, index) => {
                const tc = tierConfig[customer.tier];
                return (
                  <tr key={customer.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white", avatarColors[index % avatarColors.length])}>
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{customer.vehicle}</p>
                      <p className="text-xs text-slate-500">{customer.vehicleType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", tc.bg, tc.color)}>
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{customer.totalBookings}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{customer.totalSpent}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.lastVisit}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                        customer.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      )}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900 dark:text-white">{(page - 1) * perPage + 1}</span>–<span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * perPage, filtered.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
