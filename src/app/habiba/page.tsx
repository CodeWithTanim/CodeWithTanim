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
  BarChart3,
  History,
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
  Filter,
  Shield,
  Send,
  User,
  Globe,
  Radio,
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

  // YouTube Studio Navigation States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'visitors' | 'logs' | 'database'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Global styles for YouTube Studio aesthetic
  const ytStyles = (
    <style dangerouslySetInnerHTML={{ __html: `
      * { box-sizing: border-box; }
      .yt-scroll::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .yt-scroll::-webkit-scrollbar-track {
        background: #0f0f0f;
      }
      .yt-scroll::-webkit-scrollbar-thumb {
        background: #272727;
        border-radius: 4px;
      }
      .yt-scroll::-webkit-scrollbar-thumb:hover {
        background: #3f3f3f;
      }
      .yt-hover-btn {
        transition: background-color 0.15s ease, transform 0.1s ease;
      }
      .yt-hover-btn:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      .yt-nav-item {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        height: 44px;
        padding: 0 1.25rem;
        color: #aaaaaa;
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
      .yt-nav-item:hover {
        background-color: #1f1f1f;
        color: #ffffff;
      }
      .yt-nav-item.active {
        background-color: #272727;
        color: #ffffff;
        font-weight: 600;
      }
      .yt-nav-item.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: #ff0000;
      }
      .yt-chip {
        padding: 0.4rem 0.85rem;
        border-radius: 18px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid transparent;
        background: #272727;
        color: #f1f1f1;
      }
      .yt-chip:hover {
        background: #383838;
      }
      .yt-chip.active {
        background: #f1f1f1;
        color: #0f0f0f;
        font-weight: 600;
      }
      .yt-card {
        background: #1f1f1f;
        border: 1px solid #272727;
        border-radius: 12px;
        overflow: hidden;
      }
      .yt-row:hover {
        background-color: #272727 !important;
      }
    `}} />
  );

  // 1. YouTube Studio Style Login Portal
  if (!session?.user) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#0f0f0f',
          color: '#f1f1f1',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflowY: 'auto',
          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {ytStyles}

        {/* Minimal YouTube Studio Top Header */}
        <header
          style={{
            height: '56px',
            borderBottom: '1px solid #272727',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            background: '#0f0f0f',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '22px',
                background: '#ff0000',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '9px solid white',
                  marginLeft: '2px',
                }}
              />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Studio
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                background: '#272727',
                color: '#aaaaaa',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600,
                marginLeft: '4px',
              }}
            >
              ADMIN
            </span>
          </div>

          <a
            href="/"
            style={{
              fontSize: '0.85rem',
              color: '#3ea6ff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Back to portfolio</span>
            <ExternalLink size={14} />
          </a>
        </header>

        {/* Login Center Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '410px',
              width: '100%',
              background: '#1f1f1f',
              border: '1px solid #282828',
              borderRadius: '16px',
              padding: '2.5rem 2.25rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Logo & Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '40px',
                  background: '#ff0000',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 16px rgba(255, 0, 0, 0.35)',
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '7px solid transparent',
                    borderBottom: '7px solid transparent',
                    borderLeft: '13px solid white',
                    marginLeft: '3px',
                  }}
                />
              </div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                Sign In to Studio
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#aaaaaa', margin: 0 }}>
                Manage inquiries, visitor analytics & portfolio logs
              </p>
            </div>

            {authError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#ff8a8a',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#aaaaaa',
                    marginBottom: '0.45rem',
                  }}
                >
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#717171',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="codewithtanim@gmail.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.6rem',
                      borderRadius: '8px',
                      border: '1px solid #383838',
                      background: '#121212',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3ea6ff')}
                    onBlur={(e) => (e.target.style.borderColor = '#383838')}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#aaaaaa',
                    marginBottom: '0.45rem',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Shield
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#717171',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.75rem 0.75rem 2.6rem',
                      borderRadius: '8px',
                      border: '1px solid #383838',
                      background: '#121212',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3ea6ff')}
                    onBlur={(e) => (e.target.style.borderColor = '#383838')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#aaaaaa',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'transparent',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '24px',
                  background: '#ff0000',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: authLoading ? 0.75 : 1,
                  cursor: authLoading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(255, 0, 0, 0.3)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#cc0000')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff0000')}
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
          </div>
        </div>
      </div>
    );
  }

  // 2. Full YouTube Studio Dashboard Layout
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0f0f0f',
        color: '#f1f1f1',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {ytStyles}

      {/* TOP HEADER (YouTube Studio Header) */}
      <header
        style={{
          height: '56px',
          background: '#0f0f0f',
          borderBottom: '1px solid #272727',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem 0 1.25rem',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* Left: Hamburger & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="yt-hover-btn"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '32px',
                height: '22px',
                background: '#ff0000',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '9px solid white',
                  marginLeft: '2px',
                }}
              />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Studio
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                background: '#272727',
                color: '#aaaaaa',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600,
                marginLeft: '2px',
              }}
            >
              ADMIN
            </span>
          </div>
        </div>

        {/* Center: Search Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#121212',
            border: '1px solid #303030',
            borderRadius: '24px',
            padding: '0 1rem',
            width: '100%',
            maxWidth: '520px',
            height: '40px',
            margin: '0 1rem',
          }}
        >
          <Search size={16} style={{ color: '#aaaaaa', marginRight: '0.75rem', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages, visitors, activity across Studio..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.9rem',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                color: '#aaaaaa',
                fontSize: '0.85rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Right: Actions & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={fetchDashboardData}
            disabled={dataLoading}
            className="yt-hover-btn"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            title="Refresh Data"
          >
            <RefreshCw size={18} className={dataLoading ? 'animate-spin' : ''} />
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="yt-hover-btn"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                position: 'relative',
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {stats.unreadSubmissions > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '16px',
                    height: '16px',
                    background: '#ff0000',
                    color: '#ffffff',
                    borderRadius: '50%',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stats.unreadSubmissions > 9 ? '9+' : stats.unreadSubmissions}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '320px',
                  background: '#1f1f1f',
                  border: '1px solid #282828',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  zIndex: 200,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                  <span style={{ fontSize: '0.75rem', color: '#aaaaaa' }}>{stats.unreadSubmissions} unread</span>
                </div>
                <div style={{ maxHeight: '240px', overflowY: 'auto' }} className="yt-scroll">
                  {submissions.filter((s) => s.status === 'unread').length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: '#717171', textAlign: 'center', padding: '1rem 0' }}>
                      No new unread messages
                    </div>
                  ) : (
                    submissions
                      .filter((s) => s.status === 'unread')
                      .slice(0, 4)
                      .map((sub) => (
                        <div
                          key={sub._id}
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setActiveTab('submissions');
                            setShowNotifications(false);
                          }}
                          style={{
                            padding: '0.6rem 0.5rem',
                            borderBottom: '1px solid #282828',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                          }}
                          className="yt-row"
                        >
                          <div style={{ fontWeight: 600, color: '#f1f1f1' }}>{sub.name}</div>
                          <div style={{ color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {sub.message}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#717171', marginTop: '2px' }}>
                            {timeAgo(sub.createdAt)}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Circle */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#ff0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#ffffff',
              marginLeft: '0.5rem',
              cursor: 'pointer',
            }}
            title={session.user.email}
          >
            T
          </div>
        </div>
      </header>

      {/* BODY (SIDEBAR + MAIN CONTENT) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT SIDEBAR (YouTube Studio Navigation) */}
        <aside
          style={{
            width: sidebarCollapsed ? '72px' : '240px',
            background: '#0f0f0f',
            borderRight: '1px solid #272727',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            transition: 'width 0.2s cubic-bezier(0.2, 0, 0, 1)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          className="yt-scroll"
        >
          {/* Channel Info in Sidebar (Only when expanded) */}
          {!sidebarCollapsed && (
            <div
              style={{
                padding: '1.25rem 1rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid #272727',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#ff0000',
                  margin: '0 auto 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(255, 0, 0, 0.25)',
                }}
              >
                T
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
                Your Portfolio
              </div>
              <div style={{ fontSize: '0.78rem', color: '#aaaaaa', marginTop: '2px', wordBreak: 'break-all' }}>
                {session.user.email}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav style={{ flex: 1, padding: '0.5rem 0' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`yt-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              title="Dashboard"
            >
              <LayoutDashboard size={20} style={{ color: activeTab === 'dashboard' ? '#ff0000' : '#aaaaaa', flexShrink: 0 }} />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`yt-nav-item ${activeTab === 'submissions' ? 'active' : ''}`}
              title="Inquiries"
            >
              <MessageSquare size={20} style={{ color: activeTab === 'submissions' ? '#ff0000' : '#aaaaaa', flexShrink: 0 }} />
              {!sidebarCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Inquiries</span>
                  {stats.unreadSubmissions > 0 && (
                    <span
                      style={{
                        background: '#ff0000',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {stats.unreadSubmissions}
                    </span>
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('visitors')}
              className={`yt-nav-item ${activeTab === 'visitors' ? 'active' : ''}`}
              title="Analytics"
            >
              <BarChart3 size={20} style={{ color: activeTab === 'visitors' ? '#ff0000' : '#aaaaaa', flexShrink: 0 }} />
              {!sidebarCollapsed && <span>Analytics</span>}
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`yt-nav-item ${activeTab === 'logs' ? 'active' : ''}`}
              title="Activity Logs"
            >
              <History size={20} style={{ color: activeTab === 'logs' ? '#ff0000' : '#aaaaaa', flexShrink: 0 }} />
              {!sidebarCollapsed && <span>Activity Logs</span>}
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`yt-nav-item ${activeTab === 'database' ? 'active' : ''}`}
              title="Database"
            >
              <Database size={20} style={{ color: activeTab === 'database' ? '#ff0000' : '#aaaaaa', flexShrink: 0 }} />
              {!sidebarCollapsed && <span>Database</span>}
            </button>
          </nav>

          {/* Sidebar Footer Actions */}
          <div style={{ borderTop: '1px solid #272727', padding: '0.5rem 0' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="yt-nav-item"
              title="View Public Portfolio"
            >
              <ExternalLink size={18} style={{ color: '#aaaaaa', flexShrink: 0 }} />
              {!sidebarCollapsed && <span>View Portfolio</span>}
            </a>

            <button
              onClick={async () => {
                await authClient.signOut();
                window.location.reload();
              }}
              className="yt-nav-item"
              title="Sign Out"
            >
              <LogOut size={18} style={{ color: '#aaaaaa', flexShrink: 0 }} />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE (Content Area) */}
        <main
          style={{
            flex: 1,
            background: '#0f0f0f',
            overflowY: 'auto',
            padding: '1.75rem 2.25rem',
          }}
          className="yt-scroll"
        >
          {/* TAB 1: YOUTUBE STUDIO CHANNEL DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  Channel dashboard
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#aaaaaa' }}>
                    Database: <span style={{ color: '#2ba640', fontWeight: 600 }}>Connected</span>
                  </span>
                </div>
              </div>

              {/* YouTube Studio 4 Analytics Summary Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div className="yt-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaaaaa', fontSize: '0.85rem' }}>
                    <span>Inquiries</span>
                    <Mail size={16} color="#ff0000" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff', margin: '0.5rem 0 0.2rem' }}>
                    {stats.totalSubmissions}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: stats.unreadSubmissions > 0 ? '#ff4d4d' : '#aaaaaa' }}>
                    {stats.unreadSubmissions} unread messages
                  </div>
                </div>

                <div className="yt-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaaaaa', fontSize: '0.85rem' }}>
                    <span>Views (Site Visits)</span>
                    <Globe size={16} color="#3ea6ff" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff', margin: '0.5rem 0 0.2rem' }}>
                    {stats.totalVisits}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>
                    Total page hits recorded
                  </div>
                </div>

                <div className="yt-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaaaaa', fontSize: '0.85rem' }}>
                    <span>Audience (Unique IPs)</span>
                    <MapPin size={16} color="#2ba640" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff', margin: '0.5rem 0 0.2rem' }}>
                    {stats.uniqueIps}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>
                    Distinct visitors
                  </div>
                </div>

                <div className="yt-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaaaaa', fontSize: '0.85rem' }}>
                    <span>Activity Logs</span>
                    <Activity size={16} color="#f59e0b" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff', margin: '0.5rem 0 0.2rem' }}>
                    {logs.length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>
                    System events logged
                  </div>
                </div>
              </div>

              {/* YouTube Studio Dashboard Widgets Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {/* Widget 1: Latest Inquiries (YouTube Studio Comments/Community Card) */}
                <div className="yt-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                        Recent Inquiries
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: '#aaaaaa', margin: '2px 0 0' }}>
                        Messages sent through portfolio contact form
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('submissions')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#3ea6ff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      GO TO INQUIRIES &rarr;
                    </button>
                  </div>

                  {submissions.length === 0 ? (
                    <div style={{ padding: '2rem 0', textAlign: 'center', color: '#717171', fontSize: '0.9rem' }}>
                      No messages received yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {submissions.slice(0, 4).map((sub) => (
                        <div
                          key={sub._id}
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setActiveTab('submissions');
                          }}
                          style={{
                            padding: '0.85rem',
                            borderRadius: '8px',
                            background: '#121212',
                            border: '1px solid #282828',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.85rem',
                            alignItems: 'flex-start',
                          }}
                          className="yt-row"
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: sub.status === 'unread' ? '#ff0000' : '#272727',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {sub.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                                {sub.name}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#717171' }}>
                                {timeAgo(sub.createdAt)}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                              {sub.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Widget 2: Realtime Visitor Analytics (YouTube Studio Realtime Card) */}
                <div className="yt-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                          Realtime Analytics
                        </h2>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#2ba640',
                            display: 'inline-block',
                            boxShadow: '0 0 8px #2ba640',
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#aaaaaa', margin: '2px 0 0' }}>
                        Live visitor traffic across portfolio routes
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('visitors')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#3ea6ff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      SEE MORE &rarr;
                    </button>
                  </div>

                  {visitors.length === 0 ? (
                    <div style={{ padding: '2rem 0', textAlign: 'center', color: '#717171', fontSize: '0.9rem' }}>
                      No visitor records logged yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {visitors.slice(0, 5).map((v) => (
                        <div
                          key={v._id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.65rem 0.75rem',
                            background: '#121212',
                            borderRadius: '8px',
                            border: '1px solid #282828',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#ffffff' }}>
                              {v.path}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#aaaaaa' }}>
                              {v.city ? `${v.city}, ` : ''}{v.country || 'Unknown location'} • {v.ip}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#717171' }}>
                            {timeAgo(v.visitedAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES (YouTube Studio "Content / Comments" Style) */}
          {activeTab === 'submissions' && (
            <div>
              {/* Header & Filter Chips */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                    Inquiries ({submissions.length})
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: '#aaaaaa', margin: '2px 0 0' }}>
                    Messages submitted by portfolio visitors
                  </p>
                </div>

                {/* Filter Chips */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSubmissionFilter('all')}
                    className={`yt-chip ${submissionFilter === 'all' ? 'active' : ''}`}
                  >
                    All ({submissions.length})
                  </button>
                  <button
                    onClick={() => setSubmissionFilter('unread')}
                    className={`yt-chip ${submissionFilter === 'unread' ? 'active' : ''}`}
                  >
                    Unread ({stats.unreadSubmissions})
                  </button>
                  <button
                    onClick={() => setSubmissionFilter('read')}
                    className={`yt-chip ${submissionFilter === 'read' ? 'active' : ''}`}
                  >
                    Read ({submissions.length - stats.unreadSubmissions})
                  </button>
                </div>
              </div>

              {/* Inquiries Table / Feed */}
              <div className="yt-card">
                {filteredSubmissions.length === 0 ? (
                  <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#aaaaaa' }}>
                    No inquiries found matching criteria.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }} className="yt-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #272727', color: '#aaaaaa', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '0.85rem 1rem' }}>Sender</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Message</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                          <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.map((sub) => (
                          <tr
                            key={sub._id}
                            style={{
                              borderBottom: '1px solid #272727',
                              background: selectedSubmission?._id === sub._id ? '#272727' : 'transparent',
                              cursor: 'pointer',
                            }}
                            className="yt-row"
                            onClick={() => setSelectedSubmission(sub)}
                          >
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: sub.status === 'unread' ? '#ff0000' : '#383838',
                                    color: '#ffffff',
                                    fontSize: '0.8rem',
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
                                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{sub.name}</div>
                                  <div style={{ fontSize: '0.78rem', color: '#aaaaaa' }}>{sub.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', maxWidth: '340px' }}>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f1f1f1' }}>
                                {sub.message}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#717171' }}>
                                IP: {sub.ip}
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', color: '#aaaaaa', fontSize: '0.8rem' }}>
                              {formatDate(sub.createdAt)}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                              {sub.status === 'unread' ? (
                                <span style={{ background: 'rgba(255, 0, 0, 0.2)', color: '#ff4d4d', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600 }}>
                                  UNREAD
                                </span>
                              ) : (
                                <span style={{ background: '#272727', color: '#aaaaaa', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 500 }}>
                                  READ
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(sub._id, sub.status === 'unread' ? 'read' : 'unread');
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#aaaaaa',
                                  cursor: 'pointer',
                                  padding: '6px',
                                  borderRadius: '4px',
                                  marginRight: '4px',
                                }}
                                title={sub.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                                className="yt-hover-btn"
                              >
                                <Check size={16} color={sub.status === 'read' ? '#2ba640' : '#aaaaaa'} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubmission(sub._id);
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#ff4d4d',
                                  cursor: 'pointer',
                                  padding: '6px',
                                  borderRadius: '4px',
                                }}
                                title="Delete permanently"
                                className="yt-hover-btn"
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

              {/* Selected Message Detail Drawer / Modal */}
              {selectedSubmission && (
                <div
                  style={{
                    position: 'fixed',
                    right: 0,
                    top: '56px',
                    bottom: 0,
                    width: '440px',
                    maxWidth: '100vw',
                    background: '#181818',
                    borderLeft: '1px solid #282828',
                    padding: '1.5rem',
                    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.6)',
                    zIndex: 250,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  className="yt-scroll"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #282828', paddingBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>Message Details</span>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      style={{ background: 'transparent', border: 'none', color: '#aaaaaa', fontSize: '1.1rem', cursor: 'pointer', padding: '4px' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                        {selectedSubmission.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{selectedSubmission.name}</div>
                        <div style={{ fontSize: '0.82rem', color: '#3ea6ff' }}>{selectedSubmission.email}</div>
                      </div>
                    </div>

                    <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#aaaaaa', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Message Body
                      </div>
                      <div style={{ fontSize: '0.92rem', color: '#ffffff', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {selectedSubmission.message}
                      </div>
                    </div>

                    <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#aaaaaa' }}>Received:</span>
                        <span style={{ color: '#ffffff' }}>{formatDate(selectedSubmission.createdAt)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#aaaaaa' }}>Sender IP:</span>
                        <span style={{ color: '#ffffff' }}>{selectedSubmission.ip}</span>
                      </div>
                      {selectedSubmission.location && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#aaaaaa' }}>Location:</span>
                          <span style={{ color: '#ffffff' }}>
                            {selectedSubmission.location.city ? `${selectedSubmission.location.city}, ` : ''}
                            {selectedSubmission.location.country || 'Unknown'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid #282828', paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re: Inquiry on CodeWithTanim`}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: '#3ea6ff',
                        color: '#0f0f0f',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        borderRadius: '20px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Send size={15} />
                      <span>Reply via Email</span>
                    </a>
                    <button
                      onClick={() => handleDeleteSubmission(selectedSubmission._id)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: '#272727',
                        color: '#ff4d4d',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
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

          {/* TAB 3: VISITOR ANALYTICS (YouTube Studio "Analytics" Style) */}
          {activeTab === 'visitors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                    Channel analytics (Visitors)
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: '#aaaaaa', margin: '2px 0 0' }}>
                    Tracked portfolio visits, IP addresses, and routes
                  </p>
                </div>
                <button
                  onClick={handleClearVisitors}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#272727',
                    color: '#aaaaaa',
                    border: 'none',
                    borderRadius: '18px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                  className="yt-hover-btn"
                >
                  Clear History
                </button>
              </div>

              {/* YouTube Studio Metrics Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div className="yt-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: '#aaaaaa', fontSize: '0.82rem' }}>Total Page Views</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '0.35rem' }}>
                    {stats.totalVisits}
                  </div>
                </div>
                <div className="yt-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: '#aaaaaa', fontSize: '0.82rem' }}>Unique IP Viewers</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '0.35rem' }}>
                    {stats.uniqueIps}
                  </div>
                </div>
                <div className="yt-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: '#aaaaaa', fontSize: '0.82rem' }}>Live Tracking Mode</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#2ba640', marginTop: '0.5rem' }}>
                    Active (Beacon)
                  </div>
                </div>
              </div>

              {/* Visitor Logs Table */}
              <div className="yt-card">
                {filteredVisitors.length === 0 ? (
                  <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#aaaaaa' }}>
                    No visitor logs recorded.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }} className="yt-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #272727', color: '#aaaaaa', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '0.85rem 1rem' }}>IP Address</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Path</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Referrer</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVisitors.map((v) => (
                          <tr key={v._id} style={{ borderBottom: '1px solid #272727' }} className="yt-row">
                            <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#3ea6ff' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span>{v.ip}</span>
                                <button
                                  onClick={() => copyToClipboard(v.ip, v._id)}
                                  style={{ background: 'transparent', border: 'none', color: '#717171', cursor: 'pointer', padding: '2px' }}
                                  title="Copy IP"
                                >
                                  {copiedId === v._id ? <Check size={13} color="#2ba640" /> : <Copy size={13} />}
                                </button>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#ffffff' }}>
                              {v.city ? `${v.city}, ` : ''}{v.country || 'Unknown'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#ffffff', fontWeight: 500 }}>
                              {v.path}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#aaaaaa', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {v.referrer || 'Direct'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#aaaaaa', whiteSpace: 'nowrap' }}>
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

          {/* TAB 4: ACTIVITY LOGS (YouTube Studio "History" Style) */}
          {activeTab === 'logs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                    Studio Activity Logs ({logs.length})
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: '#aaaaaa', margin: '2px 0 0' }}>
                    Audit trail of all administrative and portfolio actions
                  </p>
                </div>
                <button
                  onClick={handleClearLogs}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#272727',
                    color: '#aaaaaa',
                    border: 'none',
                    borderRadius: '18px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                  className="yt-hover-btn"
                >
                  Clear Logs
                </button>
              </div>

              <div className="yt-card">
                {filteredLogs.length === 0 ? (
                  <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#aaaaaa' }}>
                    No activity logs recorded.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }} className="yt-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #272727', color: '#aaaaaa', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '0.85rem 1rem' }}>Action</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Details</th>
                          <th style={{ padding: '0.85rem 1rem' }}>IP</th>
                          <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map((log) => (
                          <tr key={log._id} style={{ borderBottom: '1px solid #272727' }} className="yt-row">
                            <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                              <span
                                style={{
                                  background: '#272727',
                                  color: '#3ea6ff',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#ffffff' }}>
                              {log.details}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#aaaaaa', fontFamily: 'monospace' }}>
                              {log.ip || '-'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#aaaaaa', whiteSpace: 'nowrap' }}>
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

          {/* TAB 5: DATABASE & SYSTEM STATUS */}
          {activeTab === 'database' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                  Database & System Architecture
                </h1>
                <p style={{ fontSize: '0.82rem', color: '#aaaaaa', margin: '2px 0 0' }}>
                  Backend infrastructure and connected services
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                <div className="yt-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={18} color="#2ba640" />
                    <span>MongoDB Atlas Cluster</span>
                  </h3>
                  <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#aaaaaa' }}>Cluster Status:</span>
                      <span style={{ color: '#2ba640', fontWeight: 600 }}>Connected</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#aaaaaa' }}>Database Name:</span>
                      <span style={{ color: '#ffffff', fontWeight: 500 }}>cwt-portfolio</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#aaaaaa' }}>Submissions Collection:</span>
                      <span style={{ color: '#ffffff' }}>contact_submissions ({stats.totalSubmissions})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#aaaaaa' }}>Visitor Tracking Collection:</span>
                      <span style={{ color: '#ffffff' }}>visitor_logs ({stats.totalVisits})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#aaaaaa' }}>Activity Logs Collection:</span>
                      <span style={{ color: '#ffffff' }}>activity_logs ({logs.length})</span>
                    </div>
                  </div>
                </div>

                <div className="yt-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={18} color="#3ea6ff" />
                    <span>Authentication & Security</span>
                  </h3>
                  <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#aaaaaa' }}>Auth Provider:</span>
                      <span style={{ color: '#ffffff', fontWeight: 500 }}>Better-Auth (MongoDB Adapter)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#aaaaaa' }}>Admin User:</span>
                      <span style={{ color: '#ffffff' }}>{session.user.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '0.5rem' }}>
                      <span style={{ color: '#aaaaaa' }}>Telegram Bot Notifications:</span>
                      <span style={{ color: '#2ba640' }}>Configured</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#aaaaaa' }}>Obscured Admin Path:</span>
                      <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>/habiba</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
