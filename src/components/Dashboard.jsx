import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import CashFlowAnalysis from './CashFlowAnalysis';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  // Calculate lease expirations
  const leaseExpirations = [
    { tenant: 'Ava Wray Boutique', date: '2027-02-28' },
    { tenant: 'Bahama Mama', date: '2034-12-31' },
    { tenant: 'Edible Arrangements', date: '2033-02-28' },
    { tenant: 'Lucky Nails', date: '2029-07-31' },
    { tenant: 'Rodriguez Restaurant', date: '2029-09-30' },
    { tenant: 'Smart Shop', date: '2029-05-04' },
    { tenant: 'Sunrise Donuts', date: '2027-08-31' },
    { tenant: "Charlie's Watch Bar", date: '2030-04-30' },
    { tenant: 'Di Maria Restaurant', date: '2029-12-31' }
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcomingExpirations = leaseExpirations.filter(
    lease => new Date(lease.date) <= new Date('2025-12-31')
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$51,432.81</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average PSF</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24.86</div>
            <p className="text-xs text-muted-foreground">
              Blended rate across all tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              20,948 SF Total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lease Expirations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExpirations.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 12 months
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="leases">Leases</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Income Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#2563eb" />
                    <Line type="monotone" dataKey="projection" stroke="#9333ea" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tenant Mix</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateTenantData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sf" fill="#2563eb" />
                    <Bar dataKey="rent" fill="#9333ea" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardContent className="pt-6">
              <CashFlowAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leases">
          <Card>
            <CardContent className="pt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Tenant</th>
                    <th className="text-left p-2">Expiration</th>
                    <th className="text-right p-2">Current Rent</th>
                    <th className="text-right p-2">SF</th>
                    <th className="text-right p-2">PSF</th>
                  </tr>
                </thead>
                <tbody>
                  {leaseExpirations.map((lease, index) => (
                    <tr key={lease.tenant} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2">{lease.tenant}</td>
                      <td className="p-2">{new Date(lease.date).toLocaleDateString()}</td>
                      <td className="p-2 text-right">$0.00</td>
                      <td className="p-2 text-right">0</td>
                      <td className="p-2 text-right">$0.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 p-4 border rounded hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  Export to Excel
                </button>
                <button className="flex items-center justify-center gap-2 p-4 border rounded hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  Export to PDF
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
