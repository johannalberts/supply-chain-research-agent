"use client";

import { Report } from '@/lib/types';
import RadialGauge from './RadialGauge';

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
          background: 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
          border: '4px solid #14b8a6',
        }}
      >
        {/* Top decorative bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-2 p-4">
          <div className="h-3 flex-1 rounded-full" style={{ background: '#14b8a6' }}></div>
          <div className="h-3 w-20 rounded-full" style={{ background: '#a855f7' }}></div>
          <div className="h-3 w-20 rounded-full" style={{ background: '#06b6d4' }}></div>
          <div className="h-3 w-20 rounded-full" style={{ background: '#10b981' }}></div>
        </div>

        <div className="mt-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold sci-heading mb-2" style={{ color: '#14b8a6' }}>
                {report.industry}
              </h2>
              <p className="sci-text text-lg" style={{ color: '#06b6d4' }}>
                SUPPLY CHAIN RISK ANALYSIS
              </p>
            </div>
            <div 
              className="text-right px-4 py-2 rounded-full"
              style={{ 
                background: '#f97316',
                fontFamily: 'Orbitron, monospace',
              }}
            >
              <div className="text-xs font-bold" style={{ color: '#000' }}>
                DATE
              </div>
              <div className="font-bold" style={{ color: '#000' }}>
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
          <RadialGauge 
            value={report.fragility_score} 
            label="OVERALL FRAGILITY"
            size={220}
          />
        </div>

        {/* Bottom decorative bars */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
          <div className="h-3 w-20 rounded-full" style={{ background: '#f97316' }}></div>
          <div className="h-3 w-20 rounded-full" style={{ background: '#f59e0b' }}></div>
          <div className="h-3 flex-1 rounded-full" style={{ background: '#fb7185' }}></div>
        </div>
      </div>

      {/* Executive Summary - LCARS Style */}
      <div 
        className="rounded-3xl p-6 shadow-xl corner-tl corner-br"
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
          border: '3px solid #06b6d4',
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#06b6d4' }}
          >
            <svg className="w-8 h-8" fill="#000" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold sci-heading mb-4" style={{ color: '#06b6d4' }}>
              EXECUTIVE SUMMARY
            </h3>
            <p className="sci-text leading-relaxed whitespace-pre-wrap" style={{ color: '#14b8a6' }}>
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
            background: 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
            border: '3px solid #a855f7',
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#a855f7' }}
            >
              <svg className="w-8 h-8" fill="#000" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold sci-heading" style={{ color: '#a855f7' }}>
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
                  border: '2px solid #f97316',
                }}
              >
                <div className="flex flex-col items-center">
                  <RadialGauge 
                    value={metric.impact_score} 
                    label={metric.category.toUpperCase()}
                    size={160}
                  />
                  <p className="mt-4 text-sm text-center sci-text" style={{ color: '#06b6d4' }}>
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
            border: '4px solid #ef4444',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
          }}
        >
          {/* Alert icon with pulse */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: '#ef4444', boxShadow: '0 0 20px #ef4444' }}
          >
            <svg className="w-8 h-8" fill="#000" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold sci-heading mb-6 flex items-center" style={{ color: '#ef4444' }}>
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
                  border: '2px solid #ef4444',
                }}
              >
                <span 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5"
                  style={{
                    background: '#ef4444',
                    color: '#000',
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 900,
                  }}
                >
                  {idx + 1}
                </span>
                <span className="sci-text flex-1" style={{ color: '#14b8a6' }}>
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
