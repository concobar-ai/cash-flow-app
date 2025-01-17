import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DownloadCloud, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

const DataTransfer = () => {
  const [importErrors, setImportErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const exportData = (type) => {
    const data = localStorage.getItem(type);
    if (!data) {
      setImportErrors([`No ${type} data found to export`]);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      let csvData;

      switch (type) {
        case 'tenants':
          csvData = jsonData.map(tenant => ({
            name: tenant.name,
            leaseStart: tenant.leaseStart,
            leaseEnd: tenant.leaseEnd,
            baseRent: tenant.baseRent,
            squareFeet: tenant.squareFeet,
            status: tenant.status
          }));
          break;
        case 'units':
          csvData = jsonData.map(unit => ({
            number: unit.number,
            type: unit.type,
            squareFeet: unit.squareFeet,
            baseRentPSF: unit.baseRentPSF,
            status: unit.status,
            features: unit.features ? unit.features.join(';') : ''
          }));
          break;
        case 'payments':
          csvData = jsonData.map(payment => ({
            tenantId: payment.tenantId,
            amount: payment.amount,
            date: payment.date,
            type: payment.type,
            status: payment.status,
            memo: payment.memo
          }));
          break;
        default:
          throw new Error(`Unsupported data type: ${type}`);
      }

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage(`Successfully exported ${type} data`);
      setImportErrors([]);
    } catch (error) {
      setImportErrors([`Error exporting ${type}: ${error.message}`]);
    }
  };

  const importData = async (type, file) => {
    setImportErrors([]);
    setSuccessMessage('');

    if (!file) {
      setImportErrors(['No file selected']);
      return;
    }

    try {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setImportErrors(results.errors.map(error => error.message));
            return;
          }

          let processedData;
          try {
            switch (type) {
              case 'tenants':
                processedData = results.data.map(row => ({
                  id: Date.now() + Math.random(),
                  name: row.name || '',
                  leaseStart: row.leaseStart || '',
                  leaseEnd: row.leaseEnd || '',
                  baseRent: parseFloat(row.baseRent) || 0,
                  squareFeet: parseInt(row.squareFeet) || 0,
                  status: row.status || 'active'
                }));
                break;
              case 'units':
                processedData = results.data.map(row => ({
                  id: Date.now() + Math.random(),
                  number: row.number || '',
                  type: row.type || '',
                  squareFeet: parseInt(row.squareFeet) || 0,
                  baseRentPSF: parseFloat(row.baseRentPSF) || 0,
                  status: row.status || 'available',
                  features: row.features ? row.features.split(';') : []
                }));
                break;
              case 'payments':
                processedData = results.data.map(row => ({
                  id: Date.now() + Math.random(),
                  tenantId: row.tenantId || '',
                  amount: parseFloat(row.amount) || 0,
                  date: row.date || new Date().toISOString().split('T')[0],
                  type: row.type || 'rent',
                  status: row.status || 'completed',
                  memo: row.memo || ''
                }));
                break;
              default:
                throw new Error(`Unsupported data type: ${type}`);
            }

            localStorage.setItem(type, JSON.stringify(processedData));
            setSuccessMessage(`Successfully imported ${processedData.length} ${type}`);
            setImportErrors([]);
          } catch (error) {
            setImportErrors([`Error processing ${type} data: ${error.message}`]);
          }
        },
        error: (error) => {
          setImportErrors([`Error parsing CSV: ${error.message}`]);
        }
      });
    } catch (error) {
      setImportErrors([`Error reading file: ${error.message}`]);
    }
  };

  const dataTypes = [
    { type: 'tenants', label: 'Tenants' },
    { type: 'units', label: 'Units' },
    { type: 'payments', label: 'Payments' }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Import/Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataTypes.map(({ type, label }) => (
              <div key={type} className="border rounded p-4">
                <h3 className="font-medium mb-4">{label}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => exportData(type)}
                    className="flex items-center justify-center gap-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Export {label}
                  </button>
                  
                  <label className="flex items-center justify-center gap-2 w-full p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer">
                    <UploadCloud className="h-4 w-4" />
                    Import {label}
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={(e) => importData(type, e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {successMessage}
            </div>
          )}

          {importErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                Import Errors:
              </div>
              <ul className="list-disc list-inside">
                {importErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Import Instructions:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Files must be in CSV format</li>
          <li>Required columns vary by data type</li>
          <li>Dates should be in YYYY-MM-DD format</li>
          <li>Numbers should use period (.) as decimal separator</li>
          <li>Features should be semicolon-separated</li>
        </ul>
      </div>
    </div>
  );
};

export default DataTransfer;
