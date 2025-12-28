'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TaskStatus, Report } from '@/lib/types';
import ReportsSidebar from '@/components/ReportsSidebar';
import ReportDetail from '@/components/ReportDetail';
import NewResearchModal from '@/components/NewResearchModal';
import BackgroundPatternSelector from '@/components/BackgroundPatternSelector';

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
    <div className="min-h-screen relative" style={{ background: 'var(--bg-dark)' }}>
      {/* LCARS Header */}
      <header 
        className="sticky top-0 z-10 relative"
        style={{
          background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
          borderBottom: '4px solid var(--border-teal)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top decorative bars */}
          <div className="flex gap-2 mb-6">
            <div className="h-16 w-32 rounded-full flex items-center justify-center" style={{ background: 'var(--primary-teal)' }}>
              <span className="font-bold text-black text-sm">MAIN</span>
            </div>
            <div className="h-16 flex-1 rounded-full" style={{ background: 'var(--accent-purple)' }} aria-hidden="true"></div>
            <div className="h-16 w-24 rounded-full" style={{ background: 'var(--primary-cyan)' }} aria-hidden="true"></div>
            <div className="h-16 w-24 rounded-full" style={{ background: 'var(--primary-emerald)' }} aria-hidden="true"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold sci-heading mb-2" style={{ color: 'var(--text-primary)' }}>
                SUPPLY CHAIN INTELLIGENCE
              </h1>
              <p className="text-sm sci-text" style={{ color: 'var(--text-secondary)' }}>
                REAL-TIME RISK ANALYSIS & MONITORING SYSTEM
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div 
                  className="px-4 py-2 rounded-full"
                  style={{ background: 'var(--accent-coral)' }}
                >
                  <span className="text-xs font-bold" style={{ color: 'var(--text-dark)' }}>
                    USER: {user.username.toUpperCase()}
                  </span>
                </div>
              )}
              <BackgroundPatternSelector />
              <button
                onClick={handleNewResearch}
                className="px-6 py-3 sci-button"
                style={{
                  background: 'var(--primary-cyan)',
                  color: 'var(--text-dark)',
                  minWidth: '160px',
                }}
              >
                + NEW RESEARCH
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push('/auth');
                }}
                className="px-6 py-3 sci-button"
                style={{
                  background: 'var(--accent-coral)',
                  color: 'var(--text-dark)',
                }}
              >
                LOGOUT
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
      <main className="pt-8 px-4 sm:px-6 lg:px-8 pb-12 sci-scrollbar relative" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto">
          {error && (
            <div 
              className="mb-6 p-4 rounded-2xl corner-tl corner-br"
              style={{
                background: 'linear-gradient(135deg, #1a0a0a 0%, #0a0000 100%)',
                border: '2px solid var(--status-critical)',
              }}
            >
              <span className="sci-text" style={{ color: 'var(--status-critical)' }}>
                ⚠ {error}
              </span>
            </div>
          )}

          {/* Report Detail - Full Width LCARS Style */}
          {loadingReport ? (
            <div 
              className="rounded-3xl shadow-2xl p-12 flex items-center justify-center min-h-[600px]"
              style={{
                background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
                border: '3px solid var(--primary-cyan)',
              }}
            >
              <div className="text-center">
                <div 
                  className="animate-spin rounded-full h-20 w-20 mx-auto mb-6"
                  style={{
                    border: '4px solid var(--bg-dark)',
                    borderTopColor: 'var(--primary-cyan)',
                    boxShadow: '0 0 20px var(--primary-cyan)',
                  }}
                ></div>
                <p className="text-xl font-bold sci-heading" style={{ color: 'var(--primary-cyan)' }}>
                  LOADING REPORT DATA...
                </p>
              </div>
            </div>
          ) : selectedReport ? (
            <ReportDetail report={selectedReport} />
          ) : (
            <div 
              className="rounded-3xl shadow-2xl p-12 flex items-center justify-center min-h-[600px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
                border: '3px solid var(--accent-purple)',
              }}
            >
              {/* Decorative corner elements */}
              <div aria-hidden="true" className="absolute top-4 left-4 w-32 h-32 rounded-full" style={{ background: 'var(--primary-teal)', opacity: 0.1 }}></div>
              <div aria-hidden="true" className="absolute bottom-4 right-4 w-40 h-40 rounded-full" style={{ background: 'var(--primary-cyan)', opacity: 0.1 }}></div>
              
              <div className="text-center max-w-md z-10">
                <div 
                  className="mx-auto h-32 w-32 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'var(--accent-purple)', boxShadow: '0 0 30px var(--shadow-glow-purple)' }}
                >
                  <svg className="h-16 w-16" fill="#000" viewBox="0 0 24 24">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold sci-heading mb-4" style={{ color: 'var(--accent-purple)' }}>
                  NO REPORT SELECTED
                </h3>
                <p className="sci-text mb-8" style={{ color: 'var(--text-secondary)' }}>
                  SELECT A COMPLETED RESEARCH TASK FROM THE MISSION LOGS TO VIEW DETAILED RISK ANALYSIS
                </p>
                <button
                  onClick={handleNewResearch}
                  className="inline-flex items-center px-8 py-4 sci-button"
                  style={{
                    background: 'var(--primary-teal)',
                    color: 'var(--text-dark)',
                  }}
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                  START NEW RESEARCH
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
