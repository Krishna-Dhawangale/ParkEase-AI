import React from 'react';
import { ShieldCheck, Users2, CheckCircle2, MoreVertical, Plus } from 'lucide-react';

const mockRoles = [
  { id: 'R-1', name: 'Manager', description: 'Full access to all modules and billing', users: 3, permissions: ['All Access'] },
  { id: 'R-2', name: 'Supervisor', description: 'Can manage bookings, employees, and view reports', users: 8, permissions: ['Bookings', 'Employees', 'Reports'] },
  { id: 'R-3', name: 'Attendant', description: 'Can check-in/out vehicles and view active bookings', users: 24, permissions: ['Check-in/Out', 'View Bookings'] },
  { id: 'R-4', name: 'Security', description: 'Can view security cameras and active vehicles', users: 12, permissions: ['Security Cameras', 'Vehicle Logs'] },
  { id: 'R-5', name: 'Technician', description: 'Can manage devices and view health status', users: 5, permissions: ['Device Management', 'Health Logs'] },
];

const Roles = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Roles & Permissions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage access control across your parking facility</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRoles.map((role) => (
          <div key={role.id} className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{role.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                    <Users2 className="w-3.5 h-3.5" />
                    <span>{role.users} Users</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
              {role.description}
            </p>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Key Permissions</h4>
              <ul className="space-y-2">
                {role.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roles;
