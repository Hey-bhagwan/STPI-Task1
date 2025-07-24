// App.tsx
import { LoadScript } from '@react-google-maps/api';
import { Analytics } from "@vercel/analytics/react";
import MedicineTSP from './component/MediceanTsp';

// ✅ define libraries array outside the component to avoid re-renders
const libraries: (
  | 'places'
  | 'geometry'
  | 'drawing'
  | 'visualization'
)[] = ['places'];

function App() {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className='w-full min-h-screen flex items-center justify-center bg-gray-100'>
        <Analytics />
        <MedicineTSP />
      </div>
    </LoadScript>
  );
}

export default App;
