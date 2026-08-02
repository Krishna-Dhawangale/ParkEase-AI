import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Car, Plus, Shield, 
  Video, Key, Lightbulb, Check, Navigation, Ticket, ChevronDown, Star
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Date State
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 4);
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week of the first day (0 = Sunday, 1 = Monday, etc)
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6; // Make Monday the first day of the week
    
    const days = [];
    
    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Next month padding
    const remainingSlots = 42 - days.length; // 6 rows * 7 cols
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth]);
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const [selectedTime, setSelectedTime] = useState('10:00 AM');


  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 font-medium">
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer')}>Home</span>
        <span className="mx-2">›</span>
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer/bookings')}>My Bookings</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Book Parking</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between max-w-4xl mx-auto border-b border-gray-100 pb-8 pt-4">
        <div className={`flex items-center gap-3 ${step >= 1 ? '' : 'opacity-50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-black text-white' : 'border-2 border-gray-300 text-gray-500'}`}>
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <span className={`font-bold ${step >= 1 ? 'text-gray-900' : 'text-gray-600'}`}>Select Slot & Time</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-6"></div>
        <div className={`flex items-center gap-3 ${step >= 2 ? '' : 'opacity-50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-black text-white' : 'border-2 border-gray-300 text-gray-500'}`}>
            {step > 2 ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <span className={`font-bold ${step >= 2 ? 'text-gray-900' : 'text-gray-600'}`}>Payment</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-6"></div>
        <div className={`flex items-center gap-3 ${step >= 3 ? '' : 'opacity-50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-black text-white' : 'border-2 border-gray-300 text-gray-500'}`}>
            {step > 3 ? <Check className="w-4 h-4" /> : '3'}
          </div>
          <span className={`font-bold ${step >= 3 ? 'text-gray-900' : 'text-gray-600'}`}>Confirmation</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-6"></div>
        <div className={`flex items-center gap-3 ${step >= 4 ? '' : 'opacity-50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 4 ? 'bg-black text-white' : 'border-2 border-gray-300 text-gray-500'}`}>
            {step > 4 ? <Check className="w-4 h-4" /> : '4'}
          </div>
          <span className={`font-bold ${step >= 4 ? 'text-gray-900' : 'text-gray-600'}`}>Navigation</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column - Selection */}
        {step === 1 && (
        <div className="flex-[1.5] space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Select Date & Time</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Calendar */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-4">Date</p>
                <div className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="font-bold text-gray-900">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500 font-medium">
                    <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                    {daysInMonth.map((dayObj, i) => {
                      const d = dayObj.date;
                      d.setHours(0, 0, 0, 0);
                      const isPast = d.getTime() < today.getTime();
                      const isTooFar = d.getTime() > maxDate.getTime();
                      const isDisabled = isPast || isTooFar;
                      const isSelected = selectedDate.getTime() === d.getTime();
                      
                      let className = "py-2 cursor-pointer rounded-full transition-colors ";
                      if (isSelected) {
                        className += "bg-black text-white font-bold";
                      } else if (isDisabled) {
                        className += "text-gray-300 cursor-not-allowed";
                      } else if (!dayObj.isCurrentMonth) {
                        className += "text-gray-400 hover:bg-gray-100";
                      } else {
                        className += "text-gray-900 hover:bg-gray-100";
                      }
                      
                      return (
                        <div 
                          key={i} 
                          className={className}
                          onClick={() => !isDisabled && setSelectedDate(d)}
                        >
                          {d.getDate()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="flex-[1.2]">
                <p className="text-sm font-medium text-gray-500 mb-4">Entry Time</p>
                <div className="grid grid-cols-3 gap-2">
                  {['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'].map(time => (
                    <div 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`border rounded-lg py-2 text-center text-xs font-medium cursor-pointer transition-colors ${selectedTime === time ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'}`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <div className="border border-gray-200 rounded-lg px-3 py-1 flex flex-col items-center">
                  <span className="font-bold text-gray-900 text-sm">2 Hours <ChevronDown className="w-3 h-3 inline ml-1 text-gray-400" /></span>
                </div>
              </div>
              <div className="h-10 flex items-center relative">
                <div className="absolute w-full h-1.5 bg-gray-100 rounded-full"></div>
                <div className="absolute w-[20%] h-1.5 bg-black rounded-full left-[5%]"></div>
                <div className="absolute w-5 h-5 bg-black rounded-full shadow-lg left-[25%] -ml-2.5 border-[3px] border-white flex items-center justify-center"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                <span>30m</span>
                <span className="text-gray-900 font-bold mr-6">Exit by 12:00 PM</span>
                <span>12h</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Vehicle <span className="text-gray-400 font-normal text-sm ml-1">(Optional)</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-black rounded-xl p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">MH 31 AB 1234</p>
                    <p className="text-[11px] text-gray-500 font-medium">SUV • Black</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-black flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
              </div>
              <div className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-600 font-medium text-sm">
                <Plus className="w-4 h-4" /> Add New Vehicle
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-gray-50/50">
            <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-5 flex items-center gap-4 w-full md:w-auto flex-1">
                <Shield className="w-8 h-8 text-gray-900 shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">Your Safety, Our Priority</h3>
                  <p className="text-[11px] text-gray-500 leading-snug">All our parking facilities are verified and monitored 24x7 for your safety.</p>
                </div>
              </div>
              <div className="p-5 flex items-center justify-around flex-[1.5] w-full bg-white">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Video className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  <div>
                    <p className="font-bold text-[11px] text-gray-900">24x7 CCTV</p>
                    <p className="text-[9px] text-gray-500">Surveillance</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Key className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  <div>
                    <p className="font-bold text-[11px] text-gray-900">Secure Entry</p>
                    <p className="text-[9px] text-gray-500">Digital Access</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Lightbulb className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  <div>
                    <p className="font-bold text-[11px] text-gray-900">Well Lit</p>
                    <p className="text-[9px] text-gray-500">Parking Areas</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        )}

        {/* Middle Column - Payment Method */}
        {step === 2 && (
        <div className="flex-[1.5] space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-4">UPI</p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">Google Pay</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors bg-[#5f259f]">
                      <span className="text-white font-bold text-[10px]">PhonePe</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">PhonePe</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors bg-[#002e6e]">
                      <span className="text-white font-bold text-xs">Paytm</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">Paytm</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors">
                      <span className="text-emerald-600 font-bold text-xs">BHIM</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">BHIM</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-4">Cards</p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="VISA" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">VISA</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">Mastercard</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors">
                      <span className="text-blue-800 font-bold text-[10px]">RuPay</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">RuPay</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors bg-gray-50 text-gray-500 font-bold">
                      •••
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">More</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-4">Wallets</p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors bg-[#002e6e]">
                      <span className="text-white font-bold text-xs">Paytm</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">Paytm</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors bg-blue-600 text-white font-bold text-lg">
                      M
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">Mobikwik</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors text-orange-500 font-bold italic text-lg">
                      f
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">Freecharge</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5 group-hover:border-black transition-colors bg-blue-500 text-white font-bold text-sm">
                      Jio
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center">JioMoney</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-4">More Options</p>
                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                      <span className="text-xs font-bold font-serif">III</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Net Banking</p>
                      <p className="text-[11px] text-gray-500">All major banks supported</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="pt-4 text-center">
                <p className="text-xs font-medium text-gray-500 flex items-center justify-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% Secure Payments</p>
              </div>
            </div>
          </Card>
        </div>
        )}
        
        {step === 3 && (
        <div className="flex-[1.5] space-y-6">
          <Card className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-8 max-w-md">Your parking slot at Empress Mall has been successfully booked. You can now navigate to your spot using the digital twin.</p>
            
            <Button variant="primary" className="h-12 px-8 text-base shadow-sm" onClick={() => setStep(4)}>
              Start Navigation <Navigation className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
        )}
        
        {step === 4 && (
        <div className="flex-[1.5] space-y-6">
          <Card className="p-0 overflow-hidden h-[500px] relative">
             <div className="absolute inset-0 bg-gray-900 flex items-center justify-center flex-col">
               <Navigation className="w-16 h-16 text-brand-500 mb-4 animate-bounce" />
               <h3 className="text-xl font-bold text-white mb-2">Navigating to Slot B-14</h3>
               <p className="text-gray-400 text-sm">Follow the highlighted path on your screen</p>
               <Button variant="primary" className="mt-8" onClick={() => navigate('/customer/bookings')}>View Ticket</Button>
             </div>
          </Card>
        </div>
        )}

        {/* Right Column - Booking Summary */}
        {step < 3 && (
        <div className="flex-1 space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Booking Summary</h2>
            
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=200&h=200" alt="Parking" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-tight">Empress Mall Parking</h3>
                <p className="text-[11px] text-gray-500 mb-2">Sitabuldi, Nagpur</p>
                <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                  <Star className="w-3.5 h-3.5 text-gray-900 fill-gray-900" />
                  4.6 <span className="text-gray-400">(120 reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="text-gray-900 font-bold">
                  {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Entry Time</span>
                <span className="text-gray-900 font-bold">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Duration</span>
                <span className="text-gray-900 font-bold">2 Hours</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Exit Time</span>
                <span className="text-gray-900 font-bold">12:00 PM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Slot Type</span>
                <span className="text-gray-900 font-bold">Normal</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Vehicle</span>
                <span className="text-gray-900 font-bold">MH 31 AB 1234</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Parking Charges</span>
                <span className="text-gray-900 font-bold">₹60.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Convenience Fee</span>
                <span className="text-gray-900 font-bold">₹5.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-900 font-bold text-lg">Total Amount</span>
              <span className="text-gray-900 font-bold text-2xl">₹65.00</span>
            </div>

            <div className="space-y-3">
              {step === 1 ? (
                <Button variant="primary" className="w-full h-12 text-base shadow-sm" onClick={() => setStep(2)}>
                  Proceed to Payment
                </Button>
              ) : (
                <Button variant="primary" className="w-full h-12 text-base shadow-sm" onClick={() => setStep(3)}>
                  Proceed to Pay
                </Button>
              )}
              <Button variant="outline" className="w-full h-12 bg-white">
                <Ticket className="w-4 h-4 mr-2 text-gray-600" /> Apply Coupon
              </Button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden divide-y divide-gray-100">
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-gray-900">Free cancellation</p>
                <p className="text-[11px] text-gray-500">Up to 30 mins before entry</p>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-gray-900">Safe & Secure</p>
                <p className="text-[11px] text-gray-500">24x7 CCTV & Security</p>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-gray-900">Instant Confirmation</p>
                <p className="text-[11px] text-gray-500">Get booking in seconds</p>
              </div>
            </div>
          </Card>
        </div>
        )}
      </div>
    </div>
  );
}
