import React, { useState } from 'react';

const UnitManagement = () => {
  const [units] = useState([
    { id: 1, number: '101', type: 'Retail', size: '1,200 sf', status: 'Occupied' },
    { id: 2, number: '102', type: 'Office', size: '800 sf', status: 'Available' },
    { id: 3, number: '103', type: 'Restaurant', size: '2,000 sf', status: 'Occupied' },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Unit Management</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Unit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map(unit => (
          <div key={unit.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Unit {unit.number}</h3>
                <p className="text-sm text-gray-500">{unit.type}</p>
                <p className="text-sm text-gray-500">{unit.size}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                unit.status === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {unit.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitManagement;
