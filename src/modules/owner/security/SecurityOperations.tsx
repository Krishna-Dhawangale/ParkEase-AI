import React, { useState } from 'react';
import { ShieldCheck, Camera, Lock, Unlock, AlertTriangle, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

const mockAnprLogs = [
  { id: 'ANPR-881', plate: 'KA 05 MN 4521', gate: 'Entry Gate 1', timestamp: '10:42:15 AM', confidence: 99.2, status: 'MATCHED (Booking #9021)', type: 'ALLOWED' },
  { id: 'ANPR-882', plate: 'MH 12 AB 9988', gate: 'Entry Gate 2', timestamp: '11:15:02 AM', confidence: 98.6, status: 'WALK-IN ISSUED', type: 'ALLOWED' },
  { id: 'ANPR-883', plate: 'KA 01 ZZ 9999', gate: 'Entry Gate 1', timestamp: '11:45:10 AM', confidence: 99.8, status: 'BLACKLIST MATCH', type: 'DENIED' },
];

export const SecurityOperations: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Security & ANPR Operations
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Facility Gate Barriers & ANPR Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time Automatic Number Plate Recognition (ANPR) logs, barrier controls, security incidents, and blacklist manager.</p>
        </div>
      </div>

      {/* ANPR Live Scan Feed */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">ANPR Camera Live Scan Logs</h3>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">ANPR Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Scanned Plate</th>
                <th className="p-3">Gate Camera</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">OCR Confidence</th>
                <th className="p-3">System Verification</th>
                <th className="p-3">Access Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockAnprLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-400">{log.id}</td>
                  <td className="p-3 font-mono text-base font-bold text-white">{log.plate}</td>
                  <td className="p-3 text-slate-300">{log.gate}</td>
                  <td className="p-3 text-slate-400">{log.timestamp}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{log.confidence}%</td>
                  <td className="p-3 font-medium text-slate-300">{log.status}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.type === 'ALLOWED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.type}
                    </span>
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
