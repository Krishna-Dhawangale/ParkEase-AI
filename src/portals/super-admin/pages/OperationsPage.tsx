import {  useEffect, useState } from 'react';
import { Activity, Server, Database, Globe, ArrowUpRight, Cpu, TerminalSquare } from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SALoadingState } from '../components/SALoadingState';
import { cn } from '../../../lib/utils';

export function OperationsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SALoadingState fullPage />;

  return (
    <div className="space-y-6">
      <SAPageHeader 
        title="Platform Operations" 
        description="Monitor core infrastructure, API performance, and database health."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 99.99%
            </span>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">API Uptime (30d)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">Operational</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">API Latency (p95)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">42ms</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Database Load</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">24%</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <Server className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-slate-500 text-sm font-medium mb-1">Active WebSocket Conns</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">1,492</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-500" />
              Service Health
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'Core API Services', status: 'operational' },
                { name: 'Authentication & IAM', status: 'operational' },
                { name: 'Real-time Socket Gateway', status: 'operational' },
                { name: 'Billing Service (Stripe)', status: 'operational' },
                { name: 'Digital Twin Rendering Engine', status: 'operational' },
                { name: 'ANPR Processing Queue', status: 'degraded' },
                { name: 'Notification Service', status: 'operational' },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium uppercase tracking-wider",
                      service.status === 'operational' ? "text-emerald-600" : "text-amber-600"
                    )}>
                      {service.status}
                    </span>
                    <span className="flex h-2 w-2 relative">
                      {service.status === 'operational' ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-brand-500" />
              System Logs (Live)
            </h3>
          </div>
          <div className="p-4 bg-slate-950 h-[320px] overflow-y-auto font-mono text-xs">
            <div className="space-y-1">
              <div className="text-slate-400"><span className="text-blue-400">[INFO]</span> 2026-07-25 10:14:22.102 - SocketGateway - Connection established: fac_192837</div>
              <div className="text-slate-400"><span className="text-blue-400">[INFO]</span> 2026-07-25 10:14:25.401 - BillingWorker - Processing subscription renewals (0/14)</div>
              <div className="text-slate-400"><span className="text-blue-400">[INFO]</span> 2026-07-25 10:14:26.992 - AuthProvider - Successful login: admin@phoenix.com</div>
              <div className="text-slate-400"><span className="text-amber-400">[WARN]</span> 2026-07-25 10:14:31.005 - ANPRProcessor - High queue latency detected (avg: 1.2s)</div>
              <div className="text-slate-400"><span className="text-blue-400">[INFO]</span> 2026-07-25 10:14:35.111 - DeviceManager - Received heartbeat from DEV-001</div>
              <div className="text-slate-400"><span className="text-blue-400">[INFO]</span> 2026-07-25 10:14:40.222 - TwinEngine - Sync completed for Fac_921 (145ms)</div>
              <div className="text-slate-400"><span className="text-red-400">[ERROR]</span> 2026-07-25 10:14:45.001 - PGC_ConnPool - Connection timeout acquiring connection</div>
              <div className="text-slate-400"><span className="text-blue-400">[INFO]</span> 2026-07-25 10:14:45.050 - PGC_ConnPool - Connection pool expanded (+5)</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-slate-500">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
              </span>
              Tailing logs...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
