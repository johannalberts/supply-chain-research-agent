"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ username, password });
      } else {
        await signup({ username, email, password });
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
      {/* LCARS Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{ background: '#14b8a6' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: '#06b6d4' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full" style={{ background: '#a855f7' }}></div>
      </div>

      <div 
        className="relative rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1419 0%, #0a0a0a 100%)',
          border: '4px solid #14b8a6',
        }}
      >
        {/* Top LCARS decorative bars */}
        <div className="flex gap-2 p-4">
          <div className="h-20 flex-1 rounded-full" style={{ background: '#14b8a6' }}></div>
          <div className="h-20 w-20 rounded-full" style={{ background: '#a855f7' }}></div>
          <div className="h-20 w-20 rounded-full" style={{ background: '#06b6d4' }}></div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold sci-heading mb-3" style={{ color: '#14b8a6' }}>
              STARFLEET COMMAND
            </h1>
            <p className="sci-text" style={{ color: '#06b6d4' }}>
              {isLogin ? 'OFFICER AUTHENTICATION' : 'NEW OFFICER REGISTRATION'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs font-bold mb-2 sci-heading"
                style={{ color: '#14b8a6' }}
              >
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl sci-text"
                style={{
                  background: '#0a0a0a',
                  border: '2px solid #f97316',
                  color: '#06b6d4',
                }}
                placeholder="ENTER OFFICER ID"
              />
            </div>

            {!isLogin && (
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-xs font-bold mb-2 sci-heading"
                  style={{ color: '#14b8a6' }}
                >
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl sci-text"
                  style={{
                    background: '#0a0a0a',
                    border: '2px solid #f97316',
                    color: '#06b6d4',
                  }}
                  placeholder="ENTER COMM ADDRESS"
                />
              </div>
            )}

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-bold mb-2 sci-heading"
                style={{ color: '#14b8a6' }}
              >
                SECURITY CODE
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl sci-text"
                style={{
                  background: '#0a0a0a',
                  border: '2px solid #f97316',
                  color: '#06b6d4',
                }}
                placeholder="ENTER ACCESS CODE"
              />
            </div>

            {error && (
              <div 
                className="p-4 rounded-2xl corner-tl corner-br"
                style={{
                  background: 'rgba(26, 10, 10, 0.8)',
                  border: '2px solid #ef4444',
                }}
              >
                <span className="sci-text" style={{ color: '#ef4444' }}>
                  ⚠ {error}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-bold py-4 px-4 sci-button transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{
                background: isLoading ? '#666' : '#06b6d4',
                color: '#000',
                fontSize: '1.1rem',
              }}
            >
              {isLoading ? 'PROCESSING...' : isLogin ? 'AUTHENTICATE' : 'REGISTER OFFICER'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="sci-text font-bold transition-all"
              style={{ color: '#14b8a6' }}>
            >
              {isLogin ? 'NEW OFFICER? REGISTER HERE' : 'EXISTING OFFICER? AUTHENTICATE'}
            </button>
          </div>
        </div>

        {/* Bottom LCARS decorative bars */}
        <div className="flex gap-2 p-4">
          <div className="h-20 w-20 rounded-full" style={{ background: '#f97316' }}></div>
          <div className="h-20 w-20 rounded-full" style={{ background: '#f59e0b' }}></div>
          <div className="h-20 flex-1 rounded-full" style={{ background: '#fb7185' }}></div>
        </div>
      </div>
    </div>
  );
}
