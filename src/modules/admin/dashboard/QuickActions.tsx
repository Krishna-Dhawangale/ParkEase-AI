import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ParkingSquare,
  CalendarPlus,
  Users,
  Box,
  FileBarChart,
  Bell,
} from 'lucide-react';

// ─── Action Config ──────────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  bgColor: string;
}

const actions: QuickAction[] = [
  {
    id: 'add-parking',
    label: 'Add Parking',
    description: 'Create new parking zone',
    icon: ParkingSquare,
    path: '/admin/parking',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20',
  },
  {
    id: 'create-booking',
    label: 'Create Booking',
    description: 'Book a slot manually',
    icon: CalendarPlus,
    path: '/admin/bookings',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20',
  },
  {
    id: 'manage-employees',
    label: 'Manage Employees',
    description: 'View employee list',
    icon: Users,
    path: '/admin/employees',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-500/10 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20',
  },
  {
    id: 'digital-twin',
    label: 'Open Digital Twin',
    description: 'View 3D parking model',
    icon: Box,
    path: '/admin/digital-twin',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-500/10 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20',
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    description: 'Export analytics report',
    icon: FileBarChart,
    path: '/admin/reports',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20',
  },
  {
    id: 'send-notification',
    label: 'Send Notification',
    description: 'Notify users or staff',
    icon: Bell,
    path: '/admin/notifications',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-500/10 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20',
  },
];

// ─── Quick Actions ──────────────────────────────────────────────────────────────

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Frequently used operations</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-soft dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${action.bgColor}`}>
                <Icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {action.label}
                </p>
                <p className="mt-0.5 hidden text-[10px] text-slate-400 dark:text-slate-500 sm:block">
                  {action.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;
