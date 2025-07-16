import React, { useEffect, useState, useCallback } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};



type Props = {
  route: string[]; // list of full address strings
};

const center = { lat: 12.9716, lng: 77.5946 }; // Bengaluru

const RouteMap: React.FC<Props> = ({ route }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchDirections = useCallback(() => {
    if (route.length < 2) {
      console.warn('Not enough locations to plot route');
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    // console.log('📦 Fetching directions for route:', route);

    directionsService.route(
      {
        origin: route[0],
        destination: route[route.length - 1],
        waypoints: route.slice(1, -1).map((location) => ({
          location,
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          // console.log('✅ Directions result:', result);
          setDirections(result);
        } else {
          console.error('❌ DirectionsService failed:', status, result);
        }
      }
    );
  }, [route.join('|')]);

  useEffect(() => {
    if (mapLoaded) {
      fetchDirections();
    }
  }, [fetchDirections, mapLoaded]);

  return (
    
      <div style={{ position: 'relative' }}>
        {!directions && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
            <span className="text-lg font-semibold text-gray-700">Loading route...</span>
          </div>
        )}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={() => setMapLoaded(true)}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    
  );
};

export default RouteMap;
