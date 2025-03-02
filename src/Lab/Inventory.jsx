import React from 'react';

export default function Inventory() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lab Inventory</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Equipment</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">No equipment records found</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Supplies</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">No supplies records found</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Reagents</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">No reagents records found</p>
          </div>
        </div>
      </div>
    </div>
  );
}
