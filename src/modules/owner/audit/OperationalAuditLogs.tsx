import React from 'react';
import { FileText, ShieldCheck, User, Clock, Filter, Search } from 'lucide-react';

const mockAuditLogs = [
  { id: 'AUD-901', timestamp: '10:42:12 AM', staff: 'Ravi Verma (Manager)', action: 'CHANGED_PRICING', details: 'Updated base hourly pricing from ₹50 → ₹60/hr', target: 'Downtown Central Parking' },
  { id: 'AUD-902', timestamp: '12:11:05 PM', staff: 'Suresh Kumar (Guard)', action: 'GATE_MANUAL_OPEN', details: 'Opened Gate 2 barrier arm manually for emergency vehicle', target: 'Gate 2 North' },
  { id: 'AUD-903', timestamp: '02:04:40 PM', staff: 'Ravi Verma (Manager)', action: 'BOOKING_CANCELLED', details: 'Cancelled Booking #BK-9020 and issued full refund ₹150', target: 'Customer Rahul' },
  { id: 'AUD-904', timestamp: '03:15:22 PM', staff: 'Anita Roy (Cashier)', action: 'WALKIN_BOOKING_CREATED', details: 'Issued manual walk-in parking pass for slot B-04', target: 'Slot B-04' },
];

export const OperationalAuditLogs: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Operational Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Operational Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Immutable audit trail logging all staff actions, tariff updates, gate barrier overrides, and booking edits.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Staff Operator</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Audit Details</th>
                <th className="p-3">Target Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockAuditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-emerald-400">{log.id}</td>
                  <td className="p-3 text-slate-400">{log.timestamp}</td>
                  <td className="p-3 font-medium text-white">{log.staff}</td>
                  <td className="p-3 font-mono text-emerald-300">{log.action}</td>
                  <td className="p-3 text-slate-200">{log.details}</td>
                  <td className="p-3 text-slate-400">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
