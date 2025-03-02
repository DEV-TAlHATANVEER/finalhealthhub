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
import { Button, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';
import { uploadFile } from '../utils/cloudinary';
import { serverTimestamp } from 'firebase/firestore';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const reportsRef = collection(db, 'labreports');
      const reportsQuery = query(reportsRef, where('labId', '==', user.uid));
      const snapshot = await getDocs(reportsQuery);
      
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // For each report, fetch the corresponding patient details if patientid exists
      const reportsDataWithPatients = await Promise.all(
        reportsData.map(async (report) => {
          if (report.patientid) {
            const patientDoc = await getDoc(doc(db, 'patients', report.patientid));
            return {
              ...report,
              patientDetails: patientDoc.exists() ? patientDoc.data() : null
            };
          }
          return report;
        })
      );
      
      setReports(reportsDataWithPatients);
    } catch (error) {
      toast.error('Error fetching reports: ' + error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setReportFile(file);
    } else {
      toast.error('Please select a PDF or image file');
    }
  };

  const handleUploadReport = async () => {
    if (!selectedTest || !reportFile || !remarks) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Upload file to Cloudinary using the utility function
      const downloadURL = await uploadFile(reportFile);

      const reportRef = doc(db, 'labreports', selectedTest.id);
      await updateDoc(reportRef, {
        status: 'completed',
        reportUrl: downloadURL,
        remarks: remarks,
        updatedAt: serverTimestamp()
      });

      toast.success('Report updated successfully');
      setShowUploadModal(false);
      setSelectedTest(null);
      setReportFile(null);
      setRemarks('');
      fetchReports();
    } catch (error) {
      toast.error('Error updating report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Test Reports</h1>

      {/* Scrollable Reports List */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-full overflow-y-scroll" style={{ maxHeight: '500px' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.patientDetails ? report.patientDetails.name : report.patientid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.patientDetails ? report.patientDetails.email : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.patientDetails ? report.patientDetails.phone : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.testname}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.createdAt && new Date(report.createdAt.toDate()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button.Group>
                      {report.status === 'pending' && (
                        <Button size="sm" color="warning" onClick={() => {
                          setSelectedTest(report);
                          setShowUploadModal(true);
                        }}>
                          Update
                        </Button>
                      )}
                    
                    </Button.Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Report Modal */}
      {showUploadModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Update Test Report</h2>
            
            {selectedTest.patientDetails && (
              <div className="p-4 bg-gray-100 rounded mb-4">
                <p><strong>Patient Name:</strong> {selectedTest.patientDetails.name}</p>
                <p><strong>Email:</strong> {selectedTest.patientDetails.email}</p>
                <p><strong>Test Name:</strong> {selectedTest.testname}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Report</label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <TextInput
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button color="gray" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadReport} disabled={loading}>
                {loading ? 'Uploading...' : 'Update Report'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
