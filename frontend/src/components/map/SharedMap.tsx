import type { ReactNode } from 'react';
import { useCallback, useRef } from 'react';
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

const defaultOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ],
};

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

  if (!isLoaded) {
    return (
      <div className={`${className} bg-slate-100 dark:bg-slate-800 flex items-center justify-center`}>
        <span className="text-slate-500 font-medium text-sm">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={defaultOptions}
      >
        {renderMarkers()}
        {children}
      </GoogleMap>
    </div>
  );
}
