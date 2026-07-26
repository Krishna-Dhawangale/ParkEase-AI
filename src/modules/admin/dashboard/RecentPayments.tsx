import { motion } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  Wallet,
  Globe,
  Banknote,
  MoreHorizontal,
} from 'lucide-react';
import { recentPayments, type PaymentStatus, type PaymentMethod } from './data';

// ─── Status Styles ──────────────────────────────────────────────────────────────

const statusStyles: Record<PaymentStatus, string> = {
  Success:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Pending:  'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Failed:   'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Refunded: 'bg-bg-secondary text-txt-muted dark:bg-bg-hover/50 dark:text-txt-secondary',
};

// ─── Method Icon Map ────────────────────────────────────────────────────────────

const methodIconMap: Record<PaymentMethod, React.ElementType> = {
  UPI: Smartphone,
  Card: CreditCard,
  Wallet: Wallet,
  'Net Banking': Globe,
  Cash: Banknote,
};

// ─── Recent Payments ────────────────────────────────────────────────────────────

const RecentPayments = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="rounded-2xl border border-bdr bg-white shadow-soft dark:border-bdr dark:bg-bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-bdr px-6 py-4 dark:border-bdr">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
            <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-txt-primary dark:text-txt-primary">Recent Payments</h3>
            <p className="text-[11px] text-txt-muted dark:text-txt-secondary">Latest transactions</p>
          </div>
        </div>
        <button className="rounded-lg p-1.5 text-txt-secondary transition-colors hover:bg-bg-secondary hover:text-txt-muted dark:hover:bg-bg-elevated dark:hover:text-txt-secondary">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bdr dark:border-bdr">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-txt-secondary dark:text-txt-muted">
                Transaction
              </th>
              <th className="hidden px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-txt-secondary dark:text-txt-muted md:table-cell">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-txt-secondary dark:text-txt-muted">
                Method
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-txt-secondary dark:text-txt-muted">
                Status
              </th>
              <th className="hidden px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-txt-secondary dark:text-txt-muted lg:table-cell">
                Time
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-txt-secondary dark:text-txt-muted">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-bdr/50">
            {recentPayments.map((payment, index) => {
              const MethodIcon = methodIconMap[payment.method];
              return (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.04 }}
                  className="transition-colors hover:bg-bg-primary/80 dark:hover:bg-bg-elevated/50"
                >
                  <td className="whitespace-nowrap px-6 py-3">
                    <span className="text-sm font-medium text-txt-primary dark:text-txt-primary">
                      {payment.id}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-3 md:table-cell">
                    <span className="text-sm text-txt-muted dark:text-txt-secondary">
                      {payment.customer}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <div className="flex items-center gap-2">
                      <MethodIcon className="h-3.5 w-3.5 text-txt-secondary dark:text-txt-muted" />
                      <span className="text-sm text-txt-muted dark:text-txt-secondary">
                        {payment.method}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-3 lg:table-cell">
                    <span className="text-sm text-txt-muted dark:text-txt-secondary">
                      {payment.time}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    <span className="text-sm font-semibold text-txt-primary dark:text-txt-primary">
                      {payment.amount}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentPayments;
