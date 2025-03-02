import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';

export default function DashboardLab() {
  const [stats, setStats] = useState({
    pendingTests: 0,
    completedTests: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const auth = getAuth();
  const db = getFirestore();

  // Helper function to fetch a patient's name using their ID
  const fetchPatientName = async (patientId) => {
    try {
      const patientDoc = await getDoc(doc(db, 'patients', patientId));
      return patientDoc.exists() ? patientDoc.data().name : 'Unknown';
    } catch (error) {
      console.error('Error fetching patient data:', error);
      return 'Unknown';
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch test statistics and recent tests
        const testsRef = collection(db, 'labreports');
        const testsQuery = query(testsRef, where('labId', '==', user.uid));
        const testsSnapshot = await getDocs(testsQuery);

        let pending = 0;
        let completed = 0;
        let revenue = 0;
        let pendingAmount = 0;

        // Process each test and fetch the patient's name
        const testsData = await Promise.all(
          testsSnapshot.docs.map(async (docSnap) => {
            const test = { id: docSnap.id, ...docSnap.data() };

            if (test.status === 'pending') pending++;
            if (test.status === 'completed') completed++;
            if (test.paymentStatus === 'paid') revenue += test.price;

            // Fetch patient name using patientid stored in the test document
            test.patientName = await fetchPatientName(test.patientid);
            return test;
          })
        );

        setStats({
          pendingTests: pending,
          completedTests: completed,
          totalRevenue: revenue,
          pendingPayments: pendingAmount
        });

        setRecentTests(testsData);

        // Fetch notifications if needed (currently not implemented)
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [auth, db]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Laboratory Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Tests</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.pendingTests}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Completed Tests</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completedTests}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">Rs. {stats.totalRevenue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Tests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Patient</th>
                  <th className="px-4 py-2 text-left">Test</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test) => (
                  <tr key={test.id} className="border-t">
                    <td className="px-4 py-2">{test.patientName}</td>
                    <td className="px-4 py-2">{test.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        test.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : test.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(test.createdAt.toDate()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
       
      </div>
    </div>
  );
}
