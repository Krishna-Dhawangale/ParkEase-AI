import { useState, useMemo } from 'react';
import { Search, IndianRupee, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { recentPayments } from '../dashboard/data';
type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded';
import { useTenantStore } from '../../../store';

const statusConfig: Record<PaymentStatus, { color: string; bg: string }> = {
  Success: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  Pending: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  Failed: { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  Refunded: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
};

const Payments = () => {
  const { currentTenant } = useTenantStore();
  const isDraft = currentTenant?.status === 'DRAFT' || currentTenant?.status === 'TRIAL';
  
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | PaymentStatus>('All');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Since it's a new draft tenant, there's no payment history. 
  // We'll use the empty array to enforce real business behavior.
  const payments = recentPayments;

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch = p.customer.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus, payments]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Payments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage transactions, refunds, and revenue</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Revenue</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
              <IndianRupee className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">₹0</h3>
          <p className="mt-1 text-xs text-slate-500">Awaiting first transaction</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pending Settlements</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <IndianRupee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">₹0</h3>
          <p className="mt-1 text-xs text-slate-500">0 transactions</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Refunds</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <IndianRupee className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">₹0</h3>
          <p className="mt-1 text-xs text-slate-500">0 transactions</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'Success', 'Pending', 'Failed', 'Refunded'] as const).map((status) => (
            <button
              key={status}
              onClick={() => { setFilterStatus(status); setPage(1); }}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filterStatus === status
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-72"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map((payment) => {
                const sc = statusConfig[payment.status];
                return (
                  <tr key={payment.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{payment.id}</td>
                    <td className="px-6 py-4 text-slate-500">{payment.time}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{payment.customer}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{payment.amount}</td>
                    <td className="px-6 py-4">
                      <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", sc.bg, sc.color)}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <IndianRupee className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No Payments Yet</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Revenue will appear here after your first completed paid booking. Your facility is currently in {currentTenant?.status || 'DRAFT'} status.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
