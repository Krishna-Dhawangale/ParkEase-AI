import React from 'react';
import { Users, Star, History, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

const mockCustomers = [
  { id: 'CUST-101', name: 'Rahul Sharma', email: 'rahul@example.com', visits: 18, totalSpent: 2700, status: 'VIP Member', rating: 4.9 },
  { id: 'CUST-102', name: 'Priya Verma', email: 'priya@example.com', visits: 12, totalSpent: 1800, status: 'Regular', rating: 4.8 },
  { id: 'CUST-103', name: 'Amit Kumar', email: 'amit@example.com', visits: 5, totalSpent: 750, status: 'Regular', rating: 4.5 },
  { id: 'CUST-104', name: 'Sneha Patel', email: 'sneha@example.com', visits: 24, totalSpent: 3600, status: 'VIP Member', rating: 5.0 },
];

export const CustomerDirectory: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Customer CRM
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Customer Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Track visit frequencies, VIP membership status, reviews, and customer complaints.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockCustomers.map(c => (
          <div key={c.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{c.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                c.status === 'VIP Member' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {c.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base">{c.name}</h3>
              <p className="text-xs text-slate-400">{c.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 uppercase">Total Visits</p>
                <p className="font-bold text-white mt-0.5">{c.visits} times</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 uppercase">Spent</p>
                <p className="font-bold text-emerald-400 mt-0.5">₹{c.totalSpent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
