import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, CreditCard, ChevronRight, Shield, Check, Star, Tag, Gem
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export function Payments() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 font-medium">
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer')}>Home</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Payments</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payment Methods</h1>
          <p className="text-gray-500 mt-1">Manage your saved cards, UPI IDs, and wallets.</p>
        </div>
        <Button className="bg-black text-white px-5 rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add New Method
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column */}
        <div className="flex-[1.5] space-y-6">
          
          {/* Saved Cards */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-6">Saved Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-start gap-4 hover:border-black transition-colors cursor-pointer group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="VISA" />
                <div className="flex-1 w-full">
                  <p className="text-[11px] text-gray-500 font-medium">Visa Credit Card</p>
                  <p className="font-bold text-gray-900 text-[13px] tracking-wide mt-1 mb-2">**** **** **** 4242</p>
                  <div className="flex justify-between items-center w-full">
                    <Badge className="bg-black text-white text-[9px] px-2 py-0.5 border-none">Primary</Badge>
                    <span className="text-xs text-gray-400 group-hover:text-black font-medium transition-colors">Edit</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-start gap-4 hover:border-black transition-colors cursor-pointer group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                <div className="flex-1 w-full">
                  <p className="text-[11px] text-gray-500 font-medium">Mastercard</p>
                  <p className="font-bold text-gray-900 text-[13px] tracking-wide mt-1 mb-2">**** **** **** 5555</p>
                  <div className="flex justify-end items-center w-full">
                    <span className="text-xs text-gray-400 group-hover:text-black font-medium transition-colors">Edit</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 text-center min-h-[140px]">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Add New Card</span>
              </div>
            </div>
          </Card>

          {/* UPI */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-6">UPI & Wallets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-2 cursor-pointer group p-4 border border-gray-100 rounded-xl hover:border-black transition-colors">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center p-2.5">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-bold text-gray-900 mt-1">Google Pay</span>
                <span className="text-[9px] text-emerald-600 font-medium">Linked</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 cursor-pointer group p-4 border border-gray-100 rounded-xl hover:border-black transition-colors">
                <div className="w-12 h-12 rounded-full flex items-center justify-center p-2.5 bg-[#5f259f]">
                  <span className="text-white font-bold text-[10px]">PhonePe</span>
                </div>
                <span className="text-[11px] font-bold text-gray-900 mt-1">PhonePe</span>
                <span className="text-[9px] text-gray-400 font-medium group-hover:text-black">Link</span>
              </div>

              <div className="flex flex-col items-center gap-2 cursor-pointer group p-4 border border-gray-100 rounded-xl hover:border-black transition-colors">
                <div className="w-12 h-12 rounded-full flex items-center justify-center p-2.5 bg-[#002e6e]">
                  <span className="text-white font-bold text-xs">Paytm</span>
                </div>
                <span className="text-[11px] font-bold text-gray-900 mt-1">Paytm</span>
                <span className="text-[9px] text-gray-400 font-medium group-hover:text-black">Link</span>
              </div>

              <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 text-center">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">Add UPI ID</span>
              </div>
            </div>
          </Card>

          {/* Other Payment Gateways */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Payment Gateways</h3>
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors mb-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="text-sm font-bold tracking-tighter">Razorpay</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Razorpay Checkout</p>
                  <p className="text-[11px] text-gray-500">Pay using multiple options via Razorpay</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                  <span className="text-xs font-bold font-serif">III</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Net Banking</p>
                  <p className="text-[11px] text-gray-500">All major banks supported</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          
          <Card className="p-6 bg-gray-50/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">100% Secure Payments</h3>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Your payment details are encrypted and securely stored. We never share your card information with parking facilities.</p>
              </div>
            </div>
          </Card>

          {/* Offers & Cashback */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-6">Offers & Discounts</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors cursor-pointer group">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight group-hover:text-blue-600 transition-colors">Flat 10% Cashback</h4>
                    <p className="text-[11px] text-gray-500">On your first payment via UPI</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">CASHBACK</span>
                  <span className="text-[10px] font-medium text-gray-500">Apply Code: NEWUPI10</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors cursor-pointer group">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight group-hover:text-blue-600 transition-colors">5% Instant Discount</h4>
                    <p className="text-[11px] text-gray-500">On all Visa Credit Cards</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">DISCOUNT</span>
                  <span className="text-[10px] font-medium text-gray-500">Auto applied at checkout</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
