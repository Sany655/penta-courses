'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

const POLL_INTERVAL_MS = 60000;
const REQUEST_TIMEOUT_MS = 5000;

function getHealthUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  return apiUrl ? `${apiUrl}/health` : '/api/health';
}

export default function ServerStatusButton() {
  const [status, setStatus] = useState('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(getHealthUrl(), {
        cache: 'no-store',
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null);
      setStatus(response.ok && payload?.status === 'healthy' ? 'healthy' : 'degraded');
    } catch {
      setStatus('offline');
    } finally {
      window.clearTimeout(timeoutId);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const intervalId = window.setInterval(checkHealth, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [checkHealth]);

  const statusDetails = {
    checking: { label: 'Checking', color: 'text-slate-300', dot: 'bg-slate-400', description: 'Checking server status' },
    healthy: { label: 'Server OK', color: 'text-emerald-400', dot: 'bg-emerald-400', description: 'Server is healthy' },
    degraded: { label: 'Degraded', color: 'text-amber-400', dot: 'bg-amber-400', description: 'Server responded, but its database is unavailable' },
    offline: { label: 'Offline', color: 'text-rose-400', dot: 'bg-rose-400', description: 'Server is unavailable' },
  }[status];

  return (
    <button
      type="button"
      onClick={checkHealth}
      disabled={isRefreshing}
      title={`${statusDetails.description}. Click to check again.`}
      aria-label={`${statusDetails.description}. Click to check again.`}
      className={`flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-[10px] font-mono font-bold ${statusDetails.color} transition hover:border-slate-500 disabled:cursor-wait disabled:opacity-70`}
    >
      <span className={`h-2 w-2 rounded-full ${statusDetails.dot} ${status === 'checking' ? 'animate-pulse' : ''}`} />
      <span className="hidden lg:inline">{statusDetails.label}</span>
      <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      <Activity className="h-3 w-3 lg:hidden" />
    </button>
  );
}
