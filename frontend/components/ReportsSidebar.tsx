"use client";

import { useState } from 'react';
import { TaskStatus } from '@/lib/types';

interface ReportsSidebarProps {
  tasks: TaskStatus[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export default function ReportsSidebar({
  tasks,
  selectedTaskId,
  onSelectTask,
  filterStatus,
  onFilterChange,
}: ReportsSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Group tasks by date
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = new Date(task.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, TaskStatus[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-24 z-50 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
        aria-label="Toggle sidebar"
      >
        <svg
          className={`w-5 h-5 text-slate-700 dark:text-slate-300 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 bottom-0 w-96 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Research Reports
            </h2>
            
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Reports</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Reports List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(groupedTasks).map(([date, dateTasks]) => (
              <div key={date}>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  {date}
                </div>
                <div className="space-y-2">
                  {dateTasks.map((task) => (
                    <button
                      key={task.task_id}
                      onClick={() => onSelectTask(task.task_id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedTaskId === task.task_id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-slate-900 dark:text-white text-sm truncate flex-1">
                          {task.industry}
                        </div>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(task.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      
                      {task.status === 'PROCESSING' && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No reports found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
