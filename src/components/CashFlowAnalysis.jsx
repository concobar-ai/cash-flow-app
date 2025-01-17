import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

const CashFlowAnalysis = () => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    avgPSF: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    const units = JSON.parse(localStorage.getItem('units') || '[]');
    
    calculateMetrics(tenants, units);
    generateChartData(tenants);
  }, []);

  const calculateMetrics = (tenants, units) => {
    const totalSF = units.reduce((sum, unit) => sum + parseFloat(unit.squareFeet || 0), 0);
    const occupiedSF = units
      .filter(unit => unit.status === 'occupied')
      .reduce((sum, unit) => sum + parseFloat(unit.squareFeet || 0), 0);
    
    const totalMonthlyIncome = tenants.reduce((sum, tenant) => 
      sum + parseFloat(tenant.baseRent || 0), 0);

    setMetrics({
      totalIncome: totalMonthlyIncome,
      avgPSF: totalSF ? (totalMonthlyIncome * 12 / totalSF) : 0,
      occupancyRate: totalSF ? (occupiedSF / totalSF) * 100 : 0
    });
  };

  const generateChartData = (tenants) => {
    // Generate 12 months of data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 11 + i);
      
      return {
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        income: tenants.reduce((sum, tenant) => {
          const leaseStart = new Date(tenant.leaseStart);
          const leaseEnd = new Date(tenant.leaseEnd);
          if (date >= leaseStart && date <= leaseEnd) {
            return sum + parseFloat(tenant.baseRent || 0);
          }
          return sum;
        }, 0),
        expenses: tenants.reduce((sum, tenant) => {
          const leaseStart = new Date(tenant.leaseStart);
          const leaseEnd = new Date(tenant.leaseEnd);
          if (date >= leaseStart && date <= leaseEnd) {
            return sum + parseFloat(tenant.additionalRent || 0);
          }
          return sum;
        }, 0)
      };
    });

    setData(monthlyData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <span className="text-sm text-gray-500">Monthly Income</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalIncome)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <span className="text-sm text-gray-500">Average PSF</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              ${metrics.avgPSF.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <Users className="h-8 w-8 text-purple-500" />
            <span className="text-sm text-gray-500">Occupancy Rate</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              {metrics.occupancyRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Income Analysis</h2>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={value => `$${value/1000}k`} />
              <Tooltip
                formatter={value => formatCurrency(value)}
                labelFormatter={label => `Income for ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#4f46e5"
                fill="#818cf8"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="1"
                stroke="#10b981"
                fill="#34d399"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CashFlowAnalysis;
