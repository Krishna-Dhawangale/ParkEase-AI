import React from 'react';
import { HelpCircle, MessageSquare, Phone, ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';

export const CustomerSupportPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white shadow">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">Customer Support & Helpdesk</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Submit support tickets, report facility issues, or request booking assistance.</p>
          </div>
        </div>

        <button className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-[#14B8A6]">TICKET-4412</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">Resolved</span>
          </div>
          <h3 className="font-bold text-base text-[var(--text-primary)] dark:text-white">Refund Request for Double Charge</h3>
          <p className="text-xs text-[var(--text-secondary)]">Issue resolved on Jul 20. Refund of ₹150 processed to ParkEase Wallet.</p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-[#14B8A6]">TICKET-4419</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">In Progress</span>
          </div>
          <h3 className="font-bold text-base text-[var(--text-primary)] dark:text-white">Gate 2 QR Scanner Latency</h3>
          <p className="text-xs text-[var(--text-secondary)]">Assigned to Facility Operator. Investigating camera optical sensor.</p>
        </div>
      </div>
    </div>
  );
};
