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
      case 'COMPLETED': return '#10b981';
      case 'PROCESSING': return '#06b6d4';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      default: return '#a855f7';
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
      {/* Toggle Button - LCARS Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-24 z-50 sci-button transition-all hover:scale-105"
        style={{
          background: '#14b8a6',
          color: '#000',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(255, 153, 102, 0.5)',
        }}
        aria-label="Toggle sidebar"
      >
        <svg
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Sidebar - LCARS Style */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-96 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
          borderRight: '4px solid #14b8a6',
        }}
      >
        <div className="h-full flex flex-col">
          {/* LCARS Header */}
          <div className="p-6 border-b-4" style={{ borderColor: '#14b8a6' }}>
            {/* Top decorative bar */}
            <div className="flex gap-2 mb-4">
              <div className="h-12 flex-1 rounded-full" style={{ background: '#14b8a6' }}></div>
              <div className="h-12 w-12 rounded-full" style={{ background: '#a855f7' }}></div>
              <div className="h-12 w-12 rounded-full" style={{ background: '#06b6d4' }}></div>
            </div>
            
            <h2 className="text-2xl font-bold sci-heading mb-4" style={{ color: '#14b8a6' }}>
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
                    background: filterStatus === status ? '#14b8a6' : '#f97316',
                    color: '#000',
                    opacity: filterStatus === status ? 1 : 0.6,
                  }}
                >
                  {status === '' ? 'ALL REPORTS' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Reports List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(groupedTasks).map(([date, dateTasks]) => (
              <div key={date}>
                <div 
                  className="text-xs font-bold mb-3 px-3 py-1 rounded-full inline-block"
                  style={{ 
                    background: '#06b6d4',
                    color: '#000',
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
                          ? 'linear-gradient(135deg, #1a2a2a 0%, #0f1419 100%)'
                          : 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
                        border: `2px solid ${selectedTaskId === task.task_id ? '#14b8a6' : '#f97316'}`,
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
                              style={{ color: '#14b8a6' }}
                            >
                              {task.industry}
                            </div>
                            <span 
                              className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ 
                                background: getStatusColor(task.status),
                                color: '#000',
                                fontFamily: 'Antonio, sans-serif',
                              }}
                            >
                              {getStatusLabel(task.status)}
                            </span>
                          </div>
                          
                          <div className="text-xs sci-text" style={{ color: '#06b6d4' }}>
                            {new Date(task.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          
                          {task.status === 'PROCESSING' && (
                            <div className="mt-2">
                              <div 
                                className="w-full rounded-full h-2"
                                style={{ background: '#0a0a1a' }}
                              >
                                <div
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${task.progress}%`,
                                    background: '#06b6d4',
                                    boxShadow: '0 0 10px #06b6d4',
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
                  style={{ background: '#f97316', opacity: 0.3 }}
                >
                  <svg className="w-10 h-10" fill="#000" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm sci-text" style={{ color: '#f97316' }}>
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
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
