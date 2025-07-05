// src/components/RouteResults.tsx
import React from 'react';
import type { TspResult } from '../types/types';
import { AnimatePresence, motion } from 'framer-motion';


type Props = {
    result: TspResult | null;
    showResult: boolean;
    toggleResult: () => void;
};

const RouteResults: React.FC<Props> = ({ result, showResult, toggleResult }) => {
    if (!result) return null;

    return (
        <>
            <div className="flex justify-between items-center mt-10 mb-2 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800">🚚 Delivery Route</h2>
                <button onClick={toggleResult} className="text-sm text-blue-500 hover:underline">
                    {showResult ? 'Hide Details ▲' : 'Show Details ▼'}
                </button>
            </div>

            <AnimatePresence>
                {showResult && (
                    <motion.div
                        key="result"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <p className="text-lg mb-1">🔁 Route Cost: <span className="font-bold">{result.cost}</span></p>
                        <p className="text-lg mb-4">🗺️ Route: <span className="font-mono">{result.route.join(' → ')}</span></p>

                        <h2 className="text-lg font-semibold mb-2 text-gray-700">📦 Delivery Details</h2>
                        {result.deliveryDetails
                            .filter((loc) => loc.location !== 0) // ⛔️ Exclude warehouse from delivery list
                            .map((loc, idx) => (
                                <div key={idx} className="bg-gray-100 rounded-xl p-4 mb-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-700 mb-1">📍 Location {loc.location}</h3>
                                    {loc.deliveries.length > 0 ? (
                                        <ul className="list-disc pl-5 text-gray-600">
                                            {loc.deliveries.map((d, i) => (
                                                <li key={i}>{d.name} × {d.quantity}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">No deliveries</p>
                                    )}
                                </div>
                            ))}

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RouteResults;
