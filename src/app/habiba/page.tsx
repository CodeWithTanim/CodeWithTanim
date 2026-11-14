'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  Shield,
  Lock,
  Mail,
  Globe,
  Activity,
  Trash2,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Eye,
  Copy,
  Check,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

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

export default function HabibaAdminPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Authentication Form States
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data States
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

  // Check if initial admin account exists
  useEffect(() => {
    fetch('/api/admin/check-setup')
      .then((res) => res.json())
      .then((data) => setHasAdmin(data.hasAdmin))
      .catch(() => setHasAdmin(true));
  }, []);

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

  // Auth Submit (Sign in or Initial Setup)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (hasAdmin === false) {
        // Initial Admin Setup (Sign up)
        const result = await authClient.signUp.email({
          email: authEmail,
          password: authPassword,
          name: authName || 'Admin',
        });

        if (result.error) {
          setAuthError(result.error.message || 'Failed to initialize admin account.');
        } else {
          setHasAdmin(true);
        }
      } else {
        // Normal Sign In
        const result = await authClient.signIn.email({
          email: authEmail,
          password: authPassword,
        });

        if (result.error) {
          setAuthError(result.error.message || 'Invalid email or password.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Admin Actions
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
    if (!window.confirm('Are you sure you want to delete this message?')) return;
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
    if (!window.confirm('Clear all activity logs from the database?')) return;
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
    if (!window.confirm('Clear all visitor tracking logs?')) return;
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
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Filtered submissions
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

  // 1. Loading Session state
  if (sessionPending) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--signal)' }} />
          <p className="mono" style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
            AUTHENTICATING SESSION...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Screen (Login / Initial Setup)
  if (!session?.user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'var(--panel)',
            border: '2px solid var(--ink)',
            padding: '2.5rem 2rem',
            boxShadow: '8px 8px 0px var(--ink)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={22} style={{ color: 'var(--signal)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                HABIBA // ADMIN
              </h1>
              <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                {hasAdmin === false ? 'INITIAL SUPERADMIN SETUP' : 'RESTRICTED ACCESS PORTAL'}
              </p>
            </div>
          </div>

          {authError && (
            <div
              style={{
                background: 'var(--signal-tint)',
                border: '1px solid var(--signal)',
                color: 'var(--signal)',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            {hasAdmin === false && (
              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Samiur Rahman Tanim"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    border: '1px solid var(--ink)',
                    background: 'var(--paper)',
                    color: 'var(--ink)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Admin Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="codewithtanim@gmail.com"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--ink)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--ink)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'var(--ink)',
                color: 'var(--paper)',
                border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {authLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Processing...</span>
                </>
              ) : hasAdmin === false ? (
                <>
                  <span>Create Superadmin</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Sign In To Habiba</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--hair-faint)', fontSize: '0.75rem', color: 'var(--ink-soft)' }} className="mono">
            <span>DATABASE: </span>
            <strong style={{ color: 'var(--ink)' }}>MongoDB Atlas (cwt-portfolio)</strong>
            <br />
            <span>AUTH ENGINE: </span>
            <strong style={{ color: 'var(--ink)' }}>Better-Auth v1.x</strong>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard Screen
  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      {/* Top Header Bar */}
      <div
        style={{
          background: 'var(--panel)',
          border: '2px solid var(--ink)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          boxShadow: '4px 4px 0px var(--ink)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--signal)',
              color: 'var(--paper)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            H
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              HABIBA // COMMAND CENTER
            </h1>
            <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
              LOGGED IN AS: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{session.user.email}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={fetchDashboardData}
            disabled={dataLoading}
            className="mono"
            style={{
              padding: '0.5rem 0.85rem',
              background: 'var(--paper)',
              border: '1px solid var(--ink)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
            }}
          >
            <RefreshCw size={14} className={dataLoading ? 'animate-spin' : ''} />
            <span>{dataLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.reload();
            }}
            className="mono"
            style={{
              padding: '0.5rem 0.85rem',
              background: 'var(--ink)',
              color: 'var(--paper)',
              border: '1px solid var(--ink)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
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
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            background: 'var(--panel)',
            border: '2px solid var(--ink)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--ink)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="mono" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Total Messages
            </span>
            <Mail size={16} style={{ color: 'var(--signal)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{stats.totalSubmissions}</div>
          <div className="mono" style={{ fontSize: '0.75rem', color: stats.unreadSubmissions > 0 ? 'var(--signal)' : 'var(--ink-soft)', marginTop: '0.25rem' }}>
            {stats.unreadSubmissions} unread {stats.unreadSubmissions === 1 ? 'message' : 'messages'}
          </div>
        </div>

        <div
          style={{
            background: 'var(--panel)',
            border: '2px solid var(--ink)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--ink)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="mono" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Page Views
            </span>
            <Globe size={16} style={{ color: 'var(--signal)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{stats.totalVisits}</div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.25rem' }}>
            Tracked site hits
          </div>
        </div>

        <div
          style={{
            background: 'var(--panel)',
            border: '2px solid var(--ink)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--ink)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="mono" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Unique IPs
            </span>
            <MapPin size={16} style={{ color: 'var(--signal)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>{stats.uniqueIps}</div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.25rem' }}>
            Distinct visitor addresses
          </div>
        </div>

        <div
          style={{
            background: 'var(--panel)',
            border: '2px solid var(--ink)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--ink)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="mono" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Cluster Status
            </span>
            <Activity size={16} style={{ color: '#16a34a' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#16a34a', marginTop: '0.35rem' }}>
            HEALTHY
          </div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.45rem' }}>
            DB: cwt-portfolio
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid var(--ink)',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            padding: '0.75rem 1.25rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            border: '2px solid var(--ink)',
            borderBottom: activeTab === 'submissions' ? '2px solid var(--panel)' : '2px solid var(--ink)',
            marginBottom: '-2px',
            background: activeTab === 'submissions' ? 'var(--panel)' : 'var(--paper)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Mail size={16} />
          <span>Messages ({stats.totalSubmissions})</span>
          {stats.unreadSubmissions > 0 && (
            <span
              style={{
                background: 'var(--signal)',
                color: 'var(--paper)',
                fontSize: '0.7rem',
                padding: '0.1rem 0.4rem',
                fontWeight: 700,
              }}
            >
              {stats.unreadSubmissions}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          style={{
            padding: '0.75rem 1.25rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            border: '2px solid var(--ink)',
            borderBottom: activeTab === 'visitors' ? '2px solid var(--panel)' : '2px solid var(--ink)',
            marginBottom: '-2px',
            background: activeTab === 'visitors' ? 'var(--panel)' : 'var(--paper)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Globe size={16} />
          <span>IP Tracker ({visitors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '0.75rem 1.25rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            border: '2px solid var(--ink)',
            borderBottom: activeTab === 'logs' ? '2px solid var(--panel)' : '2px solid var(--ink)',
            marginBottom: '-2px',
            background: activeTab === 'logs' ? 'var(--panel)' : 'var(--paper)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Activity size={16} />
          <span>Activity Logs ({logs.length})</span>
        </button>
      </div>

      {/* Tab 1: Messages / Submissions */}
      {activeTab === 'submissions' && (
        <div>
          {/* Submissions Filter Toolbar */}
          <div
            style={{
              background: 'var(--panel)',
              border: '2px solid var(--ink)',
              padding: '0.85rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} style={{ color: 'var(--ink-soft)' }} />
              <button
                onClick={() => setSubmissionFilter('all')}
                className="mono"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  border: '1px solid var(--ink)',
                  background: submissionFilter === 'all' ? 'var(--ink)' : 'var(--paper)',
                  color: submissionFilter === 'all' ? 'var(--paper)' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('unread')}
                className="mono"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  border: '1px solid var(--ink)',
                  background: submissionFilter === 'unread' ? 'var(--signal)' : 'var(--paper)',
                  color: submissionFilter === 'unread' ? 'var(--paper)' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                Unread ({submissions.filter((s) => s.status === 'unread').length})
              </button>
              <button
                onClick={() => setSubmissionFilter('read')}
                className="mono"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  border: '1px solid var(--ink)',
                  background: submissionFilter === 'read' ? 'var(--ink)' : 'var(--paper)',
                  color: submissionFilter === 'read' ? 'var(--paper)' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                Read ({submissions.filter((s) => s.status === 'read').length})
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '220px' }}>
              <Search size={16} style={{ color: 'var(--ink-soft)' }} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.35rem 0.65rem',
                  border: '1px solid var(--ink)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '0.8rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div
              style={{
                background: 'var(--panel)',
                border: '2px solid var(--ink)',
                padding: '3rem 1rem',
                textAlign: 'center',
                boxShadow: '4px 4px 0px var(--ink)',
              }}
            >
              <Mail size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--ink-soft)' }} />
              <p className="mono" style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                NO MESSAGES FOUND IN COLLECTION `contact_submissions`
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selectedSubmission ? '1fr 1fr' : '1fr', gap: '1rem' }}>
              {/* Messages List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      background: 'var(--panel)',
                      border: '2px solid var(--ink)',
                      borderLeft: sub.status === 'unread' ? '6px solid var(--signal)' : '2px solid var(--ink)',
                      padding: '1rem',
                      cursor: 'pointer',
                      boxShadow: selectedSubmission?._id === sub._id ? '4px 4px 0px var(--ink)' : '2px 2px 0px var(--ink)',
                      transition: 'transform 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{sub.name}</div>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-soft)' }}>
                        {formatDate(sub.createdAt)}
                      </div>
                    </div>

                    <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--signal)', marginBottom: '0.5rem' }}>
                      {sub.email}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.65rem' }}>
                      {sub.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={12} />
                        <span>
                          {sub.location?.city ? `${sub.location.city}, ${sub.location.country}` : sub.ip}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(sub._id, sub.status === 'unread' ? 'read' : 'unread');
                          }}
                          className="mono"
                          style={{
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.7rem',
                            border: '1px solid var(--ink)',
                            background: 'var(--paper)',
                            cursor: 'pointer',
                          }}
                        >
                          {sub.status === 'unread' ? 'Mark Read' : 'Unread'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(sub._id);
                          }}
                          style={{
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.7rem',
                            border: '1px solid var(--signal)',
                            background: 'var(--signal-tint)',
                            color: 'var(--signal)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Details Preview Pane */}
              {selectedSubmission && (
                <div
                  style={{
                    background: 'var(--panel)',
                    border: '2px solid var(--ink)',
                    padding: '1.5rem',
                    boxShadow: '4px 4px 0px var(--ink)',
                    position: 'sticky',
                    top: '90px',
                    height: 'fit-content',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--hair-faint)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>{selectedSubmission.name}</h2>
                      <a href={`mailto:${selectedSubmission.email}`} className="mono" style={{ fontSize: '0.85rem', color: 'var(--signal)', textDecoration: 'underline' }}>
                        {selectedSubmission.email}
                      </a>
                    </div>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="mono"
                      style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--ink)', background: 'var(--paper)', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Close
                    </button>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginBottom: '0.25rem' }}>
                      MESSAGE BODY:
                    </div>
                    <div
                      style={{
                        background: 'var(--paper)',
                        border: '1px solid var(--hair-faint)',
                        padding: '1rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {selectedSubmission.message}
                    </div>
                  </div>

                  {/* Metadata info */}
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--hair-faint)', paddingTop: '1rem' }}>
                    <div>
                      <strong>IP ADDRESS:</strong> {selectedSubmission.ip}
                    </div>
                    <div>
                      <strong>LOCATION:</strong> {selectedSubmission.location?.city || 'Unknown'}, {selectedSubmission.location?.country || ''}
                    </div>
                    <div>
                      <strong>SENT AT:</strong> {formatDate(selectedSubmission.createdAt)}
                    </div>
                    <div>
                      <strong>STATUS:</strong> {selectedSubmission.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re:%20Inquiry%20via%20CodeWithTanim%20Portfolio`}
                      className="mono"
                      style={{
                        padding: '0.6rem 1rem',
                        background: 'var(--ink)',
                        color: 'var(--paper)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
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
                      className="mono"
                      style={{
                        padding: '0.6rem 1rem',
                        background: 'var(--signal-tint)',
                        color: 'var(--signal)',
                        border: '1px solid var(--signal)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
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

      {/* Tab 2: Visitor IP Tracker */}
      {activeTab === 'visitors' && (
        <div
          style={{
            background: 'var(--panel)',
            border: '2px solid var(--ink)',
            padding: '1.25rem',
            boxShadow: '4px 4px 0px var(--ink)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', textTransform: 'uppercase' }}>
                VISITOR IP TRACKER & GEOLOCATION
              </h2>
              <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                Recorded in collection `visitor_logs`
              </p>
            </div>

            {visitors.length > 0 && (
              <button
                onClick={handleClearVisitors}
                className="mono"
                style={{
                  padding: '0.4rem 0.75rem',
                  background: 'var(--signal-tint)',
                  color: 'var(--signal)',
                  border: '1px solid var(--signal)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Trash2 size={13} />
                <span>Clear All Visitors</span>
              </button>
            )}
          </div>

          {visitors.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <Globe size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--ink-soft)' }} />
              <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                NO VISITOR SESSIONS RECORDED YET. VISITS TO THE SITE WILL APPEAR HERE AUTOMATICALLY.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--ink)', background: 'var(--paper)' }} className="mono">
                    <th style={{ padding: '0.75rem 0.5rem' }}>IP Address</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Location</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Path</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Referrer</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Visited At</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr key={v._id} style={{ borderBottom: '1px solid var(--hair-faint)' }}>
                      <td style={{ padding: '0.75rem 0.5rem' }} className="mono">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontWeight: 600 }}>{v.ip}</span>
                          <button
                            onClick={() => copyToClipboard(v.ip, v._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--ink-soft)' }}
                            title="Copy IP"
                          >
                            {copiedId === v._id ? <Check size={12} color="green" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} style={{ color: 'var(--signal)' }} />
                          <span>
                            {v.city ? `${v.city}, ${v.country}` : v.country || 'Unknown'}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '0.75rem 0.5rem' }} className="mono">
                        <span style={{ background: 'var(--paper)', padding: '0.2rem 0.4rem', border: '1px solid var(--hair-faint)' }}>
                          {v.path}
                        </span>
                      </td>

                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--ink-soft)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="mono">
                        {v.referrer || 'Direct / None'}
                      </td>

                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--ink-soft)' }} className="mono">
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

      {/* Tab 3: Activity Logs */}
      {activeTab === 'logs' && (
        <div
          style={{
            background: 'var(--panel)',
            border: '2px solid var(--ink)',
            padding: '1.25rem',
            boxShadow: '4px 4px 0px var(--ink)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', textTransform: 'uppercase' }}>
                WEBSITE AUDIT & ACTIVITY LOGS
              </h2>
              <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                Recorded in collection `activity_logs`
              </p>
            </div>

            {logs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="mono"
                style={{
                  padding: '0.4rem 0.75rem',
                  background: 'var(--signal-tint)',
                  color: 'var(--signal)',
                  border: '1px solid var(--signal)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Trash2 size={13} />
                <span>Clear All Logs</span>
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <Activity size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--ink-soft)' }} />
              <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                NO ACTIVITY LOGS RECORDED YET.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {logs.map((log) => {
                const isForm = log.action === 'CONTACT_FORM_SUBMISSION';
                const isVisit = log.action === 'PAGE_VISIT';

                return (
                  <div
                    key={log._id}
                    style={{
                      background: 'var(--paper)',
                      border: '1px solid var(--ink)',
                      borderLeft: isForm ? '4px solid var(--signal)' : isVisit ? '4px solid var(--ink)' : '4px solid #16a34a',
                      padding: '0.75rem 1rem',
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
                          className="mono"
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.4rem',
                            background: isForm ? 'var(--signal)' : 'var(--ink)',
                            color: 'var(--paper)',
                          }}
                        >
                          {log.action}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.details}</span>
                      </div>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-soft)' }}>
                        IP: {log.ip || 'unknown'} {log.location ? `· Location: ${log.location}` : ''}
                      </div>
                    </div>

                    <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
