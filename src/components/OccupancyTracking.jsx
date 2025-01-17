import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OccupancyTracking = () => {
  const data = [
    { month: 'Jan', occupancy: 85 },
    { month: 'Feb', occupancy: 88 },
    { month: 'Mar', occupancy: 92 },
    { month: 'Apr', occupancy: 95 },
    { month: 'May', occupancy: 95 },
    { month: 'Jun', occupancy: 97 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Current Occupancy</h3>
          <p className="text-2xl font-bold">97%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Units</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Available Units</h3>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Occupancy Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="occupancy" stroke="#4f46e5" name="Occupancy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OccupancyTracking;
