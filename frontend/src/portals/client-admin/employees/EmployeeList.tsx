import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  RefreshCw,
  Download,
  MoreVertical,
  UserCog,
  Users2,
  ShieldCheck,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import Roles from './Roles';
import Attendance from './Attendance';

// ─── Types ──────────────────────────────────────────────────────────────────────

type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave';
type EmployeeRole = 'Manager' | 'Supervisor' | 'Attendant' | 'Security' | 'Technician';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  zone: string;
  shift: string;
  status: EmployeeStatus;
  joinDate: string;
  avatar: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const mockEmployees: Employee[] = [];

const roleColors: Record<EmployeeRole, string> = {
  Manager: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  Supervisor: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Attendant: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Security: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Technician: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
};

const statusConfig: Record<EmployeeStatus, { color: string; bg: string }> = {
  Active: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  Inactive: { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  'On Leave': { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
};

const avatarColors = [
  'bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600',
  'bg-indigo-600', 'bg-cyan-600', 'bg-pink-600', 'bg-teal-600', 'bg-orange-600',
];

// ─── Component ──────────────────────────────────────────────────────────────────

const EmployeeList = () => {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | EmployeeRole>('All');
  const [currentTab, setCurrentTab] = useState<'Directory' | 'Roles' | 'Attendance'>('Directory');

  const filtered = useMemo(() => {
    return mockEmployees.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === 'All' || e.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [search, filterRole]);

  const counts = useMemo(() => ({
    total: mockEmployees.length,
    active: mockEmployees.filter((e) => e.status === 'Active').length,
    onLeave: mockEmployees.filter((e) => e.status === 'On Leave').length,
    roles: new Set(mockEmployees.map((e) => e.role)).size,
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Employees</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your parking facility workforce, shifts, and roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:flex">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button className="hidden items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:bg-blue-800 sm:flex">
            <Plus className="h-3.5 w-3.5" />
            Add Employee
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(['Directory', 'Roles', 'Attendance'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-bold border-b-2 transition-colors",
              currentTab === tab
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {currentTab === 'Directory' && (
        <div className="space-y-6">
          {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Staff', value: counts.total, icon: Users2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Active', value: counts.active, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'On Leave', value: counts.onLeave, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Roles', value: counts.roles, icon: ShieldCheck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'Manager', 'Supervisor', 'Attendant', 'Security', 'Technician'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                filterRole === role
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-64"
          />
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((employee, index) => {
          const sc = statusConfig[employee.status];
          return (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white", avatarColors[index % avatarColors.length])}>
                    {employee.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{employee.name}</h3>
                    <p className="text-xs text-slate-500">{employee.id}</p>
                  </div>
                </div>
                <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", roleColors[employee.role])}>
                  {employee.role}
                </span>
                <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", sc.bg, sc.color)}>
                  {employee.status}
                </span>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{employee.zone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{employee.shift}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{employee.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500">Joined {employee.joinDate}</p>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">View Profile</button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <UserCog className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 text-sm font-semibold text-slate-500">No employees found matching your criteria.</p>
        </div>
      )}
        </div>
      )}

      {currentTab === 'Roles' && <div className="mt-6"><Roles /></div>}
      {currentTab === 'Attendance' && <div className="mt-6"><Attendance /></div>}
    </div>
  );
};

export default EmployeeList;
