import React from 'react';

export default function TestRequests() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Requests</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
          <p className="text-gray-600">No pending test requests</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Requests</h2>
          <p className="text-gray-600">No recent test requests</p>
        </div>
      </div>
    </div>
  );
}
