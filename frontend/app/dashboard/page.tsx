'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TaskStatus, Report } from '@/lib/types';
import ReportsList from '@/components/ReportsList';
import ReportDetail from '@/components/ReportDetail';
import NewResearchModal from '@/components/NewResearchModal';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('COMPLETED');
  const [showNewResearchModal, setShowNewResearchModal] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Fetch tasks list
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.listTasks({ status: filterStatus, limit: 100 });
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch report details
  const fetchReport = async (taskId: string) => {
    try {
      setLoadingReport(true);
      const report = await api.getTaskReport(taskId);
      setSelectedReport(report);
      setSelectedTaskId(taskId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
      setSelectedReport(null);
    } finally {
      setLoadingReport(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  // Auto-refresh for pending/processing tasks
  useEffect(() => {
    const hasPendingTasks = tasks.some(t => 
      t.status === 'PENDING' || t.status === 'PROCESSING'
    );

    if (hasPendingTasks) {
      const interval = setInterval(fetchTasks, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [tasks]);

  const handleTaskSelect = (taskId: string) => {
    if (selectedTaskId === taskId) {
      // Deselect if clicking the same task
      setSelectedTaskId(null);
      setSelectedReport(null);
    } else {
      fetchReport(taskId);
    }
  };

  const handleNewResearch = () => {
    setShowNewResearchModal(true);
  };

  const handleResearchSubmitted = () => {
    setShowNewResearchModal(false);
    setFilterStatus(''); // Show all to see the new task
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Supply Chain Intelligence
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Real-time risk analysis and monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Welcome, {user.username}
                </span>
              )}
              <button
                onClick={handleNewResearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                + New Research
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push('/auth');
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <ReportsList
              tasks={tasks}
              loading={loading}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              onRefresh={fetchTasks}
            />
          </div>

          {/* Report Detail */}
          <div className="lg:col-span-2">
            {loadingReport ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">Loading report...</p>
                </div>
              </div>
            ) : selectedReport ? (
              <ReportDetail report={selectedReport} />
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
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
                  <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                    No report selected
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Select a completed research task to view its report
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Research Modal */}
      {showNewResearchModal && (
        <NewResearchModal
          onClose={() => setShowNewResearchModal(false)}
          onSubmit={handleResearchSubmitted}
        />
      )}
    </div>
  );
}
