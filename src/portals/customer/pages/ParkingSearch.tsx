import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Map as MapIcon, List, SlidersHorizontal, RotateCcw,
  Bookmark, Star, MapPin, Navigation, Info, Car, Shield, Clock,
  Zap, ChevronDown, Check, Settings
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useJsApiLoader, GoogleMap, MarkerF, InfoWindowF, DirectionsRenderer, PolylineF } from '@react-google-maps/api';
import { Badge } from '../../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../../lib/firebase';

import { useThemeStore } from '../../../store';

const darkEnterpriseMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0A0F1C' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A0F1C' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#A1A6C4' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#A855F7' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#7C3AED' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#111628' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#22C55E' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#161D36' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#232A45' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6B7280' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1B2345' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#7C3AED' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#F8FAFC' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B132B' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3B82F6' }] },
];

const lightMapStyles: google.maps.MapTypeStyle[] = [
  { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#333333" }] },
  { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
  { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] }
];

export function ParkingSearchPage() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded: isJsLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const isLoaded = isJsLoaded || (typeof window !== 'undefined' && Boolean((window as any).google?.maps));

  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 21.1458, lng: 79.0882 }); // Nagpur Center
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => console.warn("Location permission denied or timed out", error),
        { timeout: 1200, maximumAge: 600000, enableHighAccuracy: false }
      );
    }
  }, []);

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: theme === 'dark' ? darkEnterpriseMapStyles : lightMapStyles
  }), [theme]);

  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    const facilitiesRef = ref(db, 'facilities');
    
    const unsubscribe = onValue(facilitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setFacilities([]);
        return;
      }
      
      const parsed = Object.values(data);
      // Show all facilities on the map for the demo (including DRAFT, PENDING_APPROVAL, etc)
      let live = parsed;
      
      const uiFacilities = live.map((f: any, idx: number) => {
        const images = [
          'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=300&h=200',
          'https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&q=80&w=300&h=200',
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=300&h=200'
        ];
        // Calculate dynamic values
        const capacity = f.totalCapacity || 50;
        const slots = capacity; // Base slots, simulated websocket will alter this
        const price = f.pricing?.hourlyRate || 30;
        
        const availability = capacity > 0 ? (slots / capacity) * 100 : 0;
        let status = 'High';
        if (availability < 20) status = 'Low';
        else if (availability < 50) status = 'Medium';
        
        return {
          id: f.id, 
          name: f.name, 
          address: `${f.city}, ${f.state}`,
          distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
          slots: slots, 
          capacity: capacity,
          rating: (4.0 + Math.random()).toFixed(1), 
          reviews: Math.floor(Math.random() * 200) + 10,
          price: price,
          image: images[idx % images.length], 
          status,
          lat: Number(f.latitude) || 21.1458, 
          lng: Number(f.longitude) || 79.0882,
          _lastUpdated: 0
        };
      });
      
      setFacilities(uiFacilities);
    });
    
    // Simulate WebSocket for real-time occupancy updates
    const wsInterval = setInterval(() => {
      setFacilities(prev => prev.map(f => {
        if (Math.random() > 0.6) {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
          const newSlots = Math.max(0, Math.min(f.capacity, f.slots + change));
          
          const availability = (newSlots / f.capacity) * 100;
          let newStatus = 'High';
          if (availability < 20) newStatus = 'Low';
          else if (availability < 50) newStatus = 'Medium';

          return { ...f, slots: newSlots, status: newStatus, _lastUpdated: Date.now() };
        }
        return f;
      }));
    }, 4000);

    return () => {
      off(facilitiesRef, 'value', unsubscribe);
      clearInterval(wsInterval);
    };
  }, []);

  // Fetch Route via Google Maps Directions API when a facility is selected
  useEffect(() => {
    if (selectedFacility && isLoaded && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation || mapCenter,
          destination: { lat: selectedFacility.lat, lng: selectedFacility.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            setDirectionsResponse(null);
            console.error(`[Directions API] Failed: ${status}`);
            // If the map is rejecting the route, we just don't draw anything instead of drawing a straight line.
          }
        }
      );
    } else {
      setDirectionsResponse(null);
    }
  }, [selectedFacility, isLoaded]);

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-white dark:bg-[#0A0F1C] overflow-hidden">
      {/* Sleek Filters Header */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="shrink-0 px-4 md:px-6 py-4 border-b border-gray-100 dark:border-[#232A45] bg-white dark:bg-[#161D36] z-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Find Parking in Nagpur</h1>
            <p className="text-sm text-gray-500 dark:text-[#A1A6C4] mt-1">Live availability & instant booking</p>
          </div>
          
          <div className="flex items-center p-1 bg-gray-100 dark:bg-[#111628] rounded-lg self-start sm:self-auto shrink-0">
            <button 
              onClick={() => setView('map')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'map' ? 'bg-white dark:bg-[#7C3AED] text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-[#A1A6C4] hover:text-gray-900 dark:hover:text-white'}`}
            >
              <MapIcon className="w-4 h-4" /> Map View
            </button>
            <button 
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'list' ? 'bg-white dark:bg-[#7C3AED] text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-[#A1A6C4] hover:text-gray-900 dark:hover:text-white'}`}
            >
              <List className="w-4 h-4" /> List View
            </button>
          </div>
        </div>

        {/* Clean Filter Chips */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          <button className="shrink-0 h-9 px-5 rounded-full bg-black dark:bg-[#7C3AED] text-white text-sm font-medium shadow hover:bg-gray-900 dark:hover:bg-[#8B5CF6] transition-all">
            All Spots
          </button>
          <button className="shrink-0 h-9 px-4 rounded-full border border-gray-200 dark:border-[#232A45] bg-white dark:bg-[#111628] text-gray-600 dark:text-[#A1A6C4] text-sm hover:border-gray-300 dark:hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-[#161D36] transition-all flex items-center gap-2">
            Commercial
          </button>
          <button className="shrink-0 h-9 px-4 rounded-full border border-gray-200 dark:border-[#232A45] bg-white dark:bg-[#111628] text-gray-600 dark:text-[#A1A6C4] text-sm hover:border-gray-300 dark:hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-[#161D36] transition-all flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" /> EV Chargers
          </button>
          <div className="ml-auto shrink-0 sticky right-0 bg-gradient-to-l from-white dark:from-[#161D36] via-white dark:via-[#161D36] to-transparent pl-4">
            <button className="h-9 px-4 rounded-full border border-gray-200 dark:border-[#232A45] md:border-transparent bg-white dark:bg-[#111628] text-gray-500 dark:text-[#A1A6C4] text-sm hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#161D36] transition-all flex items-center gap-2 shadow-sm md:shadow-none">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* List View - Narrower & Cleaner. Includes Lenis stopPropagation fix */}
        <div 
          data-lenis-prevent="true" 
          onWheel={(e) => e.stopPropagation()} 
          className={`shrink-0 border-r border-gray-100 dark:border-[#232A45] overflow-y-auto p-4 bg-gray-50/30 dark:bg-[#0A0F1C] transition-all duration-300 ${view === 'list' ? 'w-full md:w-[400px] lg:w-[450px] border-r-0 md:border-r' : 'hidden md:block w-[400px] lg:w-[450px]'}`}
        >
          <AnimatePresence>
            {facilities.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-48 text-center text-gray-500 dark:text-[#A1A6C4]">
                <div className="w-12 h-12 bg-gray-100 dark:bg-[#161D36] rounded-full flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-gray-400 dark:text-[#A1A6C4]" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white">No active facilities found</p>
                <p className="text-sm mt-1">Check back later or search another area.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {facilities.map((f, idx) => (
                  <motion.div
                    layout
                    key={f.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      boxShadow: f._lastUpdated && Date.now() - f._lastUpdated < 1500 ? '0 0 0 2px rgba(16, 185, 129, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedFacility(f);
                      if (view === 'list') setView('map');
                    }}
                    className={`cursor-pointer bg-white dark:bg-[#161D36] rounded-2xl p-3 border transition-all ${
                      selectedFacility?.id === f.id ? 'border-black dark:border-[#7C3AED] ring-1 ring-black/5 dark:ring-purple-500/30' : 'border-gray-200 dark:border-[#232A45] hover:border-gray-300 dark:hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex gap-4 h-28">
                      <div className="w-28 shrink-0 relative overflow-hidden rounded-xl bg-gray-100 dark:bg-[#111628]">
                        <img src={f.image} alt={f.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1 pr-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 dark:text-white text-[15px] leading-tight truncate">{f.name}</h3>
                            <div className="flex items-center text-xs font-medium text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-[#111628] px-1.5 py-0.5 rounded ml-2">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                              {f.rating}
                            </div>
                          </div>
                          <p className="text-[13px] text-gray-500 dark:text-[#A1A6C4] mt-1">{f.distance} away</p>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <div className="flex flex-col">
                            <span className="text-[11px] text-gray-400 dark:text-slate-400 font-medium uppercase tracking-wider">Available</span>
                            <motion.span 
                              key={f.slots}
                              initial={{ scale: 1.1, color: '#059669' }}
                              animate={{ scale: 1, color: f.status === 'High' ? '#059669' : f.status === 'Medium' ? '#d97706' : '#dc2626' }}
                              className="font-bold text-sm"
                            >
                              {f.slots} slots
                            </motion.span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-gray-900 dark:text-white">₹{f.price}</span><span className="text-[11px] text-gray-500 dark:text-[#A1A6C4]">/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Map View */}
        <div className={`flex-1 relative bg-[#F9FAFB] dark:bg-[#0A0F1C] ${view === 'list' ? 'hidden md:block' : 'block'}`}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={13}
              options={mapOptions}
              onClick={() => setSelectedFacility(null)} 
            >
              {facilities.map((f) => (
                <MarkerF
                  key={f.id}
                  position={{ lat: f.lat, lng: f.lng }}
                  onClick={() => setSelectedFacility(f)}
                  animation={f._lastUpdated && Date.now() - f._lastUpdated < 1500 ? window.google.maps.Animation.BOUNCE : undefined}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C11.1634 0 4 7.16344 4 16C4 28 20 40 20 40C20 40 36 28 36 16C36 7.16344 28.8366 0 20 0Z" fill="${selectedFacility?.id === f.id ? (theme === 'dark' ? '#7C3AED' : '#000000') : (theme === 'dark' ? '#111628' : '#111827')}"/><circle cx="20" cy="16" r="10" fill="white"/><text x="20" y="21" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="${selectedFacility?.id === f.id ? (theme === 'dark' ? '#7C3AED' : '#000000') : (theme === 'dark' ? '#111628' : '#111827')}">P</text></svg>`),
                    scaledSize: new window.google.maps.Size(selectedFacility?.id === f.id ? 44 : 36, selectedFacility?.id === f.id ? 44 : 36),
                    anchor: new window.google.maps.Point(selectedFacility?.id === f.id ? 22 : 18, selectedFacility?.id === f.id ? 44 : 36)
                  }}
                />
              ))}

              {/* Render Navigation Route via API */}
              {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  options={{
                    suppressMarkers: true, 
                    polylineOptions: {
                      strokeColor: theme === 'dark' ? '#7C3AED' : '#3b82f6',
                      strokeWeight: 5,
                      strokeOpacity: 0.8,
                    }
                  }}
                />
              )}

              {/* User Location Marker */}
              {userLocation && (
                <MarkerF
                    position={userLocation}
                    icon={{
                      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#3b82f6" fill-opacity="0.2"/><circle cx="12" cy="12" r="6" fill="#3b82f6"/><circle cx="12" cy="12" r="3" fill="white"/></svg>'),
                      scaledSize: new window.google.maps.Size(24, 24),
                      anchor: new window.google.maps.Point(12, 12)
                    }}
                    title="Your Location"
                />
              )}

              {selectedFacility && (
                <InfoWindowF
                  position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                  onCloseClick={() => setSelectedFacility(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -32) }}
                >
                  <div className="p-2 w-48 text-black dark:text-white bg-white dark:bg-[#161D36] rounded-lg">
                    <h3 className="font-bold text-sm mb-1">{selectedFacility.name}</h3>
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <span className={`w-2 h-2 rounded-full ${selectedFacility.status === 'High' ? 'bg-emerald-500' : selectedFacility.status === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedFacility.slots} Slots</span>
                    </div>
                    <Button size="sm" className="w-full h-8 text-xs bg-black dark:bg-[#7C3AED] hover:bg-gray-800 dark:hover:bg-[#8B5CF6] text-white" onClick={() => navigate(`/customer/parking/${selectedFacility.id}`)}>
                      Book ₹{selectedFacility.price}/hr
                    </Button>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-[#0A0F1C]">
              <span className="text-gray-500 dark:text-[#A1A6C4] text-sm font-medium">Loading Map...</span>
            </div>
          )}
             
          {/* Minimal Map Legend */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 right-6 bg-white/95 dark:bg-[#161D36]/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 dark:border-[#232A45] px-4 py-2 flex flex-col gap-2"
          >
            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-400 font-bold mb-1">Availability</div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div> High (20+)
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-200">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-sm"></div> Limited
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-200">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></div> Full
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
