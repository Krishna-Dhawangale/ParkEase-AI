import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, User, DollarSign } from 'lucide-react';

const mockWorkOrders = [
  { id: 'WO-101', title: 'Barrier Arm Response Slow (Gate 2)', category: 'Gate Hardware', priority: 'High', status: 'In Progress', engineer: 'Vikram Singh', cost: 3500, date: 'Today, 09:15 AM' },
  { id: 'WO-102', title: 'Ultrasonic Sensor Slot A-14 Offline', category: 'IoT Sensors', priority: 'Medium', status: 'Open', engineer: 'Unassigned', cost: 1200, date: 'Today, 11:30 AM' },
  { id: 'WO-103', title: 'EV Rapid Charger #3 Connector Replace', category: 'EV Infrastructure', priority: 'Low', status: 'Completed', engineer: 'Vikram Singh', cost: 8500, date: 'Yesterday' },
];

export const MaintenanceWorkOrders: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              Work Order Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Maintenance & Work Orders</h1>
          <p className="text-xs text-slate-400 mt-1">Create maintenance work orders, assign engineers, track repair status, and log repair costs.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40">
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Issue Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned Engineer</th>
                <th className="p-3">Repair Cost</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockWorkOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-400">{wo.id}</td>
                  <td className="p-3 font-semibold text-white">{wo.title}</td>
                  <td className="p-3 text-slate-300">{wo.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      wo.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      wo.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {wo.priority}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-300">{wo.engineer}</td>
                  <td className="p-3 font-bold text-emerald-400">₹{wo.cost}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      wo.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      wo.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {wo.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium">Update</button>
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
