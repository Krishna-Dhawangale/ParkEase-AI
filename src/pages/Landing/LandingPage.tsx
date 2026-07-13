import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Car, Brain, Cpu, MapPin, Star, ChevronRight, Check, Shield,
  Zap, TrendingUp, BarChart3, Globe, Clock, Leaf, ArrowRight,
  Play, ChevronDown, Moon, Sun, Quote, Building2, Phone, Mail,
  MessageCircle, Globe2, ExternalLink, Share2
} from 'lucide-react';
import { useThemeStore } from '../../store';
import { cn } from '../../lib/utils';
import { ParkingIllustration } from './ParkingIllustration';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    desc: 'Our neural network analyzes 50+ parameters to recommend the perfect slot for you in under 200ms.',
    color: 'brand',
  },
  {
    icon: Cpu,
    title: 'Digital Twin Technology',
    desc: 'Real-time 3D visualization of every parking space. Monitor occupancy, cameras, and barriers live.',
    color: 'info',
  },
  {
    icon: Zap,
    title: 'Instant EV Charging',
    desc: 'Smart EV slot allocation with charging status monitoring. Reserve your charge before you arrive.',
    color: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    desc: 'Forecast occupancy, revenue trends, and demand patterns with 96% accuracy up to 7 days ahead.',
    color: 'success',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'AI-powered camera surveillance, license plate recognition, and barrier automation built in.',
    color: 'brand',
  },
  {
    icon: Globe,
    title: 'Smart City Ready',
    desc: 'Integrate with city APIs, traffic systems, and transit networks. ISO 27001 & SOC 2 compliant.',
    color: 'info',
  },
];

const stats = [
  { value: '12M+', label: 'Parking Sessions', icon: Car },
  { value: '500+', label: 'Partner Locations', icon: Building2 },
  { value: '96.2%', label: 'AI Accuracy', icon: Brain },
  { value: '₹2.4B', label: 'Revenue Managed', icon: TrendingUp },
];

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'Head of Operations, Kempegowda Airport',
    quote: 'ParkEase AI transformed how we manage 5,000 parking bays. Revenue went up 34% and customer complaints dropped by 78%.',
    avatar: 'RS',
    rating: 5,
  },
  {
    name: 'Dr. Priya Nair',
    role: 'CTO, Manipal Hospital Group',
    quote: 'The Digital Twin feature gave our admin team real-time visibility they never had before. The AI slot suggestions are eerily accurate.',
    avatar: 'PN',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Smart City Director, Pune Municipal Corporation',
    quote: 'We evaluated 8 platforms. ParkEase AI was the only one with a truly enterprise-grade design and the analytics we needed for our smart city mandate.',
    avatar: 'AM',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'How does AI recommendation work?',
    a: 'Our AI analyzes your vehicle type, destination, walking preference, parking duration, EV needs, real-time availability, and historical congestion patterns to recommend the optimal slot with explainable reasoning.',
  },
  {
    q: 'What is the Digital Twin feature?',
    a: 'Digital Twin creates a live virtual replica of your parking facility. It shows real-time slot status, vehicle positions, camera feeds, barrier states, and heatmaps — all updated in under 500ms.',
  },
  {
    q: 'Can ParkEase AI integrate with existing systems?',
    a: 'Yes. We offer REST APIs, webhooks, and SDKs for integration with PMS, ERP, city APIs, ANPR cameras, payment gateways, and access control systems.',
  },
  {
    q: 'Is ParkEase AI suitable for small facilities?',
    a: 'Absolutely. We offer plans starting from 50 slots up to 50,000+ slots. The AI adapts to your scale and grows with your facility.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'UPI, Credit/Debit Cards, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and FASTag. International cards and invoicing for enterprise accounts.',
  },
];

const logos = [
  'Bangalore Airport', 'Nexus Malls', 'Apollo Hospitals', 
  'BMRCL Metro', 'Prestige Group', 'Infosys Campus',
];

const workflow = [
  { step: '01', title: 'Search', desc: 'Enter destination and find nearby parking facilities instantly' },
  { step: '02', title: 'AI Match', desc: 'AI recommends the best slot based on your needs and live data' },
  { step: '03', title: 'Reserve', desc: 'Book your slot in under 30 seconds with one-tap reservation' },
  { step: '04', title: 'Navigate', desc: 'Get turn-by-turn directions to your reserved slot' },
  { step: '05', title: 'Park & Pay', desc: 'Automated entry, contactless payment, and smart exit' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('min-h-screen', theme === 'dark' ? 'dark' : '')}>
      <div className="bg-[#F8FAFC] dark:bg-[#0F172A] text-[#111827] dark:text-[#F1F5F9]">

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[15px] text-white">
                ParkEase <span className="text-[#14B8A6]">AI</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {['Features', 'Digital Twin', 'Pricing', 'Enterprise', 'Blog'].map(item => (
                <a key={item} href="#" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                {theme === 'light' ? <Moon className="w-4 h-4 text-white/60" /> : <Sun className="w-4 h-4 text-[#F59E0B]" />}
              </button>
              <button onClick={() => navigate('/dashboard')} className="hidden sm:flex text-sm text-white/80 hover:text-white font-medium transition-colors">Sign In</button>
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-xl font-semibold text-sm text-white bg-[#0F766E] hover:bg-[#0D6B63] transition-all flex items-center gap-1.5">
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section – Cinematic Full-Bleed */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/hero-bg.png"
              alt="Premium vehicle on scenic mountain road"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
            <div className="max-w-2xl">
              <motion.div style={{ opacity: heroOpacity, y: heroY }} className="space-y-7">
                {/* AI Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <Brain className="w-3.5 h-3.5 text-[#14B8A6]" />
                  <span className="text-xs font-semibold text-white/90">Powered by ParkEase Neural Engine™</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                </motion.div>

                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tighter text-white">
                    Find It.{' '}
                    <span className="block text-[#14B8A6]">Reserve It.</span>
                    Park Smarter.
                  </h1>
                </motion.div>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-white/70 leading-relaxed max-w-lg"
                >
                  AI-powered parking recommendations, real-time Digital Twin monitoring, 
                  and smart analytics for airports, malls, hospitals, and smart cities.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-7 py-3.5 rounded-2xl font-semibold text-base text-white bg-[#0F766E] hover:bg-[#0D6B63] transition-all shadow-lg shadow-[#0F766E]/25 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Start Free Trial
                  </button>
                  <button className="px-7 py-3.5 rounded-2xl font-semibold text-base text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="w-2.5 h-2.5 text-white ml-0.5" />
                    </div>
                    Watch Demo
                  </button>
                </motion.div>

                {/* Trust signals */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-5 text-xs text-white/50"
                >
                  {['No credit card required', 'SOC 2 Certified', '99.9% uptime SLA'].map(trust => (
                    <div key={trust} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#14B8A6]" />
                      <span>{trust}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-6 pt-5 border-t border-white/10"
                >
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col">
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <span className="text-xs text-white/40">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-5 h-5 text-white/50" />
          </motion.div>
        </section>

        {/* Trusted By */}
        <section className="py-12 border-y border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-8">Trusted by leading organizations</p>
            <div className="flex items-center justify-center flex-wrap gap-8 lg:gap-12">
              {logos.map((logo, i) => (
                <motion.div
                  key={logo}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-[#9CA3AF] dark:text-[#475569] hover:text-[#6B7280] dark:hover:text-[#64748B] transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-semibold whitespace-nowrap">{logo}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-[#F8FAFC] dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F766E]/10 dark:bg-[#14B8A6]/10 border border-[#0F766E]/20 mb-4">
                <span className="text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6]">Enterprise Features</span>
              </div>
              <h2 className="text-4xl font-bold text-[#111827] dark:text-white mb-4 tracking-tight">
                Everything you need to manage<br />parking at enterprise scale
              </h2>
              <p className="text-[#6B7280] dark:text-[#94A3B8] max-w-2xl mx-auto">
                From a single 50-slot facility to a multi-location 50,000-slot network — ParkEase AI scales with your ambition.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 group"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center mb-4',
                    feature.color === 'brand' && 'bg-[#0F766E]/10 dark:bg-[#14B8A6]/10',
                    feature.color === 'info' && 'bg-blue-50 dark:bg-blue-900/20',
                    feature.color === 'amber' && 'bg-amber-50 dark:bg-amber-900/20',
                    feature.color === 'success' && 'bg-green-50 dark:bg-green-900/20',
                  )}>
                    <feature.icon className={cn(
                      'w-5 h-5',
                      feature.color === 'brand' && 'text-[#0F766E] dark:text-[#14B8A6]',
                      feature.color === 'info' && 'text-blue-600 dark:text-blue-400',
                      feature.color === 'amber' && 'text-amber-600 dark:text-amber-400',
                      feature.color === 'success' && 'text-green-600 dark:text-green-400',
                    )} />
                  </div>
                  <h3 className="font-bold text-[#111827] dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">{feature.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="py-24 bg-white dark:bg-[#1E293B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#111827] dark:text-white mb-4 tracking-tight">
                How ParkEase AI works
              </h2>
              <p className="text-[#6B7280] dark:text-[#94A3B8]">Five steps. Under 60 seconds. Zero frustration.</p>
            </motion.div>

            <div className="relative">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] dark:via-[#334155] to-transparent" />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {workflow.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative mb-4 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white font-bold text-lg flex items-center justify-center shadow-lg">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="font-bold text-[#111827] dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Digital Twin Preview */}
        <section className="py-24 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                  <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Digital Twin Technology</span>
                </div>
                <h2 className="text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
                  See every slot.<br />Control everything.
                </h2>
                <p className="text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                  Our Digital Twin creates a live virtual replica of your entire facility. 
                  Monitor occupancy, animate vehicle movement, detect conflicts, 
                  and manage barriers — all from a single interface.
                </p>
                <div className="space-y-3">
                  {[
                    'Real-time slot status with 500ms refresh',
                    'AI-detected conflicts and automatic resolution',
                    'Multi-floor navigation with heatmaps',
                    'Live camera and barrier control integration',
                  ].map(point => (
                    <div key={point} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0F766E]/10 dark:bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#0F766E] dark:text-[#14B8A6]" />
                      </div>
                      <span className="text-sm text-[#6B7280] dark:text-[#94A3B8]">{point}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/digital-twin')}
                  className="btn-primary"
                >
                  Explore Digital Twin
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-semibold text-[#111827] dark:text-white">Digital Twin – Live</span>
                    </div>
                    <div className="flex gap-1">
                      {['G', '1', '2', '3'].map(f => (
                        <button key={f} className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                          f === 'G' ? 'bg-[#0F766E] text-white' : 'bg-[#F8FAFC] dark:bg-[#334155] text-[#6B7280]'
                        )}>
                          {f === 'G' ? 'GF' : `F${f}`}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Mini digital twin preview */}
                  <MiniTwinPreview />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Stats */}
        <section className="py-16 gradient-brand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white">
              {[
                { value: '99.9%', label: 'Platform Uptime', sub: 'Last 12 months' },
                { value: '<200ms', label: 'AI Response Time', sub: 'Recommendation latency' },
                { value: '42%', label: 'Search Time Saved', sub: 'vs manual search' },
                { value: '₹4,200', label: 'Avg Revenue Gain', sub: 'Per slot per year' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="font-semibold text-white/90 mb-1">{stat.label}</div>
                  <div className="text-sm text-white/60">{stat.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white dark:bg-[#1E293B]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-[#111827] dark:text-white mb-4 tracking-tight">
                Trusted by industry leaders
              </h2>
              <p className="text-[#6B7280] dark:text-[#94A3B8]">From airports to smart cities, ParkEase AI delivers results.</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="card p-8"
              >
                <Quote className="w-8 h-8 text-[#0F766E]/30 dark:text-[#14B8A6]/30 mx-auto mb-6" />
                <p className="text-xl text-[#111827] dark:text-white font-medium leading-relaxed mb-6">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#111827] dark:text-white text-sm">{testimonials[activeTestimonial].name}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">{testimonials[activeTestimonial].role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === activeTestimonial ? 'bg-[#0F766E] dark:bg-[#14B8A6] w-5' : 'bg-[#E5E7EB] dark:bg-[#334155]'
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-[#F8FAFC] dark:bg-[#0F172A]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-[#111827] dark:text-white mb-4 tracking-tight">
                Frequently asked questions
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-[#111827] dark:text-white text-sm">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-[#6B7280] dark:text-[#94A3B8] leading-relaxed border-t border-[#E5E7EB] dark:border-[#334155] pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white dark:bg-[#1E293B]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl gradient-brand p-12 overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mb-6">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">Save fuel. Reduce CO₂. Park Green.</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                  Ready to transform your<br />parking operations?
                </h2>
                <p className="text-white/80 mb-8 max-w-lg mx-auto">
                  Join 500+ organizations using ParkEase AI to deliver smarter, greener, and more profitable parking experiences.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3.5 bg-white text-[#0F766E] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-all text-sm flex items-center gap-2 shadow-lg"
                  >
                    <Zap className="w-4 h-4" />
                    Start Free Trial
                  </button>
                  <button className="px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all text-sm flex items-center gap-2 border border-white/30">
                    <Phone className="w-4 h-4" />
                    Book a Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#111827] dark:bg-[#0F172A] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2 lg:col-span-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold">ParkEase AI</span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  The world's most intelligent smart parking platform for enterprise and smart cities.
                </p>
                <div className="flex gap-3">
                  {[MessageCircle, Globe2, ExternalLink, Share2].map((Icon, i) => (
                    <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-white/70" />
                    </a>
                  ))}
                </div>
              </div>

              {[
                { title: 'Product', links: ['Features', 'Digital Twin', 'AI Engine', 'Analytics', 'Pricing'] },
                { title: 'Solutions', links: ['Airports', 'Hospitals', 'Malls', 'Smart Cities', 'Campuses'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Partners'] },
                { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance', 'Cookies'] },
              ].map(col => (
                <div key={col.title}>
                  <p className="text-sm font-semibold mb-4">{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/40">© 2026 ParkEase AI. All rights reserved.</p>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  All systems operational
                </div>
                <span>•</span>
                <a href="mailto:hello@parkease.ai" className="flex items-center gap-1 hover:text-white/70 transition-colors">
                  <Mail className="w-3 h-3" />
                  hello@parkease.ai
                </a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

// Mini digital twin SVG preview for landing page
function MiniTwinPreview() {
  const rows = 4;
  const cols = 8;
  const statuses = ['available', 'occupied', 'reserved', 'ev', 'available', 'occupied', 'available', 'vip'];
  const colors: Record<string, string> = {
    available: '#16A34A',
    occupied: '#DC2626',
    reserved: '#F59E0B',
    ev: '#2563EB',
    vip: '#7C3AED',
    maintenance: '#6B7280',
  };

  return (
    <div className="relative overflow-hidden">
      <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-4">
        {/* Drive lane at top */}
        <div className="h-4 bg-[#E5E7EB] dark:bg-[#334155] rounded-lg mb-3 flex items-center px-2">
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              animate={{ x: ['0%', '300%'] }}
              transition={{ delay: i * 1.5, duration: 4, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-2 bg-[#0F766E] rounded-sm mr-2 opacity-70 flex-shrink-0"
            />
          ))}
        </div>
        
        {/* Parking slots grid */}
        <div className="grid grid-cols-8 gap-1 mb-3">
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const status = statuses[idx % statuses.length];
            return (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="h-6 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `${colors[status]}20`, border: `1px solid ${colors[status]}40` }}
              >
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors[status] }} />
              </motion.div>
            );
          })}
        </div>

        {/* Drive lane at bottom */}
        <div className="h-4 bg-[#E5E7EB] dark:bg-[#334155] rounded-lg flex items-center px-2">
          <motion.div
            animate={{ x: ['300%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-2 bg-[#DC2626] rounded-sm opacity-70 flex-shrink-0"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-3 mt-3">
          {Object.entries(colors).filter(([k]) => ['available','occupied','reserved','ev'].includes(k)).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-[#6B7280] capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
