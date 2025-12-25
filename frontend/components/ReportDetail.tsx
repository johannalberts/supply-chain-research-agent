import { Report } from '@/lib/types';

interface ReportDetailProps {
  report: Report;
}

const getFragilityColor = (score: number) => {
  if (score >= 8) return 'text-red-600 dark:text-red-400';
  if (score >= 6) return 'text-orange-600 dark:text-orange-400';
  if (score >= 4) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
};

const getFragilityLabel = (score: number) => {
  if (score >= 8) return 'Critical';
  if (score >= 6) return 'High';
  if (score >= 4) return 'Moderate';
  return 'Low';
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Logistics: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Labor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    Geopolitical: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
};

export default function ReportDetail({ report }: ReportDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{report.industry}</h2>
            <p className="text-blue-100 text-sm mt-1">{formatDate(report.created_at)}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-100">Fragility Score</div>
            <div className="text-4xl font-bold mt-1">{report.fragility_score}/10</div>
            <div className="text-sm font-medium text-blue-100 mt-1">
              {getFragilityLabel(report.fragility_score)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <section>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Executive Summary
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {report.executive_summary}
          </p>
        </section>

        {/* Critical Alerts */}
        <section>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Critical Alerts
          </h3>
          <div className="space-y-3">
            {report.critical_alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  index === 0 && alert.includes('CRITICAL')
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                }`}
              >
                <p className="text-sm text-slate-900 dark:text-slate-100">{alert}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Metrics */}
        <section>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Risk Metrics
          </h3>
          <div className="grid gap-4">
            {report.risk_metrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                      metric.category
                    )}`}
                  >
                    {metric.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Impact:
                    </span>
                    <span
                      className={`text-lg font-bold ${getFragilityColor(metric.impact_score)}`}
                    >
                      {metric.impact_score}/10
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
