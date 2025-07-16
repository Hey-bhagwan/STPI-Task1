// src/components/MedicineTSP.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Medicine, TspResult } from '../types/types';
import MedicineForm from './MedicineForm';
import FormActions from './FormActions';
import RouteResults from './RouteResults';

const url = import.meta.env.VITE_API_URL;

const MedicineTSP: React.FC = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([
        { name: '', quantity: 1, location: { address: '', lat: 0, lng: 0 } }
    ]);
    const [result, setResult] = useState<TspResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [testFilled, setTestFilled] = useState(false);

    useEffect(() => {
        const checkExistingData = async () => {
            try {
                const res = await axios.get(`${url}/api/v1/tsp`);
                if (res.data?.deliveryDetails?.length > 0) {
                    setResult(res.data);
                    setShowResult(true);
                    setTestFilled(true);
                }
            } catch {
                console.log('No existing test data');
            }
        };
        checkExistingData();
    }, []);

    const handleChange = (
        index: number,
        field: keyof Medicine,
        value: string | number | Medicine['location']
    ) => {
        const updated = [...medicines];
        updated[index] = {
            ...updated[index],
            [field]: field === 'quantity' ? Number(value) : value
        };
        setMedicines(updated);
    };

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', quantity: 1, location: { address: '', lat: 0, lng: 0 } }]);
    };

    const generateRandomMedicines = (count = 6): Medicine[] => {
        const names = ['Paracetamol', 'Ibuprofen', 'Dolo 650', 'Zincovit', 'Crocin'];
        const sampleLocations = [
            { address: 'MG Road, Bengaluru', lat: 12.9756, lng: 77.6050 },
            { address: 'Koramangala, Bengaluru', lat: 12.9352, lng: 77.6245 },
            { address: 'Whitefield, Bengaluru', lat: 12.9698, lng: 77.7499 },
            { address: 'Indiranagar, Bengaluru', lat: 12.9719, lng: 77.6412 },
            { address: 'HSR Layout, Bengaluru', lat: 12.9116, lng: 77.6412 }
        ];
        return Array.from({ length: count }, () => ({
            name: names[Math.floor(Math.random() * names.length)],
            quantity: Math.floor(Math.random() * 5) + 1,
            location: sampleLocations[Math.floor(Math.random() * sampleLocations.length)]
        }));
    };

    const fillTestData = () => {
        if (testFilled) return;
        setMedicines(generateRandomMedicines(6));
        setTestFilled(true);
    };

    const submitData = async () => {
        setLoading(true);
        try {
            await axios.put(`${url}/api/v1/submit`, medicines);
            const res = await axios.get(`${url}/api/v1/tsp`);
            setResult(res.data);
            setShowResult(true);
            alert('✅ Submission successful!');
        } catch {
            alert('Submission failed!');
        } finally {
            setLoading(false);
        }
    };

    const deleteAll = async () => {
        if (!window.confirm('Are you sure?')) return;
        await axios.delete(`${url}/api/v1/delete-all`);
        setMedicines([{ name: '', quantity: 1, location: { address: '', lat: 0, lng: 0 } }]);
        setResult(null);
        setTestFilled(false);
        setShowResult(false);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-6 sm:p-10">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                    🛣️ Medicine Delivery Route Optimizer
                </h1>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-600">🧾 Fill Medicine Info</h2>
                    <button onClick={() => setShowForm(!showForm)} className="text-sm text-blue-500 hover:underline">
                        {showForm ? 'Hide Form ▲' : 'Show Form ▼'}
                    </button>
                </div>

                {showForm && (
                    <MedicineForm medicines={medicines} onChange={handleChange} />
                )}

                <FormActions
                    onAdd={addMedicine}
                    onTestFill={fillTestData}
                    testFilled={testFilled}
                    onSubmit={submitData}
                    onDelete={deleteAll}
                    loading={loading}
                />

                <RouteResults
                    result={result}
                    showResult={showResult}
                    toggleResult={() => setShowResult(!showResult)}
                />
            </div>
        </div>
    );
};

export default MedicineTSP;
