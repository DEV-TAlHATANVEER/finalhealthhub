import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { Button, TextInput, Select } from 'flowbite-react';
import { toast } from 'react-toastify';

export default function Payment() {
  const [transactions, setTransactions] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0
  });

  const auth = getAuth();
  const db = getFirestore();

  // Helper function to fetch a patient's name from the patients collection
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
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const transactionsRef = collection(db, 'labreports');
      const transactionsQuery = query(transactionsRef, where('labId', '==', user.uid));
      const snapshot = await getDocs(transactionsQuery);
      
      let totalRevenue = 0;
      let completedPayments = 0;
      let pendingPayments = 0;

      // Map over each document and fetch the patient name
      const transactionsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };

          // Fetch and attach the patient's name
          data.patientName = await fetchPatientName(data.patientid);

          if (data.paymentStatus === 'paid') {
            totalRevenue += data.price;
            completedPayments++;
          } else {
            pendingPayments++;
          }
          return data;
        })
      );
      
      setTransactions(transactionsData);
      setStats({ totalRevenue, completedPayments, pendingPayments });
    } catch (error) {
      toast.error('Error fetching transactions: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Payments & Billing</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">Rs. {stats.totalRevenue}</p>
        </div>
      
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Completed Payments</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.completedPayments}</p>
        </div>

      
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {transaction.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.createdAt.toDate()).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
                <p>
                  <span className="font-medium">Name:</span> {selectedTransaction.patientName}
                </p>
                <p>
                  <span className="font-medium">Test:</span> {selectedTransaction.name}
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                <p>
                  <span className="font-medium">Amount:</span> Rs. {selectedTransaction.price}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {selectedTransaction.paymentStatus}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {new Date(selectedTransaction.createdAt.toDate()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button color="gray" onClick={() => setShowInvoiceModal(false)}>
                Close
              </Button>
              <Button color="info">
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
