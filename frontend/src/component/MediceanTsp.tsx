// src/components/MedicineTSP.tsx
import React, { useState } from 'react';
import axios from 'axios';
import type { Medicine, TspResult } from '../types/types';
import MedicineForm from './MedicineForm';
import FormActions from './FormActions';
import RouteResults from './RouteResults';
import { useEffect } from 'react';



const MedicineTSP: React.FC = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([{ name: '', destination: 0, quantity: 1 }]);
    const [result, setResult] = useState<TspResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [testFilled, setTestFilled] = useState(false);

    useEffect(() => {
        const checkExistingData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/v1/tsp');
                if (res.data?.deliveryDetails?.length > 0) {
                    setResult(res.data);         // Show previous result
                    setShowResult(true);         // Expand by default (optional)
                    setTestFilled(true);         // Block test fill button
                }
            } catch (err) {
                console.log('No existing test data');
            }
        };
    
        checkExistingData();
    }, []);

    const handleChange = (index: number, field: keyof Medicine, value: string | number) => {
        const updated = [...medicines];
        updated[index] = {
            ...updated[index],
            [field]: field === 'destination' || field === 'quantity' ? Number(value) : value,
        };
        setMedicines(updated);
    };

    const addMedicine = () => setMedicines([...medicines, { name: '', destination: 0, quantity: 1 }]);

    const generateRandomMedicines = (count = 6): Medicine[] => {
        const names = ['Paracetamol', 'Ibuprofen', 'Dolo 650', 'Zincovit', 'Crocin'];
        return Array.from({ length: count }, () => ({
            name: names[Math.floor(Math.random() * names.length)],
            destination: Math.floor(Math.random() * 5) + 1,
            quantity: Math.floor(Math.random() * 5) + 1,
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
            await axios.put('http://localhost:3000/api/v1/submit', medicines);
            const res = await axios.get('http://localhost:3000/api/v1/tsp');
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
        await axios.delete('http://localhost:3000/api/v1/delete-all');
        setMedicines([{ name: '', destination: 0, quantity: 1 }]);
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

                {showForm && <MedicineForm medicines={medicines} onChange={handleChange} />}

                <FormActions
                    onAdd={addMedicine}
                    onTestFill={fillTestData}
                    testFilled={testFilled}
                    onSubmit={submitData}
                    onDelete={deleteAll}
                    loading={loading}
                />

                <RouteResults result={result} showResult={showResult} toggleResult={() => setShowResult(!showResult)} />
            </div>
        </div>
    );
};

export default MedicineTSP;
