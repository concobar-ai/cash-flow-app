import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar, ArrowRightCircle } from 'lucide-react';

const OccupancyTracking = () => {
  const [occupancyHistory, setOccupancyHistory] = useState(() => {
    const savedHistory = localStorage.getItem('occupancyHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [units, setUnits] = useState(() => {
    const savedUnits = localStorage.getItem('units');
    return savedUnits ? JSON.parse(savedUnits) : [];
  });

  const [tenants, setTenants] = useState(() => {
    const savedTenants = localStorage.getItem('tenants');
    return savedTenants ? JSON.parse(savedTenants) : [];
  });

  const [filters, setFilters] = useState({
    unit: 'all',
    year: new Date().getFullYear().toString(),
    status: 'all'
  });

  useEffect(() => {
    // Load latest data whenever component mounts
    const latestUnits = localStorage.getItem('units');
    const latestTenants = localStorage.getItem('tenants');
    const latestHistory = localStorage.getItem('occupancyHistory');

    if (latestUnits) setUnits(JSON.parse(latestUnits));
    if (latestTenants) setTenants(JSON.parse(latestTenants));
    if (latestHistory) setOccupancyHistory(JSON.parse(latestHistory));
  }, []);

  const calculateMetrics = () => {
    const totalSF = units.reduce((sum, unit) => sum + parseFloat(unit.squareFeet || 0), 0);
    const occupiedSF = units
      .filter(unit => unit.status === 'occupied')
      .reduce((sum, unit) => sum + parseFloat(unit.squareFeet || 0), 0);
    
    return {
      totalUnits: units.length,
      occupiedUnits: units.filter(unit => unit.status === 'occupied').length,
      occupancyRate: totalSF ? ((occupiedSF / totalSF) * 100).toFixed(1) : 0,
      totalSF,
      occupiedSF,
      averageRentPSF: calculateAverageRent()
    };
  };

  const calculateAverageRent = () => {
    const occupiedUnits = units.filter(unit => unit.status === 'occupied');
    if (occupiedUnits.length === 0) return 0;
    
    const totalRent = occupiedUnits.reduce((sum, unit) => sum + parseFloat(unit.baseRentPSF || 0), 0);
    return (totalRent / occupiedUnits.length).toFixed(2);
  };

  const filterHistory = () => {
    return occupancyHistory.filter(item => {
      const matchesUnit = filters.unit === 'all' || item.unitId === filters.unit;
      const matchesYear = filters.year === 'all' || 
        new Date(item.date).getFullYear().toString() === filters.year;
      const matchesStatus = filters.status === 'all' || item.type === filters.status;
      return matchesUnit && matchesYear && matchesStatus;
    });
  };

  const getUnitNumber = (unitId) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.number : 'Unknown Unit';
  };

  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Unknown Tenant';
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{metrics.occupancyRate}%</div>
              <div className="text-sm text-gray-500">Occupancy Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">
                {metrics.occupiedUnits}/{metrics.totalUnits}
              </div>
              <div className="text-sm text-gray-500">Occupied Units</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <ArrowRightCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">${metrics.averageRentPSF}</div>
              <div className="text-sm text-gray-500">Average PSF</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{metrics.occupiedSF.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Occupied SF</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Occupancy History</CardTitle>
            <div className="flex gap-2">
              <select
                value={filters.unit}
                onChange={(e) => setFilters(prev => ({ ...prev, unit: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="all">All Units</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>Unit {unit.number}</option>
                ))}
              </select>
              
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="all">All Years</option>
                {Array.from(new Set(occupancyHistory.map(item => 
                  new Date(item.date).getFullYear()
                ))).sort().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filterHistory().map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">Unit {getUnitNumber(item.unitId)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()} • {item.type}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
            {filterHistory().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No occupancy history found for the selected filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OccupancyTracking;
