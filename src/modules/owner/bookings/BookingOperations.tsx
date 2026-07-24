import React, { useState } from 'react';
import { CalendarCheck, Plus, Check, X, Clock, UserCheck, IndianRupee, Filter, Search, RefreshCw } from 'lucide-react';

const mockBookings = [
  { id: 'BK-9021', customer: 'Rahul Sharma', vehicle: 'KA 05 MN 4521', slot: 'A-12', entry: '10:30 AM', exit: '02:30 PM', amount: 150, status: 'Active', type: 'App Booking' },
  { id: 'BK-9022', customer: 'Priya Verma', vehicle: 'MH 12 AB 9988', slot: 'B-04', entry: '11:15 AM', exit: '01:15 PM', amount: 100, status: 'Active', type: 'Walk-in' },
  { id: 'BK-9023', customer: 'Amit Kumar', vehicle: 'DL 01 CA 1234', slot: 'C-15', entry: '09:00 AM', exit: '12:00 PM', amount: 120, status: 'Completed', type: 'App Booking' },
  { id: 'BK-9024', customer: 'Ananya Roy', vehicle: 'KA 03 EF 5544', slot: 'A-08', entry: '01:00 PM', exit: '03:00 PM', amount: 100, status: 'Pending Approval', type: 'Overstay Pending' },
];

export const BookingOperations: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [showWalkinModal, setShowWalkinModal] = useState(false);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Bookings & Walk-ins
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Booking Management</h1>
          <p className="text-xs text-slate-400 mt-1">Approve/reject pending bookings, issue manual walk-in tickets, process overstay fees & refunds.</p>
        </div>

        <button
          onClick={() => setShowWalkinModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Issue Walk-in Ticket
        </button>
      </div>

      {/* Bookings Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['All', 'Active', 'Pending Approval', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle, slot, ID..."
              className="pl-8 pr-4 py-1.5 rounded-xl bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-emerald-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Vehicle Plate</th>
                <th className="p-3">Slot</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-emerald-400">{b.id}</td>
                  <td className="p-3 font-medium text-white">{b.customer}</td>
                  <td className="p-3 font-mono text-slate-300">{b.vehicle}</td>
                  <td className="p-3 font-bold text-white">{b.slot}</td>
                  <td className="p-3 text-slate-400">{b.entry} - {b.exit}</td>
                  <td className="p-3 font-bold text-white">₹{b.amount}</td>
                  <td className="p-3 text-slate-400">{b.type}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                      b.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {b.status === 'Pending Approval' && (
                      <>
                        <button className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">Approve</button>
                        <button className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-semibold">Reject</button>
                      </>
                    )}
                    {b.status === 'Active' && (
                      <button className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">Overstay Fee</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
