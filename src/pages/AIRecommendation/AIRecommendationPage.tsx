import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, MapPin, Clock, TrendingUp, Leaf, Zap, Car, ChevronRight,
  Info, Check, AlertTriangle, BarChart3, Star, IndianRupee, Navigation,
  Shield, Cpu, ArrowRight, RefreshCw, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const recommendation = {
  slot: 'A-12',
  floor: 'Ground Floor',
  parking: 'Central Metro Parking Hub',
  confidence: 96.2,
  walkDistance: 180,
  walkTime: 3,
  expectedExit: '02:30 PM',
  expectedCongestion: 'Low',
  fuelSaved: 0.8,
  co2Saved: 1.9,
  estimatedCost: 120,
  vehicleCompatible: true,
  slotType: 'Standard',
  reasons: [
    { icon: '🎯', title: 'Optimal Location', desc: 'Closest to your destination within the facility. 180m walk — 3 minutes.', weight: 95 },
    { icon: '📊', title: 'Low Congestion Zone', desc: 'Floor A has historically 23% less congestion during 12–2 PM slot.', weight: 87 },
    { icon: '⚡', title: 'Fast Exit Route', desc: 'Direct exit path via Gate 1. Saves ~4 minutes during peak hours.', weight: 82 },
    { icon: '🌿', title: 'Green Route', desc: 'Recommended route saves 0.8L fuel and 1.9kg CO₂ vs alternatives.', weight: 78 },
    { icon: '🔒', title: 'High Security Zone', desc: 'Camera coverage density: 98%. Last 30 days: 0 incidents.', weight: 94 },
  ],
  alternativeSlots: [
    { slot: 'B-07', confidence: 87, cost: 120, walk: 240, type: 'Standard' },
    { slot: 'C-22', confidence: 79, cost: 100, walk: 380, type: 'Standard' },
    { slot: 'A-15 (EV)', confidence: 91, cost: 140, walk: 200, type: 'EV' },
  ],
};

function ConfidenceMeter({ value }: { value: number }) {
  const data = [{ value, fill: value > 90 ? '#16A34A' : value > 70 ? '#F59E0B' : '#DC2626' }];
  return (
    <div className="relative w-32 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={225}
          endAngle={-45}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--border)' }}
            dataKey="value"
            cornerRadius={10}
            angleAxisId={0}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[var(--text-primary)] dark:text-white">{value}%</span>
        <span className="text-[10px] text-[var(--text-secondary)]">confidence</span>
      </div>
    </div>
  );
}

export function AIRecommendationPage() {
  const navigate = useNavigate();
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-[var(--brand)]/10 dark:bg-[var(--brand-light)]/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-[var(--brand)] dark:text-[var(--brand-light)]" />
            </div>
            <span className="text-xs font-semibold text-[var(--brand)] dark:text-[var(--brand-light)] uppercase tracking-wider">AI Recommendation Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">Your Optimal Slot</h1>
          <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-0.5">
            ParkEase Neural Engine™ analyzed 847 parameters in 142ms
          </p>
        </div>
        <button onClick={handleRefresh} className="btn-secondary self-start sm:self-auto">
          <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          Recalculate
        </button>
      </div>

      {/* Main Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {/* Top gradient header */}
        <div className="gradient-brand p-6 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
          </div>
          <div className="relative grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-bold">
                  🏆 Best Match
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-bold">
                  {recommendation.slotType}
                </span>
              </div>
              <div className="text-5xl font-bold text-white mb-1">Slot {recommendation.slot}</div>
              <div className="text-white/80 font-semibold">{recommendation.floor}</div>
              <div className="text-white/60 text-sm mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {recommendation.parking}
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="flex flex-col items-center sm:items-end">
              <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center">
                <ConfidenceMeter value={recommendation.confidence} />
                <div className="mt-2 text-center">
                  <div className="text-white font-bold text-sm">AI Confidence Score</div>
                  <div className="text-white/60 text-xs">Excellent recommendation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[var(--border)] dark:divide-[var(--border)]">
          {[
            { icon: MapPin, label: 'Walk Distance', value: `${recommendation.walkDistance}m`, sub: `${recommendation.walkTime} min walk`, color: 'text-[var(--brand)] dark:text-[var(--brand-light)]' },
            { icon: Clock, label: 'Expected Exit', value: recommendation.expectedExit, sub: 'Today', color: 'text-blue-600 dark:text-blue-400' },
            { icon: TrendingUp, label: 'Congestion', value: recommendation.expectedCongestion, sub: 'Predicted', color: 'text-green-600 dark:text-green-400' },
            { icon: IndianRupee, label: 'Est. Cost', value: `₹${recommendation.estimatedCost}`, sub: 'for 2 hours', color: 'text-amber-600 dark:text-amber-400' },
          ].map((stat, i) => (
            <div key={stat.label} className="p-4 sm:p-5 flex flex-col items-center text-center">
              <stat.icon className={cn('w-5 h-5 mb-2', stat.color)} />
              <div className="text-lg font-bold text-[var(--text-primary)] dark:text-white">{stat.value}</div>
              <div className="text-xs font-medium text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{stat.label}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Green savings */}
        <div className="m-5 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-bold text-green-700 dark:text-green-400">Environmental Impact</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Fuel Saved', value: `${recommendation.fuelSaved}L`, icon: '⛽' },
              { label: 'CO₂ Saved', value: `${recommendation.co2Saved}kg`, icon: '🌿' },
              { label: 'Green Score', value: '+12 pts', icon: '⭐' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="text-xl">{item.icon}</div>
                <div className="text-sm font-bold text-green-700 dark:text-green-400">{item.value}</div>
                <div className="text-[11px] text-green-600/70">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/book')}
            className="btn-primary flex-1 py-3"
          >
            <Zap className="w-4 h-4" />
            Reserve Slot A-12
          </button>
          <button className="btn-secondary flex-1 py-3">
            <Navigation className="w-4 h-4" />
            Navigate There
          </button>
        </div>

        {/* Feedback */}
        <div className="px-5 pb-5 flex items-center gap-3">
          <span className="text-xs text-[var(--text-secondary)]">Was this recommendation helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFeedbackGiven('up')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                feedbackGiven === 'up'
                  ? 'bg-green-50 border-green-200 text-green-600'
                  : 'bg-white dark:bg-[var(--border)] border-[var(--border)] dark:border-[var(--border)] text-[var(--text-secondary)]'
              )}
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Yes
            </button>
            <button
              onClick={() => setFeedbackGiven('down')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                feedbackGiven === 'down'
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white dark:bg-[var(--border)] border-[var(--border)] dark:border-[var(--border)] text-[var(--text-secondary)]'
              )}
            >
              <ThumbsDown className="w-3.5 h-3.5" /> No
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Explainable AI Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] dark:border-[var(--border)]">
            <div className="w-8 h-8 rounded-xl bg-[var(--brand)]/10 dark:bg-[var(--brand-light)]/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[var(--brand)] dark:text-[var(--brand-light)]" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm">Explainable AI</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Why this slot was selected</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {recommendation.reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-xl flex-shrink-0">{reason.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-white">{reason.title}</p>
                    <span className="text-xs font-bold text-[var(--brand)] dark:text-[var(--brand-light)]">{reason.weight}%</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed">{reason.desc}</p>
                  <div className="mt-2 h-1.5 bg-[var(--border)] dark:bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${reason.weight}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-full bg-[var(--brand)]"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alternative Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          <div className="card">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] dark:border-[var(--border)]">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm">Alternative Slots</h3>
                <p className="text-[11px] text-[var(--text-secondary)]">Other AI suggestions</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {recommendation.alternativeSlots.map((alt, i) => (
                <div key={alt.slot} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--border)] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-[var(--bg-card)] border border-[var(--border)] dark:border-[var(--border)] flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--brand)] dark:text-[var(--brand-light)]">#{i + 2}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--text-primary)] dark:text-white">Slot {alt.slot}</span>
                      {alt.type !== 'Standard' && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600">⚡ {alt.type}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-[var(--text-secondary)]">{alt.confidence}% confidence</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">{alt.walk}m walk</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">₹{alt.cost}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Compatibility */}
          <div className="card p-5">
            <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm mb-4">Vehicle Compatibility</h3>
            <div className="space-y-2">
              {[
                { label: 'Vehicle: KA 05 MN 4521', compatible: true },
                { label: 'Sedan compatible', compatible: true },
                { label: 'Standard width (2.5m)', compatible: true },
                { label: 'Height clearance (2.2m)', compatible: true },
                { label: 'EV charging needed', compatible: false },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    item.compatible ? 'bg-green-50 dark:bg-green-900/20' : 'bg-[var(--bg-primary)] dark:bg-[var(--border)]'
                  )}>
                    {item.compatible ? (
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-[var(--text-secondary)]" />
                    )}
                  </div>
                  <span className={cn('text-xs', item.compatible ? 'text-[var(--text-primary)] dark:text-white' : 'text-[var(--text-secondary)]')}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
