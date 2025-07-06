
import React from 'react';

type Props = {
    onAdd: () => void;
    onTestFill: () => void;
    testFilled: boolean;
    onSubmit: () => void;
    onDelete: () => void;
    loading: boolean;
};

const FormActions: React.FC<Props> = ({ onAdd, onTestFill, testFilled, onSubmit, onDelete, loading }) => (
    <div>
        {testFilled && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 border border-yellow-300 text-sm">
                    ⚠️ data already exists in the system. If you want to reset and enter fresh data, please click <strong>“Delete All & Reset Form”</strong>.
                </div>
            )}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3 mt-4">
            <button
                onClick={onAdd}
                className="px-6 py-2 bg-yellow-400 text-white font-semibold rounded-xl hover:bg-yellow-500 transition w-full sm:w-auto"
            >
                ➕ Add Another Medicine
            </button>

            <button
                onClick={onTestFill}
                disabled={testFilled}
                className={`px-6 py-2 font-semibold rounded-xl w-full sm:w-auto transition ${testFilled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
            >
                🧪 Fill Test Data
            </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-3 mt-4">
            <button
                onClick={onSubmit}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition w-full sm:w-auto"
                disabled={loading}
            >
                {loading ? '🔄 Processing...' : '✅ Submit & Calculate Route'}
            </button>
            <button
                onClick={onDelete}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition w-full sm:w-auto"
            >
                🗑️ Delete All & Reset Form
            </button>
        </div>
    </div>
);

export default FormActions;
