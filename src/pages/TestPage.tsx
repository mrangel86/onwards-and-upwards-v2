import React from 'react';

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
      </div>
    </div>
  );
};

export default TestPage;