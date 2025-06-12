import React from 'react';

// 🚀 DEPLOYMENT TRIGGER - June 12, 2025 10:15 PM
// Force rebuild to deploy book viewer functionality
// New dependencies: stpageflip, pdfjs-dist
// New routes: /book-viewer, /book/:slug

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🧪 Test Page Working!
        </h1>
        <p className="text-lg text-gray-600">
          If you can see this, the routing is working correctly.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Deployed at: {new Date().toISOString()}
        </p>
        <p className="text-xs text-blue-500 mt-2">
          Build trigger: 2025-06-12-22:15
        </p>
      </div>
    </div>
  );
};

export default TestPage;