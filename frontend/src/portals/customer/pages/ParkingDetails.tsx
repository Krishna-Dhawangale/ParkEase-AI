import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Bookmark, Star, MapPin, Navigation, Car, Shield, 
  Clock, Zap, Check, ChevronLeft, ChevronRight, Share2, Lightbulb, Loader2, Box, X, Filter
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { GlowingCard } from '../../../components/ui/GlowingCard';
import { useJsApiLoader, GoogleMap, MarkerF, DirectionsRenderer, PolylineF } from '@react-google-maps/api';
import { RevealTransition } from '../../../components/motion/RevealTransition';
import { ref, get, child } from 'firebase/database';
import { db } from '../../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

export function ParkingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('Basement B1');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [facility, setFacility] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [fallbackRoute, setFallbackRoute] = useState<google.maps.LatLngLiteral[] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const defaultCenter = { lat: 21.1458, lng: 79.0882 };

  useEffect(() => {
    const fetchFacility = async () => {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `facilities/${id}`));
      if (snapshot.exists()) {
        const f = snapshot.val();
        setFacility({
          ...f,
          coordinates: { lat: Number(f.latitude) || 21.1458, lng: Number(f.longitude) || 79.0882 },
          capacity: f.totalCapacity || 50,
          slots: f.totalCapacity || 50
        });
      }
    };
    if (id) fetchFacility();
  }, [id]);

  const facilityLocation = facility?.coordinates || defaultCenter;
  const facilityName = facility?.name || 'Empress Mall Parking';

  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.warn("Location permission denied", error)
      );
    }
  }, []);

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#333333" }] },
      { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
      { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
      { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] }
    ]
  };

  const gallery = [
    'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=400&h=250',
    'https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&q=80&w=400&h=250',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400&h=250',
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400&h=250',
    'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?auto=format&fit=crop&q=80&w=400&h=250',
  ];

  const handleNavigate = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    setLocationError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(userLoc);
        
        if (window.google) {
          const directionsService = new window.google.maps.DirectionsService();
          
          directionsService.route(
            {
              origin: userLoc,
              destination: facilityLocation,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result: any, status: any) => {
              setIsLocating(false);
              if (status === window.google.maps.DirectionsStatus.OK) {
                setDirectionsResponse(result);
              } else {
                setDirectionsResponse(null);
                
                // Map Google Maps API error statuses to user-friendly messages
                let errorMsg = 'Failed to calculate route.';
                switch(status) {
                  case window.google.maps.DirectionsStatus.REQUEST_DENIED:
                    errorMsg = 'Google Maps Directions API is not enabled for this key.';
                    break;
                  case window.google.maps.DirectionsStatus.ZERO_RESULTS:
                    errorMsg = 'No driving route could be found between your location and the facility.';
                    break;
                  case window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
                    errorMsg = 'Google Maps API quota exceeded. Try again later.';
                    break;
                  case window.google.maps.DirectionsStatus.NOT_FOUND:
                  case window.google.maps.DirectionsStatus.INVALID_REQUEST:
                    errorMsg = 'Invalid location data provided to Google Maps.';
                    break;
                  default:
                    errorMsg = `Google Maps Error: ${status}`;
                }
                setLocationError(errorMsg);
              }
            }
          );

          // Start watching position for live updates
          if (navigator.geolocation && !(window as any).locationWatcher) {
            (window as any).locationWatcher = navigator.geolocation.watchPosition(
              (pos) => {
                const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserLocation(newLoc);
                // Optionally we could re-fetch route here, but to avoid API spam (OVER_QUERY_LIMIT), 
                // we'll just update the user's blue dot on the map.
              },
              (err) => console.warn('Location watch error', err),
              { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
          }
        } else {
          setIsLocating(false);
          setLocationError('Google Maps failed to load.');
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationError('Unable to retrieve your location. Please allow permissions.');
        console.error(error);
      }
    );
  };

  const handleOpenExternalMap = () => {
    let url = `https://www.google.com/maps/search/?api=1&query=${facilityLocation.lat},${facilityLocation.lng}`;
    if (userLocation) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${facilityLocation.lat},${facilityLocation.lng}&travelmode=driving`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 font-medium">
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer/search')}>Find Parking</span>
        <span className="mx-2">›</span>
        <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/customer/search')}>Search Results</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{facilityName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Details */}
        <div className="w-full lg:w-[400px] shrink-0 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{facilityName}</h1>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-500 mb-3">{facility?.city || 'Nagpur'} <span className="mx-1">•</span> 0.4 km away</p>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-900">4.6</span>
              <span className="text-gray-500">(120 reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-gray-100">
            <div className="flex flex-col items-center gap-1.5 text-gray-600">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50"><Zap className="w-5 h-5" /></div>
              <span className="text-[11px] font-medium text-center">EV Charging</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-gray-600">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50"><Car className="w-5 h-5" /></div>
              <span className="text-[11px] font-medium text-center">Covered</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-gray-600">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50"><img src="https://api.iconify.design/mdi:cctv.svg" className="w-5 h-5 opacity-60" alt="CCTV" /></div>
              <span className="text-[11px] font-medium text-center">CCTV</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-gray-600">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50"><Shield className="w-5 h-5" /></div>
              <span className="text-[11px] font-medium text-center leading-tight">24x7 Security</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-gray-600">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50"><Lightbulb className="w-5 h-5" /></div>
              <span className="text-[11px] font-medium text-center">Well Lit</span>
            </div>
          </div>

          <RevealTransition delay={0.1}>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-1">{facility?.slots || 9} / {facility?.capacity || 50} Slots Available</h3>
            <p className="text-xs text-gray-500 mb-4">Live Occupancy</p>
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${Math.max(0, 100 - ((facility?.slots || 9) / (facility?.capacity || 50) * 100))}%` }}></div>
            </div>
          </div>
          </RevealTransition>

          <RevealTransition delay={0.2} direction="up" className="sticky top-[100px] z-10 glassmorphism p-4 -mx-4 sm:mx-0 sm:p-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Price</p>
                <p className="text-xs text-gray-400">Inclusive of all taxes</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">₹30</span><span className="text-gray-500 font-medium"> /hr</span>
              </div>
            </div>
            
            <div className="space-y-3 mt-2">
              <Button variant="primary" className="w-full h-14 text-base font-bold" onClick={() => navigate('/customer/book', { state: { facilityId: id, facilityName: facility?.name, basePricePerHour: facility?.base_price_per_hour || facility?.basePricePerHour || 30, selectedSlotId: selectedSlot || undefined } })}>
                Book Now
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-12 bg-white text-gray-900 border-gray-300 font-bold hover:bg-gray-50 flex items-center justify-center gap-2 shadow-xs"
                onClick={() => setIsDigitalTwinOpen(true)}
              >
                <Box className="w-4 h-4 text-black" />
                👁 View Live Parking (Digital Twin)
              </Button>

              <Button 
                variant="outline" 
                className={`w-full h-12 ${isLocating ? 'opacity-70 cursor-not-allowed' : ''}`} 
                onClick={handleNavigate}
                disabled={isLocating}
              >
                {isLocating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Locating...</>
                ) : (
                  <><Navigation className="w-4 h-4 mr-2" /> Navigate</>
                )}
              </Button>
              {locationError && (
                <p className="text-xs text-red-500 text-center font-medium mt-1">{locationError}</p>
              )}
            </div>
          </div>
          </RevealTransition>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Parking Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4 text-sm">
                <span className="text-gray-500 shrink-0">Address</span>
                <span className="text-gray-900 text-right font-medium">{facility?.address || 'Sitabuldi, Nagpur, Maharashtra'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Timings</span>
                <span className="text-emerald-600 font-medium">Open 24 Hours</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Max Vehicle Height</span>
                <span className="text-gray-900 font-medium">2.1 m</span>
              </div>
              <div className="flex justify-between items-start text-sm">
                <span className="text-gray-500 shrink-0">Cancellation</span>
                <span className="text-gray-900 text-right font-medium">Free up to 30 mins before entry</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Map & Media */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Map Area */}
          <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border border-gray-200 bg-[#e5e3df]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={userLocation || facilityLocation}
                zoom={userLocation || directionsResponse || fallbackRoute ? 14 : 15}
                options={mapOptions}
              >
                {/* Destination Marker */}
                <MarkerF
                  position={facilityLocation}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C11.1634 0 4 7.16344 4 16C4 28 20 40 20 40C20 40 36 28 36 16C36 7.16344 28.8366 0 20 0Z" fill="black"/><circle cx="20" cy="16" r="10" fill="white"/><text x="20" y="21" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="black">P</text></svg>'),
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 32)
                  }}
                />

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

                {/* Directions Route */}
                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                    options={{
                      suppressMarkers: true, 
                      polylineOptions: {
                        strokeColor: '#3b82f6',
                        strokeWeight: 5,
                        strokeOpacity: 0.8,
                      }
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <span className="text-gray-500 font-medium">Loading Map...</span>
              </div>
            )}

              {/* Floating Route Card */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-64 z-10">
                <div className="flex items-center gap-2 font-bold text-sm mb-3 text-gray-900">
                  <Car className="w-4 h-4" /> Best Route
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg leading-none">
                      {directionsResponse?.routes[0]?.legs[0]?.distance?.text || '0.4 km'}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">Distance</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg leading-none">
                      {directionsResponse?.routes[0]?.legs[0]?.duration?.text || '2 mins'}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">Est. Time</p>
                  </div>
                </div>
                <Button onClick={handleOpenExternalMap} className="w-full h-10 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800">
                  Open in Map <Share2 className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
          </div>

          {/* Image Carousel */}
          <RevealTransition delay={0.3}>
          <div className="relative group">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
              {gallery.map((img, i) => (
                <div key={i} className="w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0 snap-start border border-gray-100">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer" />
                </div>
              ))}
            </div>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-gray-200">
              <ChevronLeft className="w-5 h-5 pr-0.5" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-gray-200">
              <ChevronRight className="w-5 h-5 pl-0.5" />
            </button>
          </div>
          </RevealTransition>

          {/* Bottom Grid */}
          <RevealTransition delay={0.4} staggerChildren>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Real-time Availability */}
            <GlowingCard className="p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Real-time Availability</h3>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-none gap-1.5 px-2.5 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live
                </Badge>
              </div>
              <div className="flex-1 flex items-center gap-6">
                <div className="relative w-28 h-28 shrink-0">
                  {/* SVG Donut Chart Mockup */}
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={`${251.2 * (1 - (facility?.slots || 9)/(facility?.capacity || 50))}`} strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#111827" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={`${251.2 * ((facility?.slots || 9)/(facility?.capacity || 50))}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-bold text-2xl text-gray-900 leading-none">{Math.round(((facility?.slots || 9)/(facility?.capacity || 50))*100)}%</span>
                    <span className="text-[10px] text-gray-500 font-medium">Available</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Available</div>
                    <span className="font-bold text-gray-900">{facility?.slots || 9}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div> Occupied</div>
                    <span className="font-bold text-gray-900">{(facility?.capacity || 50) - (facility?.slots || 9)}</span>
                  </div>
                </div>
              </div>
            </GlowingCard>

            {/* What People Say */}
            <GlowingCard className="p-5 flex flex-col xl:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">What People Say</h3>
                <span className="text-xs font-medium text-gray-500 hover:text-gray-900 cursor-pointer">View all</span>
              </div>
              <div className="space-y-5 flex-1">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shrink-0">A</div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 leading-tight">Amit Verma</p>
                        <p className="text-[10px] text-gray-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-gray-900 fill-gray-900" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">Very clean and safe parking. Easy entry and exit.</p>
                </div>
              </div>
            </GlowingCard>

          </div>
          </RevealTransition>
        </div>
      </div>

      {/* Contextual Digital Twin Modal */}
      <AnimatePresence>
        {isDigitalTwinOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDigitalTwinOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{facilityName}</h3>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Twin
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Real-time floor layout & slot availability inspection</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Floor Level Selector */}
                  <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['Basement B1', 'Ground Floor', 'Level P1'].map(floor => (
                      <button
                        key={floor}
                        onClick={() => setSelectedFloor(floor)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          selectedFloor === floor 
                            ? 'bg-white text-gray-900 shadow-xs' 
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {floor}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsDigitalTwinOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Digital Twin Viewport & Legend */}
              <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 shrink-0 text-xs">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-400"></span>
                    <span className="font-medium text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-gray-300 border border-gray-400"></span>
                    <span className="font-medium text-gray-700">Occupied</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-blue-100 border border-blue-400"></span>
                    <span className="font-medium text-gray-700">EV Charging</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400"></span>
                    <span className="font-medium text-gray-700">AI Recommended</span>
                  </div>
                </div>

                <div className="text-gray-500 text-xs">
                  Floor: <strong className="text-gray-900 font-bold">{selectedFloor}</strong> • Showing 24 slots
                </div>
              </div>

              {/* Slot Grid Viewport */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-inner relative min-h-[300px] flex flex-col justify-between">
                  {/* Gate Entry & Exit Annotations */}
                  <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>ENTRY BARRIER A</span>
                    </div>
                    <div className="text-amber-400 font-bold">
                      ELEVATOR & LOBBY ACCESS
                    </div>
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <span>EXIT BARRIER B</span>
                    </div>
                  </div>

                  {/* Slot Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 my-4">
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const slotId = `${selectedFloor === 'Basement B1' ? 'A' : selectedFloor === 'Ground Floor' ? 'G' : 'P'}-${(idx + 1).toString().padStart(2, '0')}`;
                      const isOccupied = [2, 5, 8, 11, 14, 19, 21].includes(idx);
                      const isEv = [3, 4, 12].includes(idx);
                      const isAiRec = idx === 6;
                      const isSelected = selectedSlot === slotId;

                      let bgClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30';
                      if (isOccupied) bgClass = 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed';
                      else if (isAiRec) bgClass = 'bg-amber-500/30 border-amber-400 text-amber-300 hover:bg-amber-500/40 ring-2 ring-amber-400/50';
                      else if (isEv) bgClass = 'bg-blue-500/20 border-blue-400 text-blue-300 hover:bg-blue-500/30';

                      if (isSelected) bgClass = 'bg-white border-white text-black ring-4 ring-white/50 font-bold scale-105';

                      return (
                        <button
                          key={slotId}
                          disabled={isOccupied}
                          onClick={() => setSelectedSlot(slotId)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[85px] relative group ${bgClass}`}
                        >
                          <span className="text-[10px] font-mono opacity-75">{slotId}</span>
                          
                          {isOccupied ? (
                            <Car className="w-5 h-5 opacity-40 my-1" />
                          ) : isEv ? (
                            <Zap className="w-5 h-5 text-blue-400 my-1" />
                          ) : isAiRec ? (
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400 my-1" />
                          ) : (
                            <Check className="w-4 h-4 opacity-80 my-1" />
                          )}

                          <span className="text-[9px] font-semibold uppercase tracking-wider">
                            {isOccupied ? 'Occupied' : isAiRec ? 'AI Best' : isEv ? 'EV Spot' : 'Free'}
                          </span>

                          {isAiRec && !isOccupied && (
                            <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[8px] font-black px-1 rounded-full">
                              AI
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono border-t border-gray-800 pt-2">
                    <span>SENSOR TELEMETRY: TLS 1.3 SYNC</span>
                    <span>LIVE OCCUPANCY: 70.8%</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div>
                  {selectedSlot ? (
                    <p className="text-xs text-gray-700">
                      Selected Slot: <strong className="text-gray-900 font-bold">{selectedSlot}</strong> ({selectedFloor})
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Click on any available spot above to pick your preferred slot.</p>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsDigitalTwinOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto text-xs font-bold py-2.5 px-6"
                    onClick={() => {
                      setIsDigitalTwinOpen(false);
                      navigate('/customer/book', { state: { facilityId: id, facilityName: facility?.name, basePricePerHour: facility?.base_price_per_hour || facility?.basePricePerHour || 30, selectedSlotId: selectedSlot || undefined } });
                    }}
                  >
                    Proceed with {selectedSlot || 'Selected Spot'}
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
