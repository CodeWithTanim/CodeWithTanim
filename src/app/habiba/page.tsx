'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  Menu,
  X,
  Search,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Globe,
  Activity,
  Database,
  RefreshCw,
  LogOut,
  ExternalLink,
  Bell,
  Trash2,
  Check,
  Copy,
  MapPin,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Lock,
  Send,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface UserSession {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

interface Submission {
  _id: string;
  name: string;
  email: string;
  message: string;
  ip: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  userAgent?: string;
  status: 'unread' | 'read';
  createdAt: string;
}

interface Visitor {
  _id: string;
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  visitedAt: string;
}

interface ActivityLogItem {
  _id: string;
  action: string;
  details: string;
  ip?: string;
  location?: string;
  timestamp: string;
}

export default function AdminPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [sessionPending, setSessionPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Auth form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Navigation States
  const [activeTab, setActiveTab] = useState<'submissions' | 'visitors' | 'logs' | 'database'>('submissions');

  // Data states
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    unreadSubmissions: 0,
    totalVisits: 0,
    uniqueIps: 0,
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync theme with document element
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cwt_theme', next);
  };

  // Safe Session Check
  const checkSession = useCallback(async () => {
    try {
      const res = await authClient.getSession();
      if (res?.data) {
        setSession(res.data as unknown as UserSession);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setSessionPending(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    if (!session?.user) return;
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
        setVisitors(data.visitors || []);
        setLogs(data.logs || []);
        setStats(
          data.stats || {
            totalSubmissions: 0,
            unreadSubmissions: 0,
            totalVisits: 0,
            uniqueIps: 0,
          }
        );
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session, fetchDashboardData]);

  // Handle Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const result = await authClient.signIn.email({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (result.error) {
        setAuthError(result.error.message || 'Invalid credentials.');
      } else {
        await checkSession();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Actions
  const handleUpdateStatus = async (id: string, status: 'unread' | 'read') => {
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_submission_status',
          payload: { id, status },
        }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status } : s))
        );
        if (selectedSubmission?._id === id) {
          setSelectedSubmission((prev) => (prev ? { ...prev, status } : null));
        }
        setStats((prev) => ({
          ...prev,
          unreadSubmissions:
            status === 'read'
              ? Math.max(0, prev.unreadSubmissions - 1)
              : prev.unreadSubmissions + 1,
        }));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_submission',
          payload: { id },
        }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s._id !== id));
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
        setStats((prev) => ({
          ...prev,
          totalSubmissions: Math.max(0, prev.totalSubmissions - 1),
        }));
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Clear all activity logs?')) return;
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_logs', payload: {} }),
      });
      if (res.ok) {
        setLogs([]);
      }
    } catch (err) {
      console.error('Error clearing logs:', err);
    }
  };

  const handleClearVisitors = async () => {
    if (!window.confirm('Clear all visitor tracking records?')) return;
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_visitors', payload: {} }),
      });
      if (res.ok) {
        setVisitors([]);
        setStats((prev) => ({ ...prev, totalVisits: 0, uniqueIps: 0 }));
      }
    } catch (err) {
      console.error('Error clearing visitors:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const timeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return dateStr;
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (submissionFilter !== 'all' && sub.status !== submissionFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.name.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q) ||
        sub.message.toLowerCase().includes(q) ||
        sub.ip.includes(q)
      );
    }
    return true;
  });

  const filteredVisitors = visitors.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.ip.includes(q) ||
      (v.country && v.country.toLowerCase().includes(q)) ||
      (v.city && v.city.toLowerCase().includes(q)) ||
      v.path.toLowerCase().includes(q)
    );
  });

  const filteredLogs = logs.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      (l.ip && l.ip.includes(q))
    );
  });

  // Global styles matching main portfolio theme
  const portfolioStyles = (
    <style dangerouslySetInnerHTML={{ __html: `
      * { box-sizing: border-box; }
      .admin-scroll::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .admin-scroll::-webkit-scrollbar-track {
        background: var(--bg-primary);
      }
      .admin-scroll::-webkit-scrollbar-thumb {
        background: var(--border-faint);
        border-radius: 4px;
      }
      .admin-scroll::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted);
      }
      .admin-nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 44px;
        padding: 0 1.25rem;
        color: var(--text-muted);
        text-decoration: none;
        border: none;
        background: transparent;
        width: 100%;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        position: relative;
        text-align: left;
      }
      .admin-nav-item:hover {
        background-color: var(--bg-subtle);
        color: var(--text-main);
      }
      .admin-nav-item.active {
        background-color: var(--bg-subtle);
        color: var(--text-main);
        font-weight: 700;
      }
      .admin-nav-item.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: var(--accent-signal);
      }
      .admin-chip {
        padding: 0.4rem 0.85rem;
        border-radius: 6px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid var(--border-faint);
        background: var(--bg-panel);
        color: var(--text-muted);
      }
      .admin-chip:hover {
        background: var(--bg-subtle);
        color: var(--text-main);
      }
      .admin-chip.active {
        background: var(--text-main);
        color: var(--bg-panel);
        border-color: var(--text-main);
      }
      .admin-card {
        background: var(--bg-panel);
        border: 1px solid var(--border-faint);
        border-radius: 10px;
        box-shadow: var(--shadow-sm);
        overflow: hidden;
      }
      .admin-table-row:hover {
        background-color: var(--bg-subtle) !important;
      }
      .admin-tab-btn {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.9rem 1.25rem;
        color: var(--text-muted);
        font-size: 0.88rem;
        font-weight: 600;
        border: none;
        background: transparent;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.15s ease;
        white-space: nowrap;
      }
      .admin-tab-btn:hover {
        color: var(--text-main);
        background: var(--bg-subtle);
      }
      .admin-tab-btn.active {
        color: var(--text-main);
        border-bottom-color: var(--accent-signal);
        font-weight: 700;
      }
      .admin-badge-unread {
        background: var(--accent-signal);
        color: #ffffff;
        font-size: 0.68rem;
        font-weight: 700;
        padding: 1px 7px;
        border-radius: 10px;
      }
      .admin-badge-count {
        background: var(--bg-subtle);
        color: var(--text-muted);
        font-size: 0.68rem;
        font-weight: 600;
        padding: 1px 7px;
        border-radius: 10px;
      }
      .admin-login-canvas {
        background-color: var(--bg-primary);
        background-image: radial-gradient(var(--border-faint) 1.2px, transparent 1.2px);
        background-size: 24px 24px;
        position: relative;
      }
      .admin-login-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, var(--accent-tint) 0%, transparent 68%);
        pointer-events: none;
        z-index: 0;
      }
      .admin-login-card {
        position: relative;
        z-index: 1;
        max-width: 440px;
        width: 100%;
        background: var(--bg-panel);
        border: 2px solid var(--border-strong);
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      [data-theme='dark'] .admin-login-card {
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 77, 54, 0.08);
      }
      .admin-login-input {
        width: 100%;
        padding: 0.85rem 1rem 0.85rem 2.85rem;
        border: 1.5px solid var(--border-faint);
        border-radius: 8px;
        background: var(--bg-subtle);
        color: var(--text-main);
        font-size: 0.92rem;
        font-family: var(--font-body);
        outline: none;
        transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
      }
      .admin-login-input:focus {
        border-color: var(--accent-signal);
        background: var(--bg-panel);
        box-shadow: 0 0 0 3px var(--accent-tint);
      }
      .admin-login-btn {
        width: 100%;
        padding: 0.92rem;
        background: var(--accent-signal);
        color: #ffffff;
        font-family: var(--font-mono);
        font-weight: 700;
        font-size: 0.92rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        cursor: pointer;
        border: 2px solid var(--border-strong);
        border-radius: 8px;
        box-shadow: var(--shadow-md);
        transition: all 0.15s ease;
      }
      .admin-login-btn:hover:not(:disabled) {
        background: var(--accent-signal-hover);
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px var(--border-strong);
      }
      .admin-login-btn:active:not(:disabled) {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px var(--border-strong);
      }
      .admin-login-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px var(--bg-subtle) inset !important;
        -webkit-text-fill-color: var(--text-main) !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    `}} />
  );

  // 1. Sleek Modern Login Portal Matching Website Theme
  if (!session?.user) {
    return (
      <div
        className="admin-login-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflowY: 'auto',
          fontFamily: 'var(--font-body)',
        }}
      >
        {portfolioStyles}

        {/* Ambient Radial Accent Glow */}
        <div className="admin-login-glow" />

        {/* Minimal Top Header */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            height: '64px',
            borderBottom: '1px solid var(--border-faint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
            background: 'var(--bg-panel)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: 'var(--text-main)',
              }}
            >
              CODE<span style={{ color: 'var(--accent-signal)' }}>WITH</span>TANIM
            </span>
            <span
              className="mono"
              style={{
                fontSize: '0.65rem',
                background: 'var(--accent-tint)',
                color: 'var(--accent-signal)',
                border: '1px solid var(--accent-signal)',
                padding: '2px 7px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              ADMIN
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-faint)',
                color: 'var(--text-main)',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            <a
              href="/"
              className="mono"
              style={{
                fontSize: '0.82rem',
                color: 'var(--accent-signal)',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>Back to Site &rarr;</span>
            </a>
          </div>
        </header>

        {/* Login Center Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem 1.25rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="admin-login-card">
            {/* Top Terminal Header Bar */}
            <div
              style={{
                padding: '0.8rem 1.25rem',
                borderBottom: '1px solid var(--border-faint)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
              </div>
              <span
                className="mono"
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                ADMIN GATEWAY
              </span>
            </div>

            {/* Main Form Body */}
            <div style={{ padding: '2.25rem 2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'var(--accent-tint)',
                    border: '2px solid var(--accent-signal)',
                    color: 'var(--accent-signal)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Lock size={24} strokeWidth={2.2} />
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-main)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Admin Portal
                </h1>
                <p
                  className="mono"
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.45rem',
                    marginBottom: 0,
                  }}
                >
                  Sign in to manage portfolio inquiries & telemetry
                </p>
              </div>

              {authError && (
                <div
                  style={{
                    background: 'var(--accent-tint)',
                    border: '1.5px solid var(--accent-signal)',
                    color: 'var(--accent-signal)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={17} style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label
                    className="mono"
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      marginBottom: '0.45rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Admin Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="codewithtanim@gmail.com"
                      className="admin-login-input"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="mono"
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      marginBottom: '0.45rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="admin-login-input"
                      style={{ paddingRight: '2.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: '4px',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="admin-login-btn"
                  style={{ marginTop: '0.5rem' }}
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Card Footer Bar */}
            <div
              style={{
                padding: '0.8rem 1.5rem',
                borderTop: '1px solid var(--border-faint)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span className="mono" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM OPERATIONAL</span>
              </div>
              <a
                href="/"
                className="mono"
                style={{
                  color: 'var(--accent-signal)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>Return Home &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard (Clean Developer Portfolio Admin System)
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-primary)',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      {portfolioStyles}

      {/* TOPBAR */}
      <header
        style={{
          height: '64px',
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-faint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* Brand & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: 'var(--text-main)',
              }}
            >
              CODE<span style={{ color: 'var(--accent-signal)' }}>WITH</span>TANIM
            </span>
            <span
              className="mono"
              style={{
                fontSize: '0.65rem',
                background: 'var(--accent-tint)',
                color: 'var(--accent-signal)',
                border: '1px solid var(--accent-signal)',
                padding: '2px 7px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              ADMIN
            </span>
          </div>

          <div style={{ height: '22px', width: '1px', background: 'var(--border-faint)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <span className="mono" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              MONGODB ONLINE
            </span>
          </div>
        </div>

        {/* Global Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={fetchDashboardData}
            disabled={dataLoading}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-faint)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
            title="Refresh Data"
          >
            <RefreshCw size={14} className={dataLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-faint)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-faint)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={14} />
            <span>View Site</span>
          </a>

          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.reload();
            }}
            style={{
              background: 'var(--accent-tint)',
              border: '1px solid var(--accent-signal)',
              color: 'var(--accent-signal)',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* HORIZONTAL TAB NAVIGATION */}
      <nav
        style={{
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-faint)',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          overflowX: 'auto',
          flexShrink: 0,
        }}
        className="admin-scroll"
      >
        <button
          onClick={() => setActiveTab('submissions')}
          className={`admin-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
        >
          <MessageSquare size={16} />
          <span>Inquiries & Messages</span>
          {stats.unreadSubmissions > 0 ? (
            <span className="admin-badge-unread">{stats.unreadSubmissions}</span>
          ) : (
            <span className="admin-badge-count">{stats.totalSubmissions}</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          className={`admin-tab-btn ${activeTab === 'visitors' ? 'active' : ''}`}
        >
          <Globe size={16} />
          <span>Visitor Telemetry</span>
          <span className="admin-badge-count">{stats.totalVisits}</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
        >
          <Activity size={16} />
          <span>Activity Logs</span>
          <span className="admin-badge-count">{logs.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`admin-tab-btn ${activeTab === 'database' ? 'active' : ''}`}
        >
          <Database size={16} />
          <span>Database & Config</span>
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.75rem 2rem',
          background: 'var(--bg-primary)',
        }}
        className="admin-scroll"
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* 4 TOP SUMMARY KPI CARDS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            <div
              className="admin-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: '4px solid var(--accent-signal)',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab('submissions')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Inquiries Received</span>
                <Mail size={16} color="var(--accent-signal)" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 0.2rem' }}>
                {stats.totalSubmissions}
              </div>
              <div style={{ fontSize: '0.78rem', color: stats.unreadSubmissions > 0 ? 'var(--accent-signal)' : 'var(--text-muted)', fontWeight: 600 }}>
                {stats.unreadSubmissions > 0 ? `${stats.unreadSubmissions} unread messages` : 'All caught up'}
              </div>
            </div>

            <div
              className="admin-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: '4px solid #06b6d4',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab('visitors')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Total Site Views</span>
                <Globe size={16} color="#06b6d4" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 0.2rem' }}>
                {stats.totalVisits}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Tracked portfolio hits
              </div>
            </div>

            <div
              className="admin-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: '4px solid #10b981',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab('visitors')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Unique Visitors</span>
                <MapPin size={16} color="#10b981" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 0.2rem' }}>
                {stats.uniqueIps}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Distinct IP addresses
              </div>
            </div>

            <div
              className="admin-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: '4px solid #f59e0b',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab('database')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Telegram Bot Alert</span>
                <Send size={16} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', margin: '0.7rem 0 0.2rem' }}>
                Active & Connected
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Instant telegram notifications
              </div>
            </div>
          </div>

          {/* TAB 1: INQUIRIES & MESSAGES */}
          {activeTab === 'submissions' && (
            <div>
              {/* Header with Search and Filter */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    Inquiries & Messages ({submissions.length})
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Messages submitted through portfolio contact and course registration forms
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Search Input */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--border-faint)',
                      borderRadius: '6px',
                      padding: '0 0.75rem',
                      height: '36px',
                      width: '260px',
                    }}
                  >
                    <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '0.5rem', flexShrink: 0 }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by name, email, IP..."
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.82rem',
                        width: '100%',
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        style={{ color: 'var(--text-muted)', fontSize: '0.8rem', border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filter Chips */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => setSubmissionFilter('all')}
                      className={`admin-chip ${submissionFilter === 'all' ? 'active' : ''}`}
                    >
                      All ({submissions.length})
                    </button>
                    <button
                      onClick={() => setSubmissionFilter('unread')}
                      className={`admin-chip ${submissionFilter === 'unread' ? 'active' : ''}`}
                    >
                      Unread ({stats.unreadSubmissions})
                    </button>
                    <button
                      onClick={() => setSubmissionFilter('read')}
                      className={`admin-chip ${submissionFilter === 'read' ? 'active' : ''}`}
                    >
                      Read ({submissions.length - stats.unreadSubmissions})
                    </button>
                  </div>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="admin-card">
                {filteredSubmissions.length === 0 ? (
                  <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <MessageSquare size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No inquiries found</div>
                    <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
                      {searchQuery ? 'Try adjusting your search query.' : 'Form submissions will automatically appear here and trigger Telegram notifications.'}
                    </div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }} className="admin-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-faint)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', background: 'var(--bg-subtle)' }}>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Sender</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Message Preview</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Origin & IP</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Date</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                          <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.map((sub) => (
                          <tr
                            key={sub._id}
                            style={{
                              borderBottom: '1px solid var(--border-faint)',
                              background: selectedSubmission?._id === sub._id ? 'var(--bg-subtle)' : 'transparent',
                              cursor: 'pointer',
                            }}
                            className="admin-table-row"
                            onClick={() => setSelectedSubmission(sub)}
                          >
                            <td style={{ padding: '0.85rem 1.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div
                                  style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '50%',
                                    background: sub.status === 'unread' ? 'var(--accent-signal)' : 'var(--bg-subtle)',
                                    color: sub.status === 'unread' ? '#ffffff' : 'var(--text-main)',
                                    border: '1px solid var(--border-faint)',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  {sub.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sub.name}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', maxWidth: '380px' }}>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                                {sub.message}
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                                {sub.ip}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {sub.location?.city ? `${sub.location.city}, ` : ''}{sub.location?.country || 'Unknown'}
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              <div>{timeAgo(sub.createdAt)}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{formatDate(sub.createdAt)}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                              {sub.status === 'unread' ? (
                                <span style={{ background: 'var(--accent-tint)', color: 'var(--accent-signal)', border: '1px solid var(--accent-signal)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                                  UNREAD
                                </span>
                              ) : (
                                <span style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border-faint)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                                  READ
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <a
                                href={`mailto:${sub.email}?subject=Re: Portfolio Inquiry`}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-muted)',
                                  padding: '6px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  marginRight: '4px',
                                }}
                                title="Reply via Email"
                              >
                                <Mail size={16} />
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(sub._id, sub.status === 'unread' ? 'read' : 'unread');
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: sub.status === 'read' ? '#10b981' : 'var(--text-muted)',
                                  cursor: 'pointer',
                                  padding: '6px',
                                  marginRight: '4px',
                                }}
                                title={sub.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubmission(sub._id);
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--accent-signal)',
                                  cursor: 'pointer',
                                  padding: '6px',
                                }}
                                title="Delete Inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Message Detail Drawer */}
              {selectedSubmission && (
                <div
                  style={{
                    position: 'fixed',
                    right: 0,
                    top: '64px',
                    bottom: 0,
                    width: '460px',
                    maxWidth: '100vw',
                    background: 'var(--bg-panel)',
                    borderLeft: '2px solid var(--border-strong)',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 250,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  className="admin-scroll"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800 }}>Inquiry Details</span>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--accent-signal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                        {selectedSubmission.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedSubmission.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-signal)' }}>{selectedSubmission.email}</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-faint)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                      <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
                        Message Body
                      </div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {selectedSubmission.message}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-faint)', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Received:</span>
                        <span style={{ fontWeight: 600 }}>{formatDate(selectedSubmission.createdAt)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Sender IP:</span>
                        <span className="mono">{selectedSubmission.ip}</span>
                      </div>
                      {selectedSubmission.location && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                          <span>
                            {selectedSubmission.location.city ? `${selectedSubmission.location.city}, ` : ''}
                            {selectedSubmission.location.country || 'Unknown'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-faint)', paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re: Inquiry on CodeWithTanim`}
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        background: 'var(--text-main)',
                        color: 'var(--bg-panel)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        borderRadius: '6px',
                      }}
                    >
                      <Send size={15} />
                      <span>Reply via Email</span>
                    </a>
                    <button
                      onClick={() => handleDeleteSubmission(selectedSubmission._id)}
                      style={{
                        padding: '0.8rem 1rem',
                        background: 'var(--accent-tint)',
                        color: 'var(--accent-signal)',
                        border: '1px solid var(--accent-signal)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VISITOR TELEMETRY */}
          {activeTab === 'visitors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    Visitor Telemetry ({visitors.length})
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Tracked portfolio hits, client IP addresses, and visited pages
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--border-faint)',
                      borderRadius: '6px',
                      padding: '0 0.75rem',
                      height: '36px',
                      width: '240px',
                    }}
                  >
                    <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '0.5rem', flexShrink: 0 }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by IP, country, path..."
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.82rem',
                        width: '100%',
                      }}
                    />
                  </div>

                  <button
                    onClick={handleClearVisitors}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--bg-panel)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-faint)',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Clear History
                  </button>
                </div>
              </div>

              {/* Visitor Table */}
              <div className="admin-card">
                {filteredVisitors.length === 0 ? (
                  <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No visitor logs recorded.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }} className="admin-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-faint)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', background: 'var(--bg-subtle)' }}>
                          <th style={{ padding: '0.85rem 1.25rem' }}>IP Address</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Location</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Visited Path</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Referrer</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVisitors.map((v) => (
                          <tr key={v._id} style={{ borderBottom: '1px solid var(--border-faint)' }} className="admin-table-row">
                            <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-signal)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span>{v.ip}</span>
                                <button
                                  onClick={() => copyToClipboard(v.ip, v._id)}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                                  title="Copy IP"
                                >
                                  {copiedId === v._id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                                </button>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', fontWeight: 500 }}>
                              {v.city ? `${v.city}, ` : ''}{v.country || 'Unknown'}
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>
                              <span className="mono" style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {v.path}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {v.referrer || 'Direct'}
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                              {formatDate(v.visitedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    Activity Logs ({logs.length})
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Audit trail of all administrative actions and form events
                  </p>
                </div>
                <button
                  onClick={handleClearLogs}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--bg-panel)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-faint)',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear Logs
                </button>
              </div>

              <div className="admin-card">
                {filteredLogs.length === 0 ? (
                  <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No activity logs recorded.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }} className="admin-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-faint)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', background: 'var(--bg-subtle)' }}>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Action</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Details</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>IP</th>
                          <th style={{ padding: '0.85rem 1.25rem' }}>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map((log) => (
                          <tr key={log._id} style={{ borderBottom: '1px solid var(--border-faint)' }} className="admin-table-row">
                            <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                              <span
                                className="mono"
                                style={{
                                  background: 'var(--bg-subtle)',
                                  color: 'var(--accent-signal)',
                                  border: '1px solid var(--border-faint)',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                }}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', fontWeight: 500 }}>
                              {log.details}
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {log.ip || '-'}
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                              {formatDate(log.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE & CONFIG */}
          {activeTab === 'database' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                  Database & System Infrastructure
                </h1>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Architecture overview of MongoDB Atlas, Better-Auth, and Telegram bot notification pipeline
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                <div className="admin-card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={18} color="#10b981" />
                    <span>MongoDB Atlas Cluster</span>
                  </h3>
                  <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Connection Status:</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Connected</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Database Name:</span>
                      <span style={{ fontWeight: 700 }}>cwt-portfolio</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Inquiries Collection:</span>
                      <span>contact_submissions ({stats.totalSubmissions})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Visitor Logs Collection:</span>
                      <span>visitor_logs ({stats.totalVisits})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Activity Logs Collection:</span>
                      <span>activity_logs ({logs.length})</span>
                    </div>
                  </div>
                </div>

                <div className="admin-card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} color="var(--accent-signal)" />
                    <span>Auth & Telegram Pipeline</span>
                  </h3>
                  <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Authentication Provider:</span>
                      <span style={{ fontWeight: 600 }}>Better-Auth (MongoDB Adapter)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Admin Identity:</span>
                      <span>{session.user.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Telegram Alert Pipeline:</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Active (Bot Token & Chat ID)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Access Architecture:</span>
                      <span className="mono" style={{ color: '#10b981', fontWeight: 700 }}>Obfuscated Private Route</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
