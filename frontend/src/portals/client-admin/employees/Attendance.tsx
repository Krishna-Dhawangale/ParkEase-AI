import React, { useState } from 'react';
import { Search, Filter, Download, UserCheck, Clock, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

const mockAttendance = [
  { id: 'AT-1', employeeId: 'EMP-001', name: 'Rajesh Kumar', date: 'Today', shift: 'Day (9AM - 6PM)', checkIn: '08:50 AM', checkOut: '--', status: 'Present', hours: '3h 10m' },
  { id: 'AT-2', employeeId: 'EMP-002', name: 'Sunita Devi', date: 'Today', shift: 'Day (9AM - 6PM)', checkIn: '09:15 AM', checkOut: '--', status: 'Late', hours: '2h 45m' },
  { id: 'AT-3', employeeId: 'EMP-004', name: 'Lakshmi R.', date: 'Today', shift: 'Day (9AM - 6PM)', checkIn: '08:55 AM', checkOut: '--', status: 'Present', hours: '3h 05m' },
  { id: 'AT-4', employeeId: 'EMP-005', name: 'Prakash Yadav', date: 'Today', shift: 'Day (9AM - 6PM)', checkIn: '--', checkOut: '--', status: 'On Leave', hours: '0h 0m' },
  { id: 'AT-5', employeeId: 'EMP-003', name: 'Mohammad Ali', date: 'Yesterday', shift: 'Night (6PM - 6AM)', checkIn: '05:45 PM', checkOut: '06:10 AM', status: 'Present', hours: '12h 25m' },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
  Present: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  Late: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  'On Leave': { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  Absent: { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
};

const Attendance = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Present Today</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">42<span className="text-sm text-slate-400 font-medium">/45</span></h3>
        </div>
        <div className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Late Arrivals</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">3</h3>
        </div>
        <div className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">On Leave</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">1</h3>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Download className="h-4 w-4" />
            Export Timesheet
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date / Shift</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockAttendance.map((record) => {
                const sc = statusConfig[record.status] || statusConfig['Present'];
                return (
                  <tr key={record.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{record.name}</p>
                      <p className="text-xs text-slate-500">{record.employeeId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700 dark:text-slate-300">{record.date}</p>
                      <p className="text-xs text-slate-500">{record.shift}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{record.checkIn}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{record.checkOut}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{record.hours}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn("rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider inline-flex", sc.bg, sc.color)}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
