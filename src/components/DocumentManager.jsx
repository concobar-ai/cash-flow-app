import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';

const DocumentManager = () => {
  const [documents, setDocuments] = useState(() => {
    const savedDocs = localStorage.getItem('documents');
    return savedDocs ? JSON.parse(savedDocs) : [];
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create document entry
    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      tenantId: null, // Set when associated with tenant
      category: 'lease', // Default category
      status: 'active',
      description: ''
    };

    setDocuments(prev => {
      const updated = [...prev, newDoc];
      localStorage.setItem('documents', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDelete = (id) => {
    setDocuments(prev => {
      const updated = prev.filter(doc => doc.id !== id);
      localStorage.setItem('documents', JSON.stringify(updated));
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Document Management</span>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No documents uploaded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentManager;
