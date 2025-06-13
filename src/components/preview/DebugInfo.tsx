
import React from 'react';

interface DebugInfoProps {
  debugInfo: any;
  cacheBuster: string;
  buildVersion: string;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ debugInfo, cacheBuster, buildVersion }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
      <h3 className="font-bold mb-4">🐛 Enhanced Debug Information (v4.2)</h3>
      <div className="space-y-3 text-sm">
        <div>
          <strong>Build Version:</strong> <code>{buildVersion}</code>
        </div>
        <div>
          <strong>Enhanced Debugging:</strong> <span className="text-green-600">✅ ACTIVE</span>
        </div>
        <div>
          <strong>Cache Buster:</strong> <code>{cacheBuster}</code>
        </div>
        <div>
          <strong>Requested Slug:</strong> <code>{debugInfo.slug}</code>
        </div>
        <div>
          <strong>Primary Field:</strong> <code className="text-green-600">{debugInfo.primaryField || 'slug'}</code>
        </div>
        <div>
          <strong>Query Used:</strong> <code>{debugInfo.queryAttempted}</code>
        </div>
        <div>
          <strong>Supabase Endpoint:</strong> <code className="text-xs">{debugInfo.supabaseUrl}/rest/v1/post_previews</code>
        </div>
        <div>
          <strong>Results Found:</strong> {debugInfo.dataCount || 0}
        </div>
        <div>
          <strong>Total Previews in DB:</strong> {debugInfo.totalCount || 'Unknown'}
        </div>
        {debugInfo.fallbackAttempted && (
          <div>
            <strong>Fallback Queries:</strong> <span className="text-blue-600">✅ Attempted</span>
          </div>
        )}
        {debugInfo.allAvailablePreviews && (
          <div>
            <strong>Available Slugs:</strong> {debugInfo.allAvailablePreviews.length} found
            <div className="mt-1 max-h-32 overflow-y-auto text-xs">
              {debugInfo.allAvailablePreviews.map((preview: any, idx: number) => (
                <div key={idx} className="py-1">
                  <code className="bg-gray-100 px-1 rounded">{preview.slug}</code>
                </div>
              ))}
            </div>
          </div>
        )}
        {debugInfo.error && (
          <div>
            <strong>Error Details:</strong>
            <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto max-h-32">
              {JSON.stringify(debugInfo.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugInfo;
