import React from 'react';

interface AdvisorProps {
  message: string | null;
  loading: boolean;
}

const Advisor: React.FC<AdvisorProps> = ({ message, loading }) => {
  if (!message && !loading) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-2">
      <div className="relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0">
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-yellow-500 mb-1">Gemini Insights</h4>
            <p className="text-sm text-gray-300 italic">
              {loading ? "Analyzing blockchain dust..." : `"${message}"`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisor;