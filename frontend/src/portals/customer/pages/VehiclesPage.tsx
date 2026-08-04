import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, Plus, Star, MoreHorizontal, Fuel, Tag, Zap, ChevronRight,
  X, CheckCircle2, ShieldCheck, Check, Trash2, Edit3, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  bodyType: 'Hatchback' | 'Sedan' | 'SUV' | 'EV' | 'Bike';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  color: string;
  isPrimary: boolean;
  image: string;
}

export function VehiclesPage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('parkease-vehicles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Persist to localStorage whenever vehicles state changes
  React.useEffect(() => {
    localStorage.setItem('parkease-vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [bodyType, setBodyType] = useState<'Hatchback' | 'Sedan' | 'SUV' | 'EV' | 'Bike'>('Hatchback');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG'>('Petrol');
  const [color, setColor] = useState('White');
  const [isPrimary, setIsPrimary] = useState(false);

  // Preferences State
  const [preferredParking, setPreferredParking] = useState<'Covered Parking' | 'Open Parking' | 'Valet Parking'>('Covered Parking');
  const [evCharging, setEvCharging] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSetPrimary = (id: string) => {
    setVehicles(prev => prev.map(v => ({
      ...v,
      isPrimary: v.id === id
    })));
    const primaryVehicle = vehicles.find(v => v.id === id);
    if (primaryVehicle) {
      showToast(`${primaryVehicle.plate} set as Primary vehicle!`);
    }
  };

  const handleDeleteVehicle = (id: string) => {
    const vToDelete = vehicles.find(v => v.id === id);
    setVehicles(prev => prev.filter(v => v.id !== id));
    showToast(`Vehicle ${vToDelete?.plate || ''} removed successfully.`);
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !model) return;

    const newVehicle: Vehicle = {
      id: `v-${Date.now()}`,
      plate: plate.toUpperCase(),
      model,
      bodyType,
      fuelType,
      color,
      isPrimary: isPrimary || vehicles.length === 0,
      image: fuelType === 'Electric' 
        ? 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=300&h=200' 
        : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=300&h=200'
    };

    if (newVehicle.isPrimary) {
      setVehicles(prev => prev.map(v => ({ ...v, isPrimary: false })).concat(newVehicle));
    } else {
      setVehicles(prev => [...prev, newVehicle]);
    }

    setIsAddModalOpen(false);
    setPlate('');
    setModel('');
    setIsPrimary(false);
    showToast(`Vehicle ${newVehicle.plate} added successfully!`);
  };

  const primaryVehicle = vehicles.find(v => v.isPrimary) || vehicles[0];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans pb-24">
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

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vehicles</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Manage your vehicles for faster bookings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-black text-white font-semibold py-2.5 px-5 rounded-xl text-xs md:text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Your Vehicles Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Vehicles ({vehicles.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              <div>
                {/* Top Badge & Menu */}
                <div className="flex items-center justify-between mb-4 min-h-[24px]">
                  {vehicle.isPrimary ? (
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Primary
                    </span>
                  ) : <div />}

                  <button 
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    title="Remove Vehicle"
                    className="p-1 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.model} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate tracking-tight">{vehicle.plate}</h3>
                    <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{vehicle.model}</p>
                    <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-md mt-2">
                      {vehicle.bodyType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Meta Row */}
              <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-gray-400" />
                  <span>{vehicle.fuelType}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                  <span>{vehicle.color}</span>
                </div>

                {vehicle.isPrimary ? (
                  <div className="flex items-center gap-1 text-gray-900 font-bold">
                    <Star className="w-3.5 h-3.5 fill-black text-black" />
                    <span>Primary</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleSetPrimary(vehicle.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-black font-medium transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-gray-400" />
                    <span>Set as Primary</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Vehicle Dashed Card */}
          <div 
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-gray-200 rounded-3xl p-6 bg-gray-50/40 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]"
          >
            <div className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Add Vehicle</h3>
              <p className="text-xs text-gray-400 max-w-[180px] mt-0.5">
                Add a new vehicle for seamless parking.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Parking Preferences Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Parking Preferences</h2>
          <p className="text-xs text-gray-500 font-normal mt-0.5">
            Set your preferences to get a better parking experience.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-7 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Default Vehicle */}
          <div className="flex items-start justify-between gap-4 pt-4 md:pt-0 md:pr-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Default Vehicle</h3>
                <p className="text-xs text-gray-400 mt-0.5 mb-3">Select your default vehicle for quicker bookings.</p>
                {primaryVehicle ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{primaryVehicle.plate}</span>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No vehicles</span>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1 cursor-pointer hover:text-black" />
          </div>

          {/* Preferred Parking */}
          <div className="flex items-start justify-between gap-4 pt-6 md:pt-0 md:px-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 font-bold text-lg">
                P
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Preferred Parking</h3>
                <p className="text-xs text-gray-400 mt-0.5 mb-3">Choose your preferred parking type.</p>
                <button 
                  onClick={() => setPreferredParking(prev => prev === 'Covered Parking' ? 'Open Parking' : 'Covered Parking')}
                  className="text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors block"
                >
                  {preferredParking}
                </button>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1 cursor-pointer hover:text-black" />
          </div>

          {/* EV Charging */}
          <div className="flex items-start justify-between gap-4 pt-6 md:pt-0 md:pl-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">EV Charging</h3>
                <p className="text-xs text-gray-400 mt-0.5 mb-3">Prefer parking spots with EV charging facilities.</p>
                <button 
                  onClick={() => setEvCharging(!evCharging)}
                  className="text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors block"
                >
                  {evCharging ? 'Preferred' : 'Not Required'}
                </button>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1 cursor-pointer hover:text-black" />
          </div>

        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-gray-100"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Add New Vehicle</h3>
                    <p className="text-xs text-gray-500">Register license plate and vehicle details</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">License Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH 31 AB 1234"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle Model & Make</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maruti Suzuki Baleno"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Body Type</label>
                    <select
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    >
                      <option value="Hatchback">Hatchback</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="EV">Electric / EV</option>
                      <option value="Bike">Two Wheeler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fuel Type</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. White"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPrimary}
                        onChange={(e) => setIsPrimary(e.target.checked)}
                        className="w-4 h-4 rounded text-black focus:ring-black"
                      />
                      <span className="text-xs font-semibold text-gray-800">Set as Primary</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors shadow-md mt-4"
                >
                  Save Vehicle
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
