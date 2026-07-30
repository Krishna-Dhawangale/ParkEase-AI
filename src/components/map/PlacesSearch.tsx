import { useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { Search, MapPin } from 'lucide-react';

interface PlacesSearchProps {
  onSelect: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
  className?: string;
}

export function PlacesSearch({ onSelect, placeholder = 'Search location...', className = '' }: PlacesSearchProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed, e.g. restrict to a country */
    },
    debounce: 300,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = ({ description }: { description: string }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();
    setIsOpen(false);

    // Get latitude and longitude via utility functions
    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      onSelect(lat, lng, description);
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/50 transition-all"
        />
      </div>
      
      {status === 'OK' && isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
              <li
                key={place_id}
                onClick={handleSelect(suggestion)}
                className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-start gap-3 transition-colors border-b border-white/5 last:border-0"
              >
                <MapPin className="w-5 h-5 text-[var(--brand)] shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium text-sm">{main_text}</div>
                  <div className="text-white/50 text-xs">{secondary_text}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
