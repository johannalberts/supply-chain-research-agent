'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TaskStatus, Report } from '@/lib/types';
import ReportsSidebar from '@/components/ReportsSidebar';
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

      {/* Collapsible Sidebar */}
      <ReportsSidebar
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onSelectTask={handleTaskSelect}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Main Content */}
      <main className="pt-8 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Report Detail - Full Width */}
          {loadingReport ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-12 flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">Loading report...</p>
              </div>
            </div>
          ) : selectedReport ? (
            <ReportDetail report={selectedReport} />
          ) : (
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-12 flex items-center justify-center min-h-[600px]">
              <div className="text-center max-w-md">
                <div className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-700 mb-6">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  No Report Selected
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Select a completed research task from the sidebar to view its detailed risk analysis
                </p>
                <button
                  onClick={handleNewResearch}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start New Research
                </button>
              </div>
            </div>
          )}
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
