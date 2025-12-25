'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface NewResearchModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const INDUSTRIES = [
  'Automotive',
  'Technology',
  'Healthcare',
  'Manufacturing',
  'Energy',
  'Pharmaceuticals',
  'Semiconductors',
  'Aerospace',
  'Telecommunications',
  'Retail',
  'Food & Beverage',
  'Chemicals',
];

export default function NewResearchModal({ onClose, onSubmit }: NewResearchModalProps) {
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedIndustry = industry === 'custom' ? customIndustry : industry;
    
    if (!selectedIndustry.trim()) {
      setError('Please select or enter an industry');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitResearch({ industry: selectedIndustry });
      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit research request');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              New Research Request
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select an industry...</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
              <option value="custom">Custom (specify below)</option>
            </select>
          </div>

          {industry === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Custom Industry
              </label>
              <input
                type="text"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                placeholder="Enter industry name..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Research typically takes 2-5 minutes. You'll be able to track
              progress in the dashboard.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                'Start Research'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
