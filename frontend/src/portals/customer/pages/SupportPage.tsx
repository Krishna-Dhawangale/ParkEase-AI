import React, { useState } from 'react';
import { 
  Ticket, Lightbulb, Star, ChevronDown, Mail, Phone, Clock, X,
  CheckCircle2, AlertCircle, MessageSquare, Send, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FAQ Item Interface
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I cancel my booking?',
    answer: 'You can cancel your booking up to 15 minutes before the reserved start time directly from the "My Bookings" tab. Simply select your active booking card, click "Cancel Booking", and your refund will be automatically initiated according to our cancellation policy.'
  },
  {
    id: 'faq-2',
    question: 'How do I request a refund?',
    answer: 'Refunds are processed automatically whenever an eligible booking is cancelled or if a payment is interrupted during checkout. Standard refunds take 3–5 business days to reflect in your bank account, UPI, or credit card statement.'
  },
  {
    id: 'faq-3',
    question: 'Payment failed but money deducted.',
    answer: 'If your money was debited but the booking status did not update, our system automatically detects unconfirmed transactions and reverses the funds within 24 to 48 hours. If you need urgent resolution, click "Create Ticket" above with your transaction ID.'
  },
  {
    id: 'faq-4',
    question: 'How do I change my vehicle?',
    answer: 'You can manage your registered vehicles under the "Vehicles" tab in your profile. To change the vehicle assigned to an upcoming reservation, select the active booking in "My Bookings" and update the assigned vehicle license plate before check-in.'
  },
  {
    id: 'faq-5',
    question: 'How do I contact parking operator?',
    answer: 'Once your booking is confirmed, the facility manager contact number, gate entrance instructions, and digital QR pass are available directly on your ticket card in "My Bookings".'
  }
];

export function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'ticket' | 'feature' | 'rating' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [ticketCategory, setTicketCategory] = useState('Parking');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');

  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    setTicketSubject('');
    setTicketDesc('');
    showToast('Support ticket created successfully! Ticket ID #TK-9824');
  };

  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    setFeatureTitle('');
    setFeatureDesc('');
    showToast('Thank you! Your feature suggestion has been submitted.');
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    setFeedbackText('');
    showToast('Thank you for rating ParkEase AI!');
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => prev === id ? null : id);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-800 text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          Need Help? <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-medium mt-1">
          How can we assist you today?
        </p>
      </div>

      {/* Top 3 Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Create Ticket */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#FFF6E9] flex items-center justify-center mb-6 shrink-0 group-hover:scale-105 transition-transform">
              <Ticket className="w-7 h-7 text-amber-500 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1.5">Create Ticket</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6">
              Report parking, payment or booking issues.
            </p>
          </div>
          <button 
            onClick={() => setActiveModal('ticket')}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-xl text-xs md:text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
          >
            Create Ticket
          </button>
        </div>

        {/* Card 2: Request a Feature */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] flex items-center justify-center mb-6 shrink-0 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-7 h-7 text-purple-600 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1.5">Request a Feature</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6">
              Have an idea to improve ParkEase?
            </p>
          </div>
          <button 
            onClick={() => setActiveModal('feature')}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-xl text-xs md:text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
          >
            Suggest Feature
          </button>
        </div>

        {/* Card 3: Rate Us */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#EEFAF3] flex items-center justify-center mb-6 shrink-0 group-hover:scale-105 transition-transform">
              <Star className="w-7 h-7 text-emerald-500 fill-emerald-500/20 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1.5">Rate Us</h3>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6">
              Tell us about your experience.
            </p>
          </div>
          <button 
            onClick={() => setActiveModal('rating')}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-xl text-xs md:text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
          >
            Give Rating
          </button>
        </div>
      </div>

      {/* Bottom Section: FAQ (Left 2 cols) & Contact Support (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Frequently Asked Questions */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-gray-100">
            {faqData.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left py-2 group focus:outline-none"
                  >
                    <span className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-black transition-colors">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-gray-100 transition-colors">
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : ''}`}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed pt-2 pb-3 pl-1">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Support Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Contact Support
          </h2>

          <div className="space-y-6">
            {/* Support Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                <Mail className="w-5 h-5 text-gray-600" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <a 
                  href="mailto:support@parkease.ai" 
                  className="text-sm font-semibold text-gray-900 hover:text-black transition-colors truncate block"
                >
                  support@parkease.ai
                </a>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                <Phone className="w-5 h-5 text-gray-600" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <a 
                  href="tel:+9118001234567" 
                  className="text-sm font-semibold text-gray-900 hover:text-black transition-colors truncate block"
                >
                  +91 XXXXX XXXXX
                </a>
              </div>
            </div>

            {/* Support Hours */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                <Clock className="w-5 h-5 text-gray-600" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Mon - Sat</p>
                <p className="text-xs text-gray-500 mt-0.5">9:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialogs */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Create Ticket Form */}
              {activeModal === 'ticket' && (
                <form onSubmit={handleTicketSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Create Support Ticket</h3>
                      <p className="text-xs text-gray-500">We usually respond within 2 hours</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    >
                      <option value="Parking">Parking Issue</option>
                      <option value="Payment">Payment & Refund</option>
                      <option value="Booking">Booking Cancellation</option>
                      <option value="Technical">Technical Bug</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief issue title..."
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your problem in detail..."
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-md"
                  >
                    Submit Ticket
                  </button>
                </form>
              )}

              {/* Request Feature Form */}
              {activeModal === 'feature' && (
                <form onSubmit={handleFeatureSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Request a Feature</h3>
                      <p className="text-xs text-gray-500">Help us shape the future of ParkEase</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Feature Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EV charging slot pre-reservation..."
                      value={featureTitle}
                      onChange={(e) => setFeatureTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Details & Benefits</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Explain how this feature would help you..."
                      value={featureDesc}
                      onChange={(e) => setFeatureDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-md"
                  >
                    Submit Suggestion
                  </button>
                </form>
              )}

              {/* Give Rating Form */}
              {activeModal === 'rating' && (
                <form onSubmit={handleRatingSubmit} className="space-y-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                    <Star className="w-7 h-7 text-emerald-500 fill-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Rate Your Experience</h3>
                    <p className="text-xs text-gray-500 mt-1">Tap a star to rate ParkEase AI</p>
                  </div>

                  {/* Star selector */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1.5 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-gray-200 fill-gray-100'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Tell us what you loved or how we can improve..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black resize-none text-left"
                  />

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-md"
                  >
                    Submit Rating
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
