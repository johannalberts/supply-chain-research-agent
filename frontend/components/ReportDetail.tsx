"use client";

import { Report } from '@/lib/types';
import NumericalGauge from './NumericalGauge';

interface ReportDetailProps {
  report: Report;
}

export default function ReportDetail({ report }: ReportDetailProps) {
  return (
    <div className="space-y-6">
      {/* LCARS Header with Fragility Score */}
      <div 
        className="rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
          border: '4px solid var(--border-teal)',
        }}
      >
        {/* Top decorative bars */}
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 flex gap-2 p-4">
          <div aria-hidden="true" className="h-3 flex-1 rounded-full" style={{ background: 'var(--primary-teal)' }}></div>
          <div aria-hidden="true" className="h-3 w-20 rounded-full" style={{ background: 'var(--accent-purple)' }}></div>
          <div aria-hidden="true" className="h-3 w-20 rounded-full" style={{ background: 'var(--primary-cyan)' }}></div>
          <div aria-hidden="true" className="h-3 w-20 rounded-full" style={{ background: 'var(--primary-emerald)' }}></div>
        </div>

        <div className="mt-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold sci-heading mb-2" style={{ color: 'var(--text-primary)' }}>
                {report.industry}
              </h2>
              <p className="sci-text text-lg" style={{ color: 'var(--text-secondary)' }}>
                SUPPLY CHAIN RISK ANALYSIS
              </p>
            </div>
            <div 
              className="text-right px-4 py-2 rounded-full"
              style={{ 
                background: 'var(--accent-coral)',
                fontFamily: 'Orbitron, monospace',
              }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--text-dark)' }}>
                DATE
              </div>
              <div className="font-bold" style={{ color: 'var(--text-dark)' }}>
                {new Date(report.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Fragility Gauge */}
        <div className="flex justify-center py-6">
          <NumericalGauge 
            value={report.fragility_score} 
            label="OVERALL FRAGILITY"
            size={220}
          />
        </div>

        {/* Bottom decorative bars */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
          <div className="h-3 w-20 rounded-full" style={{ background: 'var(--accent-coral)' }}></div>
          <div className="h-3 w-20 rounded-full" style={{ background: 'var(--accent-amber)' }}></div>
          <div className="h-3 flex-1 rounded-full" style={{ background: 'var(--accent-rose)' }}></div>
        </div>
      </div>

      {/* Executive Summary - LCARS Style */}
      <div 
        className="rounded-3xl p-6 shadow-xl corner-tl corner-br"
        style={{
          background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
          border: '3px solid var(--border-teal)',
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--primary-cyan)' }}
          >
            <svg className="w-8 h-8" fill="var(--text-dark)" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold sci-heading mb-4" style={{ color: 'var(--text-secondary)' }}>
              EXECUTIVE SUMMARY
            </h3>
            <p className="sci-text leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
              {report.executive_summary}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Metrics - LCARS Grid */}
      {report.risk_metrics && report.risk_metrics.length > 0 && (
        <div 
          className="rounded-3xl p-6 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
            border: '3px solid var(--accent-purple)',
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-purple)' }}
            >
              <svg className="w-8 h-8" fill="var(--text-dark)" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold sci-heading" style={{ color: 'var(--accent-purple)' }}>
              RISK METRICS
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.risk_metrics.map((metric, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl corner-tr corner-bl"
                style={{
                  background: 'rgba(15, 20, 25, 0.6)',
                  border: '2px solid var(--border-coral)',
                }}
              >
                <div className="flex flex-col items-center">
                  <NumericalGauge 
                    value={metric.impact_score} 
                    label={metric.category.toUpperCase()}
                    size={160}
                  />
                  <p className="mt-4 text-sm text-center sci-text" style={{ color: 'var(--text-secondary)' }}>
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Alerts - LCARS Style */}
      {report.critical_alerts && report.critical_alerts.length > 0 && (
        <div 
          className="rounded-3xl p-6 shadow-xl relative"
          style={{
            background: 'linear-gradient(135deg, #1a0a0a 0%, #0a0000 100%)',
            border: '4px solid var(--status-critical)',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
          }}
        >
          {/* Alert icon with pulse */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: 'var(--status-critical)', boxShadow: '0 0 20px var(--status-critical)' }}
          >
            <svg className="w-8 h-8" fill="var(--text-dark)" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold sci-heading mb-6 flex items-center" style={{ color: 'var(--status-critical)' }}>
            <svg className="w-8 h-8 mr-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            CRITICAL ALERTS
          </h3>
          
          <ul className="space-y-3">
            {report.critical_alerts.map((alert, idx) => (
              <li 
                key={idx} 
                className="flex items-start rounded-2xl p-4 corner-tl corner-br"
                style={{
                  background: 'rgba(15, 20, 25, 0.8)',
                  border: '2px solid var(--status-critical)',
                }}
              >
                <span 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5"
                  style={{
                    background: 'var(--status-critical)',
                    color: 'var(--text-dark)',
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 900,
                  }}
                >
                  {idx + 1}
                </span>
                <span className="sci-text flex-1" style={{ color: 'var(--text-primary)' }}>
                  {alert}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources - LCARS Style */}
      {report.sources && report.sources.length > 0 && (
        <div 
          className="rounded-3xl p-6 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
            border: '3px solid var(--primary-emerald)',
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--primary-emerald)' }}
            >
              <svg className="w-8 h-8" fill="var(--text-dark)" viewBox="0 0 24 24">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold sci-heading" style={{ color: 'var(--primary-emerald)' }}>
              SOURCE REFERENCES
            </h3>
          </div>
          
          <div className="space-y-3">
            {report.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-2xl corner-tr corner-bl transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(15, 20, 25, 0.6)',
                  border: '2px solid var(--border-emerald)',
                }}
              >
                <div className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-0.5"
                    style={{
                      background: 'var(--primary-emerald)',
                      color: 'var(--text-dark)',
                      fontFamily: 'Orbitron, monospace',
                      fontWeight: 900,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="sci-text font-semibold mb-1" style={{ color: 'var(--primary-emerald)' }}>
                      {source.title}
                    </p>
                    <p className="text-xs sci-text break-all" style={{ color: 'var(--text-secondary)' }}>
                      {source.url}
                    </p>
                  </div>
                  <svg className="w-5 h-5 flex-shrink-0 mt-1" fill="none" stroke="var(--primary-emerald)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
