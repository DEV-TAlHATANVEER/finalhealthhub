import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Button, TextInput, Select } from 'flowbite-react';
import { toast } from 'react-toastify';

const staffRoles = [
  'Lab Technician',
  'Lab Assistant',
  'Phlebotomist',
  'Receptionist',
  'Manager'
];

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    qualification: '',
    joinDate: '',
    status: 'active'
  });

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const staffRef = collection(db, 'labStaff');
      const staffQuery = query(staffRef, where('labId', '==', user.uid));
      const snapshot = await getDocs(staffQuery);
      
      const staffData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setStaff(staffData);
    } catch (error) {
      toast.error('Error fetching staff: ' + error.message);
    }
  };

  const handleAddStaff = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (!newStaff.name || !newStaff.email || !newStaff.role) {
        toast.error('Please fill all required fields');
        return;
      }

      const staffData = {
        ...newStaff,
        labId: user.uid,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'labStaff'), staffData);
      toast.success('Staff member added successfully');
      setShowAddModal(false);
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        role: '',
        qualification: '',
        joinDate: '',
        status: 'active'
      });
      fetchStaff();
    } catch (error) {
      toast.error('Error adding staff: ' + error.message);
    }
  };

  const handleUpdateStaffStatus = async (staffId, newStatus) => {
    try {
      const staffRef = doc(db, 'labStaff', staffId);
      await updateDoc(staffRef, { 
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success('Staff status updated successfully');
      fetchStaff();
    } catch (error) {
      toast.error('Error updating staff status: ' + error.message);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteDoc(doc(db, 'labStaff', staffId));
        toast.success('Staff member deleted successfully');
        fetchStaff();
      } catch (error) {
        toast.error('Error deleting staff: ' + error.message);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600">
          Add Staff Member
        </Button>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
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
            {staff.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.role}</div>
                  <div className="text-sm text-gray-500">{member.qualification}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button.Group>
                    <Button
                      size="sm"
                      color={member.status === 'active' ? 'failure' : 'success'}
                      onClick={() => handleUpdateStaffStatus(member.id, member.status === 'active' ? 'inactive' : 'active')}
                    >
                      {member.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => handleDeleteStaff(member.id)}
                    >
                      Delete
                    </Button>
                  </Button.Group>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Staff Member</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <TextInput
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <TextInput
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <TextInput
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  required
                >
                  <option value="">Select Role</option>
                  {staffRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <TextInput
                  value={newStaff.qualification}
                  onChange={(e) => setNewStaff({...newStaff, qualification: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <TextInput
                  type="date"
                  value={newStaff.joinDate}
                  onChange={(e) => setNewStaff({...newStaff, joinDate: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button color="gray" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStaff}>
                Add Staff
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
