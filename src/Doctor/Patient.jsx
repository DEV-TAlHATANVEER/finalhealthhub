import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust import path as needed
import { motion, AnimatePresence } from 'framer-motion';

export default function Patient() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Fetch doctor document and check if approved
        const doctorRef = doc(db, 'doctors', user.uid);
        const doctorSnap = await getDoc(doctorRef);
        if (!doctorSnap.exists()) {
          setError('Doctor profile not found');
          setLoading(false);
          return;
        }
        const doctorData = doctorSnap.data();
        setDoctor(doctorData);
        if (doctorData.status !== 'approved') {
          setError('Your account is not approved yet');
          setLoading(false);
          return;
        }

        // Query confirmed appointments for this doctor
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('doctorId', '==', doctorSnap.id),
          where('status', '==', 'confirmed')
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        // Get unique patient IDs from the appointments
        const patientIdsSet = new Set();
        appointmentsSnapshot.forEach((docSnap) => {
          const appointment = docSnap.data();
          if (appointment.patientId) {
            patientIdsSet.add(appointment.patientId);
          }
        });
        const uniquePatientIds = Array.from(patientIdsSet);

        // Fetch patient data from the patients collection using each unique id
        const patientDocsPromises = uniquePatientIds.map(async (patientId) => {
          const patientRef = doc(db, 'patients', patientId);
          return getDoc(patientRef);
        });
        const patientDocs = await Promise.all(patientDocsPromises);
        const patientsData = patientDocs
          .filter((docSnap) => docSnap.exists())
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));

        setPatients(patientsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-800 to-indigo-900">
        <div className="w-16 h-16 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-800 to-indigo-900">
        <div className="p-6 bg-red-600 text-white rounded-lg shadow-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center animate-fadeInDown">
          Patient Profiles
        </h1>
        {patients.length === 0 ? (
          <div className="text-center text-gray-300">No patients found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-purple-900 bg-opacity-80 rounded-lg shadow-xl p-6 hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 mr-4">
                    <img
                      src={patient.profileImage || 'https://via.placeholder.com/150'}
                      alt={patient.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{patient.name}</h2>
                    <p className="text-gray-300 text-sm">
                      {patient.email || 'No email provided'}
                    </p>
                  </div>
                </div>
                <div className="mb-4 text-gray-300">
                  <p>
                    <strong>Phone:</strong> {patient.phone || 'N/A'}
                  </p>
                  {patient.age && (
                    <p>
                      <strong>Age:</strong> {patient.age}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-200"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for displaying patient details */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setSelectedPatient(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 mb-4">
                  <img
                    src={selectedPatient.profileImage || 'https://via.placeholder.com/150'}
                    alt={selectedPatient.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                <p className="text-gray-600">{selectedPatient.email}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Phone:</strong> {selectedPatient.phone}
                  </p>
                  <p>
                    <strong>Age:</strong> {selectedPatient.age}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedPatient.address}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedPatient.gender}
                  </p>
                  <p>
                    <strong>BMI:</strong> {selectedPatient.bmi}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Blood Pressure:</strong> {selectedPatient.bloodPressureMin} - {selectedPatient.bloodPressureMax}
                  </p>
                  <p>
                    <strong>Blood Sugar:</strong> {selectedPatient.bloodSugarMin} - {selectedPatient.bloodSugarMax}
                  </p>
                  <p>
                    <strong>Height:</strong> {selectedPatient.height}
                  </p>
                  <p>
                    <strong>Weight:</strong> {selectedPatient.weight}
                  </p>
                  <p>
                    <strong>Disease History:</strong>{' '}
                    {selectedPatient.diseaseHistory && selectedPatient.diseaseHistory.join(', ')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
