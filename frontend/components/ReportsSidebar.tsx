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
      case 'COMPLETED': return 'var(--status-success)';
      case 'PROCESSING': return 'var(--primary-cyan)';
      case 'PENDING': return 'var(--status-warning)';
      case 'FAILED': return 'var(--status-critical)';
      default: return 'var(--accent-purple)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'COMPLETE';
      case 'PROCESSING': return 'ACTIVE';
      case 'PENDING': return 'STANDBY';
      case 'FAILED': return 'OFFLINE';
      default: return status;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-96 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
          borderRight: '4px solid var(--border-teal)',
        }}
      >
        {/* Toggle Button - Attached to panel edge */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 -translate-y-1/2 sci-button transition-all hover:brightness-110"
          style={{
            right: '-40px',
            background: 'var(--primary-teal)',
            color: 'var(--text-dark)',
            width: '40px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0 12px 12px 0',
            boxShadow: '2px 0 10px var(--shadow-glow-teal)',
            border: 'none',
            borderLeft: '4px solid var(--border-teal)',
          }}
          aria-label="Toggle sidebar"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div className="h-full flex flex-col">
          {/* LCARS Header */}
          <div className="p-6 border-b-4" style={{ borderColor: 'var(--border-teal)' }}>
            {/* Top decorative bar */}
            <div className="flex gap-2 mb-4">
              <div className="h-12 flex-1 rounded-full" style={{ background: 'var(--primary-teal)' }} aria-hidden="true"></div>
              <div className="h-12 w-12 rounded-full" style={{ background: 'var(--accent-purple)' }} aria-hidden="true"></div>
              <div className="h-12 w-12 rounded-full" style={{ background: 'var(--primary-cyan)' }} aria-hidden="true"></div>
            </div>
            
            <h2 className="text-2xl font-bold sci-heading mb-4" style={{ color: 'var(--text-primary)' }}>
              MISSION LOGS
            </h2>
            
            {/* Filter - LCARS Style */}
            <div className="space-y-2">
              {['', 'COMPLETED', 'PROCESSING', 'PENDING', 'FAILED'].map((status) => (
                <button
                  key={status || 'all'}
                  onClick={() => onFilterChange(status)}
                  className="w-full text-left px-4 py-2 sci-button transition-all"
                  style={{
                    background: filterStatus === status ? 'var(--primary-teal)' : 'var(--accent-coral)',
                    color: 'var(--text-dark)',
                    opacity: filterStatus === status ? 1 : 0.6,
                  }}
                >
                  {status === '' ? 'ALL REPORTS' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Reports List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 sci-scrollbar">
            {Object.entries(groupedTasks).map(([date, dateTasks]) => (
              <div key={date}>
                <div 
                  className="text-xs font-bold mb-3 px-3 py-1 rounded-full inline-block"
                  style={{ 
                    background: 'var(--primary-cyan)',
                    color: 'var(--text-dark)',
                    fontFamily: 'Antonio, sans-serif',
                    letterSpacing: '0.15em',
                  }}
                >
                  DATE: {date.toUpperCase()}
                </div>
                <div className="space-y-2">
                  {dateTasks.map((task) => (
                    <button
                      key={task.task_id}
                      onClick={() => onSelectTask(task.task_id)}
                      className="w-full text-left transition-all corner-tr corner-bl"
                      style={{
                        background: selectedTaskId === task.task_id 
                          ? 'linear-gradient(135deg, var(--bg-panel-alt-gradient-start) 0%, var(--bg-panel-alt-gradient-end) 100%)'
                          : 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
                        border: `2px solid ${selectedTaskId === task.task_id ? 'var(--border-teal)' : 'var(--border-coral)'}`,
                        padding: '0',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Left color bar */}
                      <div className="flex">
                        <div 
                          className="w-3"
                          style={{ background: getStatusColor(task.status) }}
                        ></div>
                        
                        <div className="flex-1 p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div 
                              className="font-bold text-sm flex-1 sci-heading"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {task.industry}
                            </div>
                            <span 
                              className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ 
                                background: getStatusColor(task.status),
                                color: 'var(--text-dark)',
                                fontFamily: 'Antonio, sans-serif',
                              }}
                            >
                              {getStatusLabel(task.status)}
                            </span>
                          </div>
                          
                          <div className="text-xs sci-text" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(task.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          
                          {task.status === 'PROCESSING' && (
                            <div className="mt-2">
                              <div 
                                className="w-full rounded-full h-2"
                                style={{ background: 'var(--bg-dark)' }}
                              >
                                <div
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${task.progress}%`,
                                    background: 'var(--primary-cyan)',
                                    boxShadow: '0 0 10px var(--primary-cyan)',
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div 
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent-coral)', opacity: 0.3 }}
                >
                  <svg className="w-10 h-10" fill="var(--text-dark)" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm sci-text" style={{ color: 'var(--text-accent)' }}>
                  NO REPORTS IN DATABASE
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ background: 'var(--overlay-dark)' }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
