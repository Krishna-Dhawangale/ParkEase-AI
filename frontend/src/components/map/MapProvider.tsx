import type { ReactNode } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';

const LIBRARIES: ('places' | 'geometry' | 'drawing')[] = ['places', 'geometry'];
// Use dummy key if env variable is not set to prevent immediate crashing, though it will show development mode watermarks.
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'DUMMY_KEY';

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 text-red-500 text-sm">
        <p>Error loading Google Maps. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--brand)]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {GOOGLE_MAPS_API_KEY === 'DUMMY_KEY' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2">
          <span>⚠️ Using Demo Maps Key. Rate limits apply.</span>
          <a href="#" className="underline hover:text-amber-100" onClick={(e) => {
            e.preventDefault();
            alert("To fix this, create a .env file in the project root with VITE_GOOGLE_MAPS_API_KEY=your_key");
          }}>Fix</a>
        </div>
      )}
      {children}
    </div>
  );
}
