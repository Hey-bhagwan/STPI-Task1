// src/components/MedicineForm.tsx
import React from 'react';
import type { Medicine } from '../types/types';

type Props = {
    medicines: Medicine[];
    onChange: (index: number, field: keyof Medicine, value: string | number) => void;
};

const MedicineForm: React.FC<Props> = ({ medicines, onChange }) => {
    return (
        <>
            {medicines.map((med, index) => (
                <div key={index} className="mb-4 border p-4 rounded-xl bg-gray-50 shadow-sm">
                    <h3 className="font-semibold mb-2 text-gray-700">Medicine #{index + 1}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">💊 Name</label>
                            <input
                                type="text"
                                value={med.name}
                                onChange={(e) => onChange(index, 'name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">📍 Destination (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={med.destination}
                                onChange={(e) => onChange(index, 'destination', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">🔢 Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={med.quantity}
                                onChange={(e) => onChange(index, 'quantity', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default MedicineForm;
