
import React from 'react';

interface DebugInfoProps {
  debugInfo: any;
  cacheBuster: string;
  buildVersion: string;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ debugInfo, cacheBuster, buildVersion }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
      <h3 className="font-bold mb-4">🐛 Debug Information (v3.0 NEW DEPLOYMENT)</h3>
      <div className="space-y-3 text-sm">
        <div>
          <strong>Build Version:</strong> <code>{buildVersion}</code>
        </div>
        <div>
          <strong>New Deployment:</strong> <span className="text-green-600">✅ ACTIVE</span>
        </div>
        <div>
          <strong>Cache Buster:</strong> <code>{cacheBuster}</code>
        </div>
        <div>
          <strong>Slug:</strong> <code>{debugInfo.slug}</code>
        </div>
        <div>
          <strong>Field Used:</strong> <code className="text-green-600">{debugInfo.fieldUsed || 'slug'}</code>
        </div>
        <div>
          <strong>NOT Using:</strong> <code className="text-red-600">{debugInfo.NOT_USING || 'preview_slug'}</code>
        </div>
        <div>
          <strong>Query:</strong> <code>{debugInfo.queryAttempted}</code>
        </div>
        <div>
          <strong>Expected Endpoint:</strong> <code className="text-xs">https://zrtgkvpbptxueetuqlmb.supabase.co/rest/v1/post_previews</code>
        </div>
        <div>
          <strong>Data Count:</strong> {debugInfo.dataCount}
        </div>
        {debugInfo.error && (
          <div>
            <strong>Error:</strong>
            <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto">
              {JSON.stringify(debugInfo.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugInfo;
