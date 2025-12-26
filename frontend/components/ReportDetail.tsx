"use client";

import { Report } from '@/lib/types';
import RadialGauge from './RadialGauge';

interface ReportDetailProps {
  report: Report;
}

export default function ReportDetail({ report }: ReportDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header with Fragility Score */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{report.industry}</h2>
            <p className="text-slate-300">Supply Chain Risk Analysis</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Generated</div>
            <div className="text-white font-medium">
              {new Date(report.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        
        {/* Main Fragility Gauge */}
        <div className="flex justify-center py-4">
          <RadialGauge 
            value={report.fragility_score} 
            label="Overall Fragility Score"
            size={200}
          />
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Executive Summary
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {report.executive_summary}
        </p>
      </div>

      {/* Risk Metrics - Radial Gauges */}
      {report.risk_metrics && report.risk_metrics.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Risk Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {report.risk_metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <RadialGauge 
                  value={metric.impact_score} 
                  label={metric.category}
                  size={160}
                />
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center max-w-xs">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Alerts */}
      {report.critical_alerts && report.critical_alerts.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 shadow-lg border-2 border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Critical Alerts
          </h3>
          <ul className="space-y-3">
            {report.critical_alerts.map((alert, idx) => (
              <li key={idx} className="flex items-start bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
                <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 flex-1">
                  {alert}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
