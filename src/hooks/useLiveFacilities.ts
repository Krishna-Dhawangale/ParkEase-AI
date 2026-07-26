import { useState, useEffect } from 'react';

export function useLiveFacilities() {
  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem('parkease_client_facilities');
      if (data) {
        const parsed = JSON.parse(data);
        const liveFacilities = parsed
          .filter((f: any) => f.status === 'LIVE')
          .map((f: any) => {
            const amenities = [];
            if (f.hasCctv) amenities.push('CCTV');
            if (f.hasEv) amenities.push('EV Charging');
            if (f.isCovered) amenities.push('Covered');
            if (f.hasValet) amenities.push('Valet');
            
            return {
              id: f.id,
              name: f.name,
              address: `${f.address}, ${f.city}`,
              distance: Math.round(Math.random() * 5 * 10) / 10 + 0.1, // mock
              walkTime: Math.round(Math.random() * 10) + 2,
              price: f.pricing?.hourlyRate || 50,
              priceUnit: 'hr',
              available: Math.floor(f.totalCapacity * 0.4), // mock
              total: f.totalCapacity,
              rating: 4.5 + Math.random() * 0.5,
              reviews: Math.floor(Math.random() * 500) + 50,
              security: 5,
              aiRecommended: Math.random() > 0.5,
              greenScore: 80 + Math.floor(Math.random() * 20),
              hasEV: f.hasEv,
              isOpen: true,
              image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=220&fit=crop',
              amenities,
              coordinates: { lat: 12.9716, lng: 77.5946 }, // mock
            };
          });
        setFacilities(liveFacilities);
      }
    } catch (e) {
      console.error('Failed to load facilities', e);
    }
  }, []);

  return facilities;
}
