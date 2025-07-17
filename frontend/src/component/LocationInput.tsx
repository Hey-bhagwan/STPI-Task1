// src/components/LocationInput.tsx
import React, { useRef, useState} from 'react';
import { Autocomplete } from '@react-google-maps/api';

type Props = {
  index: number;
  onPlaceSelect: (index: number, place: { address: string; lat: number; lng: number }) => void;
};

const LocationInput: React.FC<Props> = ({ index, onPlaceSelect }) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry) {
      const location = place.geometry.location;
      const formattedAddress = place.formatted_address || place.name || '';

      setInputValue(formattedAddress); // update input if not already

      if (location) {
        onPlaceSelect(index, {
          address: formattedAddress,
          lat: location.lat(),
          lng: location.lng(),
        });
      }
    }
  };

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        type="text"
        placeholder="Search Destination..."
        className="w-full border rounded px-3 py-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Autocomplete>
  );
};

export default LocationInput;

