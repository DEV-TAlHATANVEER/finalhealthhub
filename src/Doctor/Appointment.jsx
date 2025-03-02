import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { scheduleAppointmentReminder } from '../utils/notifications';

export default function Appointment() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();
  
  // Helper function to compute remaining time using the Firestore Timestamp
  const computeRemainingTime = (appointmentTimestamp) => {
    if (!appointmentTimestamp) return 'N/A';
    const appointmentDateTime = appointmentTimestamp.toDate
      ? appointmentTimestamp.toDate()
      : new Date(appointmentTimestamp);
    const now = new Date();
    const diffMs = appointmentDateTime - now;
    if (diffMs <= 0) return 'Expired';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let result = '';
    if (diffDays > 0) result += `${diffDays}d `;
    if (diffHours > 0 || diffDays > 0) result += `${diffHours}h `;
    result += `${diffMinutes}m`;
    return result;
  };

  const createNotification = async (userId, title, message) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        title,
        message,
        read: false,
        createdAt: new Date(),
        type: 'appointment'
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleJoinVideoCall = async (patient) => {
    try {
      console.log('Joining video call with patient:', patient.appointmentId);
      
      // Create notification for patient
      await createNotification(
        patient.patientId,
        'Doctor Joined Video Call',
        `Dr. ${doctor.name} has joined your video consultation.`
      );
      const roomid='eShgFh3fnxpr1Tnv4aIs'
      navigate(`/doctor/appointment/video-consultation/${roomid}`, {
        state: { appointmentid: patient.appointmentId}
      });
    } catch (error) {
      toast.error('Error joining video call: ' + error.message);
    }
  };

  // Fetch patient profile including EHR and lab reports
  const handleViewProfile = async (patient) => {
    console.log('Viewing profile of patient:', patient);
    
    try {
      setProfileLoading(true);
      // Query EHR records
      const ehrQuery = query(
        collection(db, 'EHR'),
        where('patientId', '==', patient.patientId)
      );
      const ehrSnapshot = await getDocs(ehrQuery);
      const ehrRecords = ehrSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Query lab reports with completed status
      const labReportsQuery = query(
        collection(db, 'labreports'),
        where('patientid', '==', patient.patientId),
        where('status', '==', 'completed')
      );
      const labReportsSnapshot = await getDocs(labReportsQuery);
      const labReports = labReportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setSelectedPatientProfile({
        patient,
        ehrRecords,
        labReports,
      });
      setProfileLoading(false);
    } catch (error) {
      setProfileLoading(false);
      toast.error("Error fetching patient profile: " + error.message);
    }
  };

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

        // Fetch doctor document from the "doctors" collection
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
          setLoading(false);
          return;
        }

        // Fetch appointments for the doctor with status "confirmed"
        const appointmentsRef = collection(db, 'appointments');
        const appointmentsQuery = query(
          appointmentsRef,
          where('doctorId', '==', user.uid),
          where('status', 'in', ['confirmed' , 'completed'])
        );

        const querySnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = await Promise.all(
          querySnapshot.docs.map(async (appointmentDoc) => {
            const appointmentData = appointmentDoc.data();
            let patientName = 'Unknown Patient';
            let profileImage = '';
            let age = null;
            let bloodPressureMin = null;
            let bloodPressureMax = null;
            let bloodSugarMin = null;
            let bloodSugarMax = null;
            let gender=null
            let medicalHistory = 'No medical history available';

            try {
              // Fetch the patient document from the "patients" collection
              const patientDocSnap = await getDoc(
                doc(db, 'patients', appointmentData.patientId)
              );
              if (patientDocSnap.exists()) {
                const patientData = patientDocSnap.data();
                patientName = patientData.name || patientName;
                profileImage = patientData.profileImage || profileImage;
                age = patientData.age || age;
                bloodPressureMin = patientData.bloodPressureMin || bloodPressureMin;
                bloodPressureMax = patientData.bloodPressureMax || bloodPressureMax;
                bloodSugarMin = patientData.bloodSugarMin || bloodSugarMin;
                bloodSugarMax = patientData.bloodSugarMax || bloodSugarMax;
                gender=patientData.gender || gender
                medicalHistory = patientData.diseaseHistory || medicalHistory;
              }
            } catch (error) {
              console.error('Error fetching patient details:', error);
            }

            return {
              appointmentId: appointmentDoc.id,
              ...appointmentData,
              patientName,
              profileImage,
              age,
              bloodPressureMin,
              bloodPressureMax,
              bloodSugarMin,
              bloodSugarMax,
              gender,
              medicalHistory,
              patientId: appointmentData.patientId
            };
          })
        );

        // Schedule reminders for each scheduled appointment
        appointmentsData.forEach(appointment => {
          if (appointment.status === 'confirmed') {
            scheduleAppointmentReminder({
              appointmentId: appointment.appointmentId,
              patientId: appointment.patientId,
              patientName: appointment.patientName,
              date: appointment.date,
              // Extract start time from the "slotPortion" (e.g., "8:00 AM" from "8:00 AM - 8:30 AM portion")
              time: appointment.slotPortion ? appointment.slotPortion.split(' - ')[0] : 'N/A',
              doctorName: doctorData.name || 'Your Doctor'
            });
          }
        });

        setPatients(appointmentsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time listener for appointment updates
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', user.uid),
        where('status', 'in', ['confirmed', 'completed'])
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const appointment = { appointmentId: change.doc.id, ...change.doc.data() };
            createNotification(
              user.uid,
              'New Appointment',
              `New appointment scheduled with ${appointment.patientName || 'a patient'}`
            );
          }
        });
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center animate-fadeInDown">
          Your Appointments
        </h1>
        {error && <div className="bg-red-500 p-3 rounded mb-4 text-center">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-300">Loading appointments...</div>
        ) : (
          <div className="space-y-6">
            {patients.length === 0 ? (
              <div className="text-gray-400 mt-4 text-center">No appointments scheduled</div>
            ) : (
              patients.map(patient => {
                const remainingTime = computeRemainingTime(patient.date);
                const isOnlineAppointment = patient.type === 'online' || patient.type === 'video';
                const canJoinCall =
                  isOnlineAppointment &&
                  patient.status === 'confirmed' &&
                  remainingTime === 'Expired';

                return (
                  <div
                    key={patient.appointmentId}
                    className="bg-purple-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-lg font-semibold">{patient.slotPortion || 'N/A'}</p>
                        <p className="text-sm">
                          {patient.date?.toDate().toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">{patient.patientName || (patient.patientId ? `Patient ID: ${patient.patientId.slice(0, 6)}` : 'N/A')}</p>
                        <p className="text-sm text-gray-200">{patient.type || 'N/A'}</p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex space-x-2 items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            patient.status === 'confirmed'
                              ? 'bg-green-500'
                              : patient.status === 'in-progress'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}>
                            {patient.status || 'N/A'}
                          </span>
                          <span className="text-lg font-bold text-white">{remainingTime}</span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          {isOnlineAppointment && (
                            <button
                              onClick={() => handleJoinVideoCall(patient)}
                              disabled={!canJoinCall}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors duration-150 ${
                                canJoinCall
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-gray-500 cursor-not-allowed'
                              }`}
                              title={canJoinCall ? 'Join Video Call' : 'Video call not available'}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm">Join</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleViewProfile(patient)}
                            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-colors duration-150"
                            title="View Profile"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.121 17.804A10 10 0 0112 14c2.485 0 4.75.909 6.879 2.404M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal for Patient Profile */}
      {selectedPatientProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-white text-black p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="flex items-center space-x-4">
                {selectedPatientProfile.patient.profileImage ? (
                  <img
                    src={selectedPatientProfile.patient.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
                    {selectedPatientProfile.patient.patientName ? selectedPatientProfile.patient.patientName.charAt(0) : 'P'}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedPatientProfile.patient.patientName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Age: {selectedPatientProfile.patient.age || 'N/A'} | BP:{' '}
                    {(selectedPatientProfile.patient.bloodPressureMin && selectedPatientProfile.patient.bloodPressureMax)
                      ? `${selectedPatientProfile.patient.bloodPressureMin} - ${selectedPatientProfile.patient.bloodPressureMax}`
                      : 'N/A'} | BS:{' '}
                    {(selectedPatientProfile.patient.bloodSugarMin && selectedPatientProfile.patient.bloodSugarMax)
                      ? `${selectedPatientProfile.patient.bloodSugarMin} - ${selectedPatientProfile.patient.bloodSugarMax}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientProfile(null)}
                className="text-red-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {profileLoading ? (
              <div className="text-center text-gray-500">Loading profile...</div>
            ) : (
              <div className="space-y-6">
                {/* Personal Info & Vital Signs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Info</h3>
                    <p><strong>Name:</strong> {selectedPatientProfile.patient.patientName}</p>
                    <p><strong>Age:</strong> {selectedPatientProfile.patient.age || 'N/A'}</p>
                    <p><strong>Gender:</strong> {selectedPatientProfile.patient.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Vital Signs</h3>
                    <p>
                      <strong>Blood Pressure:</strong>{' '}
                      {(selectedPatientProfile.patient.bloodPressureMin && selectedPatientProfile.patient.bloodPressureMax)
                        ? `${selectedPatientProfile.patient.bloodPressureMin} - ${selectedPatientProfile.patient.bloodPressureMax}`
                        : 'N/A'}
                    </p>
                    <p>
                      <strong>Blood Sugar:</strong>{' '}
                      {(selectedPatientProfile.patient.bloodSugarMin && selectedPatientProfile.patient.bloodSugarMax)
                        ? `${selectedPatientProfile.patient.bloodSugarMin} - ${selectedPatientProfile.patient.bloodSugarMax}`
                        : 'N/A'}
                    </p>
                   
                  </div>
                </div>
                {/* Medical History Section */}
                <div>
                  <h3 className="font-semibold mb-2">Medical History</h3>
                  <p>{selectedPatientProfile.patient.medicalHistory || 'No medical history available.'}</p>
                </div>
                {/* EHR Records Section */}
                <div>
                  <h3 className="font-semibold mb-2">EHR Records</h3>
                  {selectedPatientProfile.ehrRecords.length === 0 ? (
                    <p>No EHR records found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedPatientProfile.ehrRecords.map(record => (
                        <li key={record.id} className="border p-2 rounded">
                          <p><strong>Test Name:</strong> {record.testname}</p>
                          <p><strong>Type:</strong> {record.type}</p>
                          <p><strong>Status:</strong> {record.status}</p>
                          <p>
                            <strong>Report:</strong>{' '}
                            <a
                              href={record.reportUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View Report
                            </a>
                          </p>
                          <p>
                            <strong>Created At:</strong>{' '}
                            {record.createdAt && record.createdAt.seconds
                              ? new Date(record.createdAt.seconds * 1000).toLocaleString()
                              : 'N/A'}
                          </p>
                          <p>
                            <strong>Updated At:</strong>{' '}
                            {record.updatedAt && record.updatedAt.seconds
                              ? new Date(record.updatedAt.seconds * 1000).toLocaleString()
                              : 'N/A'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Lab Reports Section */}
                <div>
                  <h3 className="font-semibold mb-2">Lab Reports</h3>
                  {selectedPatientProfile.labReports.length === 0 ? (
                    <p>No completed lab reports found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedPatientProfile.labReports.map(report => (
                        <li key={report.id} className="border p-2 rounded">
                          <p><strong>Name:</strong> {report.name}</p>
                          <p><strong>Status:</strong> {report.status}</p>
                          <p><strong>Remarks:</strong> {report.remarks}</p>
                          <p>
                            <strong>Report:</strong>{' '}
                            <a
                              href={report.reportUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View Report
                            </a>
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="text-right mt-4 flex justify-end space-x-2">
              <button
                onClick={() =>
                  navigate('/doctor/generate-prescription', {
                    state: { patient: selectedPatientProfile.patient }
                  })
                }
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Generate Prescription
              </button>
              <button
                onClick={() => setSelectedPatientProfile(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
