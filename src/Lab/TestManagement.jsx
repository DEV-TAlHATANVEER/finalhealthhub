import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Button, TextInput, Select } from 'flowbite-react';
import { toast } from 'react-toastify';

const testCategories = [
  'Blood Tests',
  'Urine Tests',
  'Imaging',
  'Pathology',
  'Microbiology',
  'Biochemistry'
];

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    turnaroundTime: '',
    requiresFasting: false
  });

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const testsRef = collection(db, 'labTests');
      const testsQuery = query(testsRef, where('labId', '==', user.uid));
      const snapshot = await getDocs(testsQuery);
      
      const testsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTests(testsData);
    } catch (error) {
      toast.error('Error fetching tests: ' + error.message);
    }
  };

  const handleAddTest = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const testData = {
        ...newTest,
        labId: user.uid,
        createdAt: new Date(),
        status: 'active',
        price: Number(newTest.price)
      };

      await addDoc(collection(db, 'labTests'), testData);
      toast.success('Test added successfully');
      setShowAddModal(false);
      setNewTest({
        name: '',
        category: '',
        price: '',
        description: '',
        turnaroundTime: '',
        requiresFasting: false
      });
      fetchTests();
    } catch (error) {
      toast.error('Error adding test: ' + error.message);
    }
  };
  const handleUpdateTestStatus = async (testId, newStatus) => {
    try {
      // Only perform lab report check when deactivating
      if (newStatus === 'inactive') {
        const labReportsRef = collection(db, 'labreports');
        const labReportsQuery = query(labReportsRef, where('testid', '==', testId));
        const labReportsSnapshot = await getDocs(labReportsQuery);
  
        let canDeactivate = true;
        labReportsSnapshot.forEach((doc) => {
          // If any lab report has a status other than "complete", prevent deactivation
          if (doc.data().status !== 'complete') {
            canDeactivate = false;
          }
        });
        console.log(canDeactivate );
        
        if (!canDeactivate) {
          toast.error('Patients already booked this test. Please complete it first before deactivating.');
          alert('Patients already booked this test. Please complete it first before deactivating.');
          return;
        }
      }
  
      // Proceed with status update if deactivation is allowed or if activating
      const testRef = doc(db, 'labTests', testId);
      await updateDoc(testRef, { status: newStatus });
      toast.success('Test status updated');
      fetchTests();
    } catch (error) {
      toast.error('Error updating test status: ' + error.message);
    }
  };
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Management</h1>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600">
          Add New Test
        </Button>
      </div>

      {/* Test List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tests.map((test) => (
              <tr key={test.id}>
                <td className="px-6 py-4 whitespace-nowrap">{test.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{test.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {test.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    test.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button.Group>
                    <Button 
                      size="sm"
                      color={test.status === 'active' ? 'failure' : 'success'}
                      onClick={() => handleUpdateTestStatus(test.id, test.status === 'active' ? 'inactive' : 'active')}
                    >
                      {test.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                  </Button.Group>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Test</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <TextInput
                  value={newTest.name}
                  onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select
                  value={newTest.category}
                  onChange={(e) => setNewTest({...newTest, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {testCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                <TextInput
                  type="number"
                  value={newTest.price}
                  onChange={(e) => setNewTest({...newTest, price: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <TextInput
                  value={newTest.description}
                  onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turnaround Time</label>
                <TextInput
                  value={newTest.turnaroundTime}
                  onChange={(e) => setNewTest({...newTest, turnaroundTime: e.target.value})}
                  placeholder="e.g., 24 hours"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiresFasting"
                  checked={newTest.requiresFasting}
                  onChange={(e) => setNewTest({...newTest, requiresFasting: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="requiresFasting" className="text-sm font-medium text-gray-700">
                  Requires Fasting
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button color="gray" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTest}>
                Add Test
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
