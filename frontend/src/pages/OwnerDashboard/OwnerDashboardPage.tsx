import React from 'react';
import { useAuthStore } from '../../store';

export const OwnerDashboardPage: React.FC = () => {
  const user = useAuthStore(state => state.user);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Welcome back, {user?.firstName || 'Partner'}!
        </h1>
        <p className="text-sm opacity-70">Here's what's happening at your parking locations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">$1,240.00</p>
          <p className="text-sm text-green-600 mt-2">+12% from last week</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold">45</p>
          <p className="text-sm opacity-70 mt-2">Across 2 locations</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Average Occupancy</h3>
          <p className="text-3xl font-bold">78%</p>
          <p className="text-sm text-green-600 mt-2">+5% from last week</p>
        </div>
      </div>

      <div className="card min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Your Parking Lots</h2>
        <div className="space-y-4">
          {/* Example of a parking lot listing */}
          <div className="border rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold">Downtown Central Parking</h4>
              <p className="text-sm opacity-70">123 Main St, Metropolis</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">32 / 50 Occupied</p>
              <button className="text-[var(--color-primary)] text-sm hover:underline mt-1">Manage Layout</button>
            </div>
          </div>
          
          <button className="border-2 border-dashed rounded-xl p-4 w-full text-center hover:bg-gray-50 transition-colors">
            + Add New Parking Lot
          </button>
        </div>
      </div>
    </div>
  );
};
