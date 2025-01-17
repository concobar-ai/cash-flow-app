import React from 'react';
import { Upload, Download, FileText } from 'lucide-react';

const DataTransfer = () => {
  const exportData = (type) => {
    // Placeholder for export functionality
    console.log(`Exporting ${type} data...`);
  };

  const handleImport = (e, type) => {
    // Placeholder for import functionality
    console.log(`Importing ${type} data...`);
  };

  const dataTypes = [
    { id: 'tenants', name: 'Tenants' },
    { id: 'units', name: 'Units' },
    { id: 'maintenance', name: 'Maintenance' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dataTypes.map(type => (
          <div key={type.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">{type.name}</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => exportData(type.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Download className="h-4 w-4" />
                Export {type.name}
              </button>
              
              <label className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer">
                <Upload className="h-4 w-4" />
                Import {type.name}
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={(e) => handleImport(e, type.id)}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Import Instructions:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Files must be in CSV format</li>
          <li>Headers must match expected format</li>
          <li>Dates should be in YYYY-MM-DD format</li>
          <li>Numbers should use period (.) as decimal separator</li>
        </ul>
      </div>
    </div>
  );
};

export default DataTransfer;
