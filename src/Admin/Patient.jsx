import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust import path as needed
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiUser, FiHeart, FiDroplet, FiClipboard, FiArrowUp } from 'react-icons/fi';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch all patients from the "patients" collection
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'patients'));
        const querySnapshot = await getDocs(q);
        const patientsData = [];
        querySnapshot.forEach((docSnap) => {
          patientsData.push({ id: docSnap.id, ...docSnap.data() });
        });
        setPatients(patientsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-red-600 text-white rounded-lg shadow-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold mb-12 text-center text-blue-800"
        >
          Patient Management
        </motion.h1>
        
        {patients.length === 0 ? (
          <div className="text-center text-gray-600 text-xl">No patients found in the system.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <motion.div
                key={patient.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-blue-600 overflow-hidden ring-2 ring-blue-400">
                      <img
                        src={patient.profileImage || 'https://source.unsplash.com/100x100/?portrait'}
                        alt={patient.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{patient.name || 'Unnamed Patient'}</h2>
                    <p className="text-gray-500 text-sm font-medium">{patient.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        {patient.age || '??'} years
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        {patient.gender || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPatient && (
          <PatientModal
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PatientModal({ patient, onClose }) {
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('patientId', '==', patient.id)
        );
        const querySnapshot = await getDocs(q);
        // For each appointment, fetch the doctor info (name and email)
        const appointmentsData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const appointmentData = docSnap.data();
            if (appointmentData.doctorId) {
              const doctorRef = doc(db, 'doctors', appointmentData.doctorId);
              const doctorSnap = await getDoc(doctorRef);
              if (doctorSnap.exists()) {
                appointmentData.doctorName = doctorSnap.data().name;
                appointmentData.doctorEmail = doctorSnap.data().email;
              }
            }
            return { id: docSnap.id, ...appointmentData };
          })
        );
        setAppointments(appointmentsData);
      } catch (err) {
        setAppointmentsError(err.message);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [patient.id]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[2000] pt-16 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl relative mx-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 50 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <FiX className="w-6 h-6 text-gray-600" />
        </button>

        <div className="p-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-32 h-32 rounded-full bg-blue-600 overflow-hidden ring-4 ring-blue-400 shadow mb-4">
              <img
                src={patient.profileImage || 'https://source.unsplash.com/200x200/?portrait'}
                alt={patient.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{patient.name}</h2>
            <p className="text-gray-500 font-medium">{patient.email}</p>
            <div className="flex space-x-2 mt-3">
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                {patient.age || '??'} years
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                {patient.gender || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Health Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<FiHeart className="w-6 h-6" />} label="BMI" value={patient.bmi || '??'} />
            <StatCard icon={<FiArrowUp className="w-6 h-6" />} label="Height" value={patient.height ? `${patient.height} cm` : '??'} />
            <StatCard icon={<FiDroplet className="w-6 h-6" />} label="Weight" value={patient.weight ? `${patient.weight} kg` : '??'} />
            <StatCard icon={<FiClipboard className="w-6 h-6" />} label="Blood Pressure" 
              value={patient.bloodPressureMin ? `${patient.bloodPressureMin}/${patient.bloodPressureMax}` : '??'} />
          </div>

          {/* Detailed Information */}
          <div className="space-y-6">
            <InfoSection title="Contact Information">
              <InfoItem label="Address" value={patient.address || 'Not provided'} />
              <InfoItem label="Phone" value={patient.phone || 'Not provided'} />
            </InfoSection>

            {patient.diseaseHistory?.length > 0 && (
              <InfoSection title="Medical History">
                <div className="flex flex-wrap gap-2">
                  {patient.diseaseHistory.map((disease, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {disease}
                    </span>
                  ))}
                </div>
              </InfoSection>
            )}

            <InfoSection title="Appointment History">
              {loadingAppointments ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : appointmentsError ? (
                <div className="text-red-500 text-center py-4">{appointmentsError}</div>
              ) : appointments.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No appointments recorded</div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            <FiCalendar className="inline mr-2 text-blue-600" />
                            {appointment.date?.toDate().toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {appointment.doctorName && (
                              <>
                                With Dr. {appointment.doctorName}
                                <span className="mx-2">•</span>
                              </>
                            )}
                            Status: <span className={`font-medium ${appointment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {appointment.status}
                            </span>
                          </p>
                        </div>
                        {appointment.price && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              ${appointment.price}
                            </div>
                          </div>
                        )}
                      </div>
                      {appointment.location?.address && (
                        <p className="text-sm text-gray-600 mt-2">
                          <FiUser className="inline mr-2 text-blue-600" />
                          {appointment.location.address}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </InfoSection>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const StatCard = ({ icon, label, value }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-600 rounded-lg text-white">{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  </div>
);

const InfoSection = ({ title, children }) => (
  <div className="border-t border-gray-200 pt-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);
