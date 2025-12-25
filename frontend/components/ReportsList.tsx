import { TaskStatus } from '@/lib/types';

interface ReportsListProps {
  tasks: TaskStatus[];
  loading: boolean;
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  onRefresh: () => void;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function ReportsList({
  tasks,
  loading,
  selectedTaskId,
  onTaskSelect,
  filterStatus,
  onFilterChange,
  onRefresh,
}: ReportsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Research Reports
          </h2>
          <button
            onClick={onRefresh}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <svg
              className="w-4 h-4 text-slate-600 dark:text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Processing</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Loading...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <p>No reports found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {tasks.map((task) => (
              <button
                key={task.task_id}
                onClick={() => task.status === 'COMPLETED' && onTaskSelect(task.task_id)}
                disabled={task.status !== 'COMPLETED'}
                className={`w-full p-4 text-left transition-colors ${
                  task.status === 'COMPLETED'
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'
                    : 'cursor-not-allowed opacity-60'
                } ${
                  selectedTaskId === task.task_id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate">
                      {task.industry}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatDate(task.created_at)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[task.status]
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {task.status === 'PROCESSING' && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {task.progress}% complete
                    </p>
                  </div>
                )}

                {task.status === 'FAILED' && task.error_message && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 line-clamp-2">
                    {task.error_message}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
