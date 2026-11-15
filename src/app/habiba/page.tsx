'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  Lock,
  Mail,
  Globe,
  Activity,
  Trash2,
  RefreshCw,
  LogOut,
  Copy,
  Check,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  EyeOff,
  CheckCircle,
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

  // Auth form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard states
  const [activeTab, setActiveTab] = useState<'submissions' | 'visitors' | 'logs'>('submissions');
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

  // Safe Session Check (with timeout fallback so it never hangs)
  const checkSession = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);

      const res = await authClient.getSession();
      clearTimeout(timer);

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
    // Safety timeout: ensure loader never blocks for more than 400ms
    const timeout = setTimeout(() => {
      setSessionPending(false);
    }, 400);

    checkSession();

    return () => clearTimeout(timeout);
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
    setAuthError(null);
    setAuthLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (result.error) {
        setAuthError(result.error.message || 'Invalid email or password.');
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
        fetchDashboardData();
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

  // 1. Initial Quick Loading State
  if (sessionPending) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw className="animate-spin" size={24} style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  // 2. High-End, Modern Dark-Glass Login Portal
  if (!session?.user) {
    return (
      <div
        style={{
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          position: 'relative',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .portal-input:-webkit-autofill,
          .portal-input:-webkit-autofill:hover,
          .portal-input:-webkit-autofill:focus {
            -webkit-text-fill-color: #ffffff !important;
            -webkit-box-shadow: 0 0 0px 1000px #131720 inset !important;
            box-shadow: 0 0 0px 1000px #131720 inset !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          .portal-input:focus {
            border-color: #e0361f !important;
            box-shadow: 0 0 0 3px rgba(224, 54, 31, 0.25) !important;
          }
          .portal-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 22px rgba(224, 54, 31, 0.45) !important;
            filter: brightness(1.08);
          }
          .portal-btn:active {
            transform: translateY(0);
          }
        `}} />

        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(224, 54, 31, 0.14) 0%, rgba(99, 102, 241, 0.06) 45%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Portal Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '410px',
            width: '100%',
            background: '#11141a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2.5rem 2.25rem',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(224, 54, 31, 0.25), rgba(224, 54, 31, 0.08))',
                border: '1px solid rgba(224, 54, 31, 0.35)',
                color: '#ff4d36',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(224, 54, 31, 0.25)',
              }}
            >
              <Lock size={22} />
            </div>
            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                marginTop: '1rem',
                marginBottom: '0.35rem',
              }}
            >
              Admin Portal
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Sign in to access your management dashboard
            </p>
          </div>

          {authError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.84rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: '#e2e8f0',
                  marginBottom: '0.45rem',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="portal-input"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: '#e2e8f0',
                  marginBottom: '0.45rem',
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
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="portal-input"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 2.6rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="portal-btn"
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.85rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #e0361f 0%, #b92814 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: authLoading ? 0.75 : 1,
                cursor: authLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(224, 54, 31, 0.35)',
                transition: 'all 0.2s ease',
                border: 'none',
              }}
            >
              {authLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
            <a
              href="/"
              style={{
                fontSize: '0.82rem',
                color: '#64748b',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              ← Back to portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Modern, Clean, Minimalist Dashboard
  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-faint)',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Signed in as <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{session.user.email}</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={fetchDashboardData}
            disabled={dataLoading}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-faint)',
              background: 'var(--bg-panel)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <RefreshCw size={14} className={dataLoading ? 'animate-spin' : ''} />
            <span>{dataLoading ? 'Updating...' : 'Refresh'}</span>
          </button>

          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.reload();
            }}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              background: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-faint)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Messages</span>
            <Mail size={16} style={{ color: 'var(--accent-signal)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {stats.totalSubmissions}
          </div>
          <div style={{ fontSize: '0.8rem', color: stats.unreadSubmissions > 0 ? 'var(--accent-signal)' : 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats.unreadSubmissions} unread
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-faint)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Visits</span>
            <Globe size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {stats.totalVisits}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Tracked site hits
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-faint)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Unique Visitors</span>
            <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {stats.uniqueIps}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Distinct IP addresses
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-faint)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Database</span>
            <Activity size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#10b981' }}>
            Connected
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
            cwt-portfolio
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-faint)',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderBottom: activeTab === 'submissions' ? '2px solid var(--text-main)' : '2px solid transparent',
            color: activeTab === 'submissions' ? 'var(--text-main)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '-1px',
          }}
        >
          <Mail size={16} />
          <span>Inquiries</span>
          {stats.unreadSubmissions > 0 && (
            <span
              style={{
                background: 'var(--accent-signal)',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                fontWeight: 600,
              }}
            >
              {stats.unreadSubmissions}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderBottom: activeTab === 'visitors' ? '2px solid var(--text-main)' : '2px solid transparent',
            color: activeTab === 'visitors' ? 'var(--text-main)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '-1px',
          }}
        >
          <Globe size={16} />
          <span>Visitor Analytics ({visitors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderBottom: activeTab === 'logs' ? '2px solid var(--text-main)' : '2px solid transparent',
            color: activeTab === 'logs' ? 'var(--text-main)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '-1px',
          }}
        >
          <Activity size={16} />
          <span>System Logs ({logs.length})</span>
        </button>
      </div>

      {/* Tab 1: Submissions */}
      {activeTab === 'submissions' && (
        <div>
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <Filter size={15} style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }} />
              <button
                onClick={() => setSubmissionFilter('all')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  background: submissionFilter === 'all' ? 'var(--text-main)' : 'var(--bg-panel)',
                  color: submissionFilter === 'all' ? 'var(--bg-panel)' : 'var(--text-main)',
                  border: '1px solid var(--border-faint)',
                }}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('unread')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  background: submissionFilter === 'unread' ? 'var(--accent-signal)' : 'var(--bg-panel)',
                  color: submissionFilter === 'unread' ? '#fff' : 'var(--text-main)',
                  border: '1px solid var(--border-faint)',
                }}
              >
                Unread ({submissions.filter((s) => s.status === 'unread').length})
              </button>
              <button
                onClick={() => setSubmissionFilter('read')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  background: submissionFilter === 'read' ? 'var(--text-main)' : 'var(--bg-panel)',
                  color: submissionFilter === 'read' ? 'var(--bg-panel)' : 'var(--text-main)',
                  border: '1px solid var(--border-faint)',
                }}
              >
                Read ({submissions.filter((s) => s.status === 'read').length})
              </button>
            </div>

            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.65rem 0.4rem 2rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-faint)',
                  background: 'var(--bg-panel)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-faint)',
                borderRadius: '12px',
                padding: '3rem 1rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <Mail size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No messages found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selectedSubmission ? '1fr 1fr' : '1fr', gap: '1rem' }}>
              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    onClick={() => {
                      setSelectedSubmission(sub);
                      if (sub.status === 'unread') {
                        handleUpdateStatus(sub._id, 'read');
                      }
                    }}
                    style={{
                      background: 'var(--bg-panel)',
                      border: selectedSubmission?._id === sub._id ? '1px solid var(--text-main)' : '1px solid var(--border-faint)',
                      borderRadius: '10px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        {sub.status === 'unread' && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-signal)' }}></span>
                        )}
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sub.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(sub.createdAt)}</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {sub.email}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.65rem' }}>
                      {sub.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} />
                        {sub.location?.city ? `${sub.location.city}, ${sub.location.country}` : sub.ip}
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(sub._id, sub.status === 'unread' ? 'read' : 'unread');
                          }}
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'underline',
                          }}
                        >
                          {sub.status === 'unread' ? 'Mark read' : 'Mark unread'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(sub._id);
                          }}
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail Pane */}
              {selectedSubmission && (
                <div
                  style={{
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-faint)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    position: 'sticky',
                    top: '90px',
                    height: 'fit-content',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        {selectedSubmission.name}
                      </h2>
                      <a href={`mailto:${selectedSubmission.email}`} style={{ fontSize: '0.85rem', color: 'var(--accent-signal)' }}>
                        {selectedSubmission.email}
                      </a>
                    </div>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-subtle)' }}
                    >
                      Close
                    </button>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', borderRadius: '8px', padding: '1rem', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', whiteSpace: 'pre-wrap' }}>
                    {selectedSubmission.message}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)' }}>
                    <div>IP: <span style={{ color: 'var(--text-main)' }}>{selectedSubmission.ip}</span></div>
                    <div>Location: <span style={{ color: 'var(--text-main)' }}>{selectedSubmission.location?.city || 'Unknown'}, {selectedSubmission.location?.country || ''}</span></div>
                    <div>Date: <span style={{ color: 'var(--text-main)' }}>{formatDate(selectedSubmission.createdAt)}</span></div>
                    <div>Status: <span style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{selectedSubmission.status}</span></div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re:%20Inquiry%20via%20CodeWithTanim%20Portfolio`}
                      style={{
                        padding: '0.55rem 0.95rem',
                        borderRadius: '6px',
                        background: 'var(--text-main)',
                        color: 'var(--bg-panel)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Mail size={14} />
                      <span>Reply via Email</span>
                    </a>

                    <button
                      onClick={() => handleDeleteSubmission(selectedSubmission._id)}
                      style={{
                        padding: '0.55rem 0.95rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        background: 'rgba(239, 68, 68, 0.08)',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Visitors */}
      {activeTab === 'visitors' && (
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-faint)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-faint)' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Visitor IP Tracker</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time visitor logs from collection `visitor_logs`</p>
            </div>

            {visitors.length > 0 && (
              <button
                onClick={handleClearVisitors}
                style={{
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Trash2 size={13} />
                <span>Clear history</span>
              </button>
            )}
          </div>

          {visitors.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Globe size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem' }}>No visitor records yet</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-faint)' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>IP Address</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Location</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Path</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Referrer</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr key={v._id} style={{ borderBottom: '1px solid var(--border-faint)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 500 }}>{v.ip}</span>
                          <button
                            onClick={() => copyToClipboard(v.ip, v._id)}
                            style={{ color: 'var(--text-muted)', padding: '2px' }}
                            title="Copy IP"
                          >
                            {copiedId === v._id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {v.city ? `${v.city}, ${v.country}` : v.country || 'Unknown'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ background: 'var(--bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                          {v.path}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                        {v.referrer || 'Direct'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                        {formatDate(v.visitedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Logs */}
      {activeTab === 'logs' && (
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-faint)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-faint)' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Activity Logs</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audit trail from collection `activity_logs`</p>
            </div>

            {logs.length > 0 && (
              <button
                onClick={handleClearLogs}
                style={{
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Trash2 size={13} />
                <span>Clear logs</span>
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Activity size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem' }}>No activity logged yet</p>
            </div>
          ) : (
            <div>
              {logs.map((log) => (
                <div
                  key={log._id}
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderBottom: '1px solid var(--border-faint)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: log.action.includes('SUBMISSION') ? 'var(--accent-tint)' : 'var(--bg-subtle)',
                          color: log.action.includes('SUBMISSION') ? 'var(--accent-signal)' : 'var(--text-main)',
                        }}
                      >
                        {log.action}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{log.details}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      IP: {log.ip || 'Unknown'} {log.location ? `· ${log.location}` : ''}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
