import React, { useState } from 'react';
import { Building2, Plus, Edit3, Trash2, MapPin, Zap, CheckCircle2, Clock, ShieldCheck, Car } from 'lucide-react';
import { mockParkingLots } from '../../../services/api.mock';

export const FacilityManagement: React.FC = () => {
  const [lots, setLots] = useState(mockParkingLots);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-txt-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-card p-6 rounded-2xl border border-bdr shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Facility Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-txt-primary tracking-tight">Owned Parking Properties</h1>
          <p className="text-xs text-txt-secondary mt-1">Configure capacity, EV charging ports, operating hours, base pricing, and status.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Facility
        </button>
      </div>

      {/* Facilities Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {lots.map(lot => (
          <div key={lot.id} className="p-6 rounded-2xl bg-bg-card border border-bdr space-y-4 hover:border-bdr transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-txt-primary">{lot.name}</h3>
                <p className="text-xs text-txt-secondary flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {lot.address.street}, {lot.address.city}, {lot.address.state}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-txt-secondary">{lot.description}</p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-bg-elevated/80 border border-bdr text-center">
                <p className="text-[10px] text-txt-secondary uppercase font-semibold">Total Capacity</p>
                <p className="text-lg font-bold text-txt-primary mt-0.5">{lot.capacity} Slots</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-elevated/80 border border-bdr text-center">
                <p className="text-[10px] text-txt-secondary uppercase font-semibold">Base Tariff</p>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">${lot.basePricePerHour}/hr</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-elevated/80 border border-bdr text-center">
                <p className="text-[10px] text-txt-secondary uppercase font-semibold">EV Chargers</p>
                <p className="text-lg font-bold text-teal-400 mt-0.5">8 Ports</p>
              </div>
            </div>

            {/* Features Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {lot.features.map(f => (
                <span key={f} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-bg-elevated text-txt-secondary border border-bdr">
                  ✓ {f}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-bdr">
              <span className="text-xs text-txt-secondary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Operating: 24/7 Mon-Sun
              </span>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-bg-elevated hover:bg-bg-hover text-txt-primary text-xs font-semibold flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
