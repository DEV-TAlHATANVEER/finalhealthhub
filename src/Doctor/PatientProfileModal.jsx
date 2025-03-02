import React from 'react';

export default function PatientProfileModal({ profile, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-screen">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl focus:outline-none"
          aria-label="Close Modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          Patient Profile: {profile?.patient?.patientName || 'Unknown'}
        </h2>
        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : (
          <>
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-3">EHR Records</h3>
              {profile?.ehrRecords?.length ? (
                <ul className="space-y-4">
                  {profile.ehrRecords.map(record => (
                    <li key={record.id} className="border rounded p-4 bg-gray-50">
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Test Name:</span> {record.testname}
                        </p>
                        <p>
                          <span className="font-medium">Type:</span> {record.type}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span> {record.status}
                        </p>
                        <p>
                          <span className="font-medium">Report:</span>
                          <a
                            href={record.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline ml-1"
                          >
                            View Report
                          </a>
                        </p>
                        <p>
                          <span className="font-medium">Created At:</span> {record.createdAt && record.createdAt.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Updated At:</span> {record.updatedAt && record.updatedAt.seconds ? new Date(record.updatedAt.seconds * 1000).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No EHR records found.</p>
              )}
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-3">Lab Reports</h3>
              {profile?.labReports?.length ? (
                <ul className="space-y-4">
                  {profile.labReports.map(report => (
                    <li key={report.id} className="border rounded p-4 bg-gray-50">
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Name:</span> {report.name}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span> {report.status}
                        </p>
                        <p>
                          <span className="font-medium">Remarks:</span> {report.remarks}
                        </p>
                        <p>
                          <span className="font-medium">Report:</span>
                          <a
                            href={report.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline ml-1"
                          >
                            View Report
                          </a>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No completed lab reports found.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
