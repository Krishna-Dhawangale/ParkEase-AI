import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, Activity, Battery, Leaf, AlertTriangle, 
  Info, AlertCircle, Zap, Car, Maximize, ZoomIn, ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export function CustomerDigitalTwin() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 h-[calc(100vh-72px)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm text-gray-500 font-medium mb-1">
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer')}>Home</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Digital Twin</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Empress Mall Parking</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Empress Mall - Digital Twin</h1>
          <p className="text-gray-500 mt-1">Real-time 3D monitoring and analytics.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-10 bg-white">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-gray-900">Live Status</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-xs text-gray-500">Last updated: Just now</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Sidebar - Analytics */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">
          
          <Card className="p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Real-time Overview</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Total Capacity</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">64% Occupancy</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">32 <span className="text-sm text-gray-500 font-medium">/ 50 Available</span></span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-0.5">Active Sensors</p>
                    <p className="font-bold text-gray-900 text-sm">48/50 Online</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">Normal</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Battery className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-0.5">Power Usage</p>
                    <p className="font-bold text-gray-900 text-sm">14.2 kWh</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">Efficient</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-0.5">Carbon Offset</p>
                    <p className="font-bold text-gray-900 text-sm">2.4 Tons</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">Excellent</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
              EV Charging Stations
              <Zap className="w-4 h-4 text-blue-500" />
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-gray-900">Station 1</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">Available</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-medium text-gray-900">Station 2</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-600 mb-0.5">Occupied</p>
                  <p className="text-[10px] text-gray-500">45m left</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden flex-1">
            <h2 className="text-base font-bold text-gray-900 p-5 pb-2">Recent Alerts</h2>
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-900 leading-snug mb-1">Unauthorized vehicle at Slot B4</p>
                  <p className="text-[10px] text-gray-500">2m ago</p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-900 leading-snug mb-1">Temperature normal in Zone A</p>
                  <p className="text-[10px] text-gray-500">15m ago</p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-900 leading-snug mb-1">Sensor offline at Slot C2</p>
                  <p className="text-[10px] text-gray-500">1h ago</p>
                </div>
              </div>
            </div>
          </Card>
          
        </div>

        {/* Right Area - 3D Map */}
        <div className="flex-1 bg-[#111111] rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center group">
          
          {/* Abstract 3D Representation Mockup */}
          <div className="absolute inset-0 opacity-40">
            {/* Grid floor */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)', transformOrigin: 'bottom' }}></div>
          </div>

          <div className="relative z-10 grid grid-cols-5 gap-8 p-12 transform rotateX-[30deg] rotateZ-[-10deg]">
             {/* Row A */}
             <div className="w-16 h-24 border-2 border-emerald-500/50 bg-emerald-500/20 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
             <div className="w-16 h-24 bg-red-500/80 rounded relative shadow-[0_0_15px_rgba(239,68,68,0.3)]">
               <div className="absolute inset-2 bg-gray-200 rounded-sm opacity-50"></div> {/* Car mockup */}
             </div>
             <div className="w-16 h-24 border-2 border-emerald-500/50 bg-emerald-500/20 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
             <div className="w-16 h-24 bg-red-500/80 rounded relative shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <div className="absolute inset-2 bg-gray-200 rounded-sm opacity-50"></div>
             </div>
             <div className="w-16 h-24 border-2 border-blue-500/50 bg-blue-500/20 rounded shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center"><Zap className="w-6 h-6 text-blue-400" /></div>

             {/* Row B */}
             <div className="w-16 h-24 border-2 border-emerald-500/50 bg-emerald-500/20 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
             <div className="w-16 h-24 border-2 border-emerald-500/50 bg-emerald-500/20 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
             <div className="w-16 h-24 bg-red-500/80 rounded relative shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <div className="absolute inset-2 bg-gray-300 rounded-sm opacity-50"></div>
             </div>
             <div className="w-16 h-24 bg-gray-700 rounded border border-gray-600 flex items-center justify-center opacity-50"><span className="text-xs text-white">Disabled</span></div>
             <div className="w-16 h-24 bg-red-500/80 rounded relative shadow-[0_0_15px_rgba(239,68,68,0.3)] border-2 border-blue-500/50">
                <div className="absolute inset-2 bg-gray-100 rounded-sm opacity-50"></div>
             </div>
          </div>

          {/* Top Label */}
          <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white font-medium text-sm flex items-center gap-2">
            <BoxIcon className="w-4 h-4" /> 3D Model View
          </div>

          {/* Hover Popup Mockup */}
          <div className="absolute top-1/3 left-1/2 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/20 text-white shadow-xl transform translate-x-12 -translate-y-8 pointer-events-none z-20">
             <p className="font-bold text-sm mb-1">Slot A2</p>
             <p className="text-xs text-red-400 font-medium mb-1">Occupied</p>
             <p className="text-xs text-gray-400">MH 31 XX 1234</p>
          </div>

          {/* Map Controls */}
          <div className="absolute right-6 bottom-6 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex flex-col overflow-hidden">
              <button className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 border-b border-white/10 transition-colors">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 border-b border-white/10 transition-colors">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            <button className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors mt-2">
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 px-4 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
              <div className="w-3 h-3 rounded bg-emerald-500/80 border border-emerald-400"></div> Available
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
              <div className="w-3 h-3 rounded bg-red-500/80 border border-red-400"></div> Occupied
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
              <div className="w-3 h-3 rounded bg-blue-500/30 border-2 border-blue-400"></div> EV Charging
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
              <div className="w-3 h-3 rounded bg-gray-600/80 border border-gray-500"></div> Disabled
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
