// src/components/LocationInput.tsx
import React, { useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

type Props = {
  index: number;
  onPlaceSelect: (index: number, place: { address: string; lat: number; lng: number }) => void;
};

const LocationInput: React.FC<Props> = ({ index, onPlaceSelect }) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry) {
      onPlaceSelect(index, {
        address: place.formatted_address || '',
        lat: place.geometry.location?.lat() || 0,
        lng: place.geometry.location?.lng() || 0,
      });
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search Destination..."
          className="w-full border rounded px-3 py-2"
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default LocationInput;
