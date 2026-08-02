import type { ReactNode } from 'react';
import { useCallback, useRef, useMemo } from 'react';
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color?: string; // Hex color or standard string
  title?: string;
  icon?: google.maps.Icon | google.maps.Symbol;
}

interface SharedMapProps {
  center: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  className?: string;
  children?: ReactNode; // For drawing custom overlays or routes
  useClustering?: boolean;
}

import { useThemeStore } from '../../store';

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

export function SharedMap({
  center,
  zoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
  className = 'w-full h-full',
  children,
  useClustering = false,
}: SharedMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const renderMarkers = () => {
    if (useClustering) {
      return (
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => onMarkerClick?.(marker)}
                  title={marker.title}
                  icon={marker.icon}
                  clusterer={clusterer}
                />
              ))}
            </>
          )}
        </MarkerClusterer>
      );
    }

    return markers.map((marker) => (
      <Marker
        key={marker.id}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={() => onMarkerClick?.(marker)}
        title={marker.title}
        icon={marker.icon}
      />
    ));
  };

  const { theme } = useThemeStore();

  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    styles: theme === 'dark' ? darkEnterpriseMapStyles : undefined,
  }), [theme]);

  if (!isLoaded) {
    return (
      <div className={`${className} bg-[#F9FAFB] dark:bg-[#0A0F1C] flex items-center justify-center`}>
        <span className="text-slate-500 dark:text-[#A1A6C4] font-medium text-sm">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className={`${className} bg-[#F9FAFB] dark:bg-[#0A0F1C]`}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={mapOptions}
      >
        {renderMarkers()}
        {children}
      </GoogleMap>
    </div>
  );
}
