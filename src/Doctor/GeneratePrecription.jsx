import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export default function GeneratePrecription() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient || {};

  // State for one medicine entry
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  // Array of added medicines
  const [medicines, setMedicines] = useState([]);
  // Additional prescription notes
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!medicine.name || !medicine.dosage) {
      toast.error('Please provide at least a medicine name and dosage.');
      return;
    }
    setMedicines([...medicines, medicine]);
    setMedicine({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (medicines.length === 0) {
      toast.error('Please add at least one medicine.');
      return;
    }
    setLoading(true);
    const prescriptionData = {
      patientId: patient.patientId || '',
      patientName: patient.patientName || 'Unknown Patient',
      medicines,
      notes,
      createdAt: serverTimestamp(),
    };

    try {
      // Save the prescription document in Firestore
      await addDoc(collection(db, 'prescriptions'), prescriptionData);
      toast.success('Prescription generated successfully.');
      navigate('/doctor/dashboard'); // Navigate to the desired route after submission
    } catch (error) {
      console.error('Error generating prescription:', error);
      toast.error('Error generating prescription.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Generate Prescription</h1>

        {/* Patient Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Patient Information</h2>
          <p><strong>Name:</strong> {patient.patientName || 'N/A'}</p>
          <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
          <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
        </div>

        {/* Prescription Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Add Medication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Medicine Name</label>
                <input
                  type="text"
                  value={medicine.name}
                  onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. Paracetamol"
                  
                />
              </div>
              <div>
                <label className="block text-gray-700">Dosage</label>
                <input
                  type="text"
                  value={medicine.dosage}
                  onChange={(e) => setMedicine({ ...medicine, dosage: e.target.value })}
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. 500mg"
                  
                />
              </div>
              <div>
                <label className="block text-gray-700">Frequency</label>
                <input
                  type="text"
                  value={medicine.frequency}
                  onChange={(e) => setMedicine({ ...medicine, frequency: e.target.value })}
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. Twice a day"
                />
              </div>
              <div>
                <label className="block text-gray-700">Duration</label>
                <input
                  type="text"
                  value={medicine.duration}
                  onChange={(e) => setMedicine({ ...medicine, duration: e.target.value })}
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. 5 days"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700">Instructions</label>
                <textarea
                  value={medicine.instructions}
                  onChange={(e) => setMedicine({ ...medicine, instructions: e.target.value })}
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="Additional instructions for the patient"
                ></textarea>
              </div>
            </div>
            <button
              onClick={handleAddMedicine}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Medicine
            </button>
          </div>

          {/* Medicines List */}
          {medicines.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Medicines List</h2>
              <ul className="divide-y">
                {medicines.map((med, index) => (
                  <li key={index} className="py-2">
                    <p><strong>{med.name}</strong> - {med.dosage}</p>
                    <p>Frequency: {med.frequency || 'N/A'}, Duration: {med.duration || 'N/A'}</p>
                    {med.instructions && <p>Instructions: {med.instructions}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Notes */}
          <div className="mb-4">
            <label className="block text-gray-700">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Enter any additional notes..."
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
