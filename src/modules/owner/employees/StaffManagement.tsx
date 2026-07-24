import React, { useState } from 'react';
import { UserCog, Plus, Shield, Check, Clock, UserCheck, Lock, Edit3 } from 'lucide-react';
import type { SubRole } from '../../../types/auth';

const mockStaff = [
  { id: 'EMP-01', name: 'Ravi Verma', email: 'ravi@parkease.ai', subRole: 'MANAGER' as SubRole, shift: 'Morning (08:00 - 16:00)', status: 'Online', permissions: ['BOOKING_MANAGE', 'CUSTOMER_MANAGE', 'AUDIT_LOG_VIEW'] },
  { id: 'EMP-02', name: 'Suresh Kumar', email: 'suresh@parkease.ai', subRole: 'SECURITY_GUARD' as SubRole, shift: 'Morning (08:00 - 16:00)', status: 'Online', permissions: ['ANPR_VIEW', 'GATE_CONTROL', 'INCIDENT_REPORT'] },
  { id: 'EMP-03', name: 'Anita Roy', email: 'anita@parkease.ai', subRole: 'CASHIER' as SubRole, shift: 'Evening (16:00 - 24:00)', status: 'Offline', permissions: ['WALKIN_BOOKING', 'PAYMENT_COLLECT', 'RECEIPT_PRINT'] },
  { id: 'EMP-04', name: 'Vikram Singh', email: 'vikram@parkease.ai', subRole: 'MAINTENANCE_ENGINEER' as SubRole, shift: 'Night (00:00 - 08:00)', status: 'Online', permissions: ['WORK_ORDER_VIEW', 'WORK_ORDER_UPDATE'] },
];

export const StaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Staff & Sub-Roles
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Staff Roster & Sub-Role Permissions</h1>
          <p className="text-xs text-slate-400 mt-1">Manage employees, security guards, cashiers, shift scheduling, and granular sub-role permissions.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add New Employee
        </button>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {staffList.map(emp => (
          <div key={emp.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white">{emp.name}</h3>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{emp.id}</span>
                </div>
                <p className="text-xs text-slate-400">{emp.email}</p>
              </div>

              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                emp.subRole === 'MANAGER' ? 'bg-purple-500/20 text-purple-400' :
                emp.subRole === 'SECURITY_GUARD' ? 'bg-blue-500/20 text-blue-400' :
                emp.subRole === 'CASHIER' ? 'bg-amber-500/20 text-amber-400' : 'bg-teal-500/20 text-teal-400'
              }`}>
                {emp.subRole.replace('_', ' ')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Shift: {emp.shift}
              </span>
              <span className={`font-semibold flex items-center gap-1 ${
                emp.status === 'Online' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${emp.status === 'Online' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                {emp.status}
              </span>
            </div>

            {/* Sub-Role Permissions */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Granted Granular Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {emp.permissions.map(p => (
                  <span key={p} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-emerald-300 border border-slate-700">
                    🔒 {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
