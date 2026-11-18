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
  GraduationCap,
  Globe,
  Activity,
  Settings,
  RefreshCw,
  LogOut,
  ExternalLink,
  Trash2,
  Check,
  Copy,
  MapPin,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Moon,
  Lock,
  Send,
  Key,
  UserCheck,
  Filter,
  Bell,
  CheckCheck,
  Inbox,
  Phone,
  MessageCircle,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
  formType?: 'contact' | 'course';
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

type TabType = 'dashboard' | 'contact_forms' | 'course_forms' | 'analytics' | 'logs' | 'settings';

export default function AdminPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Auth form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Navigation States
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

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
  const [showNotifications, setShowNotifications] = useState(false);

  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    isDangerous?: boolean;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Delete',
    isDangerous: true,
    onConfirm: () => {},
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Settings form states
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Telegram settings states
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [telegramConfigured, setTelegramConfigured] = useState(false);
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramTestLoading, setTelegramTestLoading] = useState(false);
  const [telegramMessage, setTelegramMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      setIsCheckingSession(false);
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
        if (data.telegramStatus) {
          setTelegramConfigured(Boolean(data.telegramStatus.configured));
          if (data.telegramStatus.chatId && !telegramChatId) {
            setTelegramChatId(data.telegramStatus.chatId);
          }
        }
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
      const interval = setInterval(fetchDashboardData, 15000);
      return () => clearInterval(interval);
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

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_all_read',
          payload: {},
        }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.map((s) => ({ ...s, status: 'read' })));
        if (selectedSubmission) {
          setSelectedSubmission((prev) => (prev ? { ...prev, status: 'read' } : null));
        }
        setStats((prev) => ({
          ...prev,
          unreadSubmissions: 0,
        }));
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleOpenNotification = (sub: Submission) => {
    if (sub.status === 'unread') {
      handleUpdateStatus(sub._id, 'read');
    }
    setSelectedSubmission(sub);
    const isCourse = isCourseSubmission(sub);
    setActiveTab(isCourse ? 'course_forms' : 'contact_forms');
    setShowNotifications(false);
  };

  const handleDeleteSubmission = (id: string, name?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Submission?',
      description: name 
        ? `Are you sure you want to delete the submission from "${name}"? This action cannot be undone.` 
        : 'Are you sure you want to permanently delete this submission? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      isDangerous: true,
      onConfirm: async () => {
        setConfirmLoading(true);
        const toastId = toast.loading('Deleting submission...');
        try {
          const res = await fetch('/api/admin/actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'delete_submission',
              payload: { id },
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success !== false) {
            setSubmissions((prev) => prev.filter((s) => s._id !== id));
            if (selectedSubmission?._id === id) {
              setSelectedSubmission(null);
            }
            setStats((prev) => ({
              ...prev,
              totalSubmissions: Math.max(0, prev.totalSubmissions - 1),
            }));
            toast.success('Submission deleted successfully!', { id: toastId });
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          } else {
            toast.error(data.error || 'Failed to delete submission', { id: toastId });
          }
        } catch (err) {
          console.error('Error deleting submission:', err);
          toast.error('Network error while deleting', { id: toastId });
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleClearLogs = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Activity Logs?',
      description: 'Are you sure you want to wipe all stored activity logs? This action cannot be undone.',
      confirmText: 'Yes, Clear Logs',
      isDangerous: true,
      onConfirm: async () => {
        setConfirmLoading(true);
        const toastId = toast.loading('Clearing activity logs...');
        try {
          const res = await fetch('/api/admin/actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'clear_logs', payload: {} }),
          });
          if (res.ok) {
            setLogs([]);
            toast.success('All activity logs have been cleared!', { id: toastId });
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          } else {
            toast.error('Failed to clear logs', { id: toastId });
          }
        } catch (err) {
          console.error('Error clearing logs:', err);
          toast.error('Network error while clearing logs', { id: toastId });
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleClearVisitors = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Visitor Logs?',
      description: 'Are you sure you want to delete all visitor analytics and tracking records?',
      confirmText: 'Yes, Clear Visitors',
      isDangerous: true,
      onConfirm: async () => {
        setConfirmLoading(true);
        const toastId = toast.loading('Clearing visitor records...');
        try {
          const res = await fetch('/api/admin/actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'clear_visitors', payload: {} }),
          });
          if (res.ok) {
            setVisitors([]);
            setStats((prev) => ({ ...prev, totalVisits: 0, uniqueIps: 0 }));
            toast.success('Visitor logs cleared successfully!', { id: toastId });
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          } else {
            toast.error('Failed to clear visitor records', { id: toastId });
          }
        } catch (err) {
          console.error('Error clearing visitors:', err);
          toast.error('Network error while clearing visitors', { id: toastId });
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  // Change Password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);
    if (newPass !== confirmPass) {
      setPassMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPass.length < 8) {
      setPassMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    setPassLoading(true);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          payload: { currentPassword: currentPass, newPassword: newPass },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassMessage({ type: 'success', text: 'Password successfully changed! Use your new password on next login.' });
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        setPassMessage({ type: 'error', text: data.error || 'Failed to update password. Please check your current password.' });
      }
    } catch {
      setPassMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setPassLoading(false);
    }
  };

  // Update Profile
  const handleProfileChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    if (!newAdminEmail.trim() && !newAdminName.trim()) {
      setProfileMessage({ type: 'error', text: 'Please enter a new email or name to update.' });
      return;
    }
    setProfileLoading(true);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          payload: { newEmail: newAdminEmail.trim(), newName: newAdminName.trim() },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMessage({ type: 'success', text: 'Admin profile updated successfully!' });
        await checkSession();
      } else {
        setProfileMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch {
      setProfileMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Telegram Alert Settings Handlers
  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramMessage(null);
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      setTelegramMessage({ type: 'error', text: 'Both Bot Token and Chat ID are required.' });
      return;
    }
    setTelegramLoading(true);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_telegram_config',
          payload: { botToken: telegramToken.trim(), chatId: telegramChatId.trim() },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelegramConfigured(true);
        setTelegramMessage({ type: 'success', text: 'Telegram bot settings saved! Now try the Send Test Alert button below.' });
      } else {
        setTelegramMessage({ type: 'error', text: data.error || 'Failed to save Telegram settings.' });
      }
    } catch {
      setTelegramMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleTestTelegram = async () => {
    setTelegramMessage(null);
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      setTelegramMessage({ type: 'error', text: 'Please enter Bot Token and Chat ID first.' });
      return;
    }
    setTelegramTestLoading(true);
    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_telegram_alert',
          payload: { botToken: telegramToken.trim(), chatId: telegramChatId.trim() },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelegramConfigured(true);
        setTelegramMessage({ type: 'success', text: 'Test alert sent! Please check your Telegram app.' });
      } else {
        setTelegramMessage({ type: 'error', text: data.error || 'Failed to send test alert. Please verify your Bot Token and Chat ID.' });
      }
    } catch {
      setTelegramMessage({ type: 'error', text: 'Network error sending test alert.' });
    } finally {
      setTelegramTestLoading(false);
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

  // Form split logic (Contact vs Course)
  const isCourseSubmission = (sub: Submission) => {
    const msg = (sub.message || '').toLowerCase();
    return (
      sub.formType === 'course' ||
      msg.includes('course enrollment') ||
      msg.includes('python') ||
      msg.includes('payment method:') ||
      msg.includes('transaction id:')
    );
  };

  const parseCourseDetails = (msg: string) => {
    const phoneMatch = msg.match(/Phone:\s*([^\n]+)/i);
    const whatsappMatch = msg.match(/WhatsApp:\s*([^\n]+)/i);
    const paymentMatch = msg.match(/Payment Method:\s*([^\n]+)/i);
    const txMatch = msg.match(/Transaction ID:\s*([^\n]+)/i);
    const addressMatch = msg.match(/Address:\s*([^\n]+)/i);
    const goalMatch = msg.match(/Goal \/ Reason:\s*([^\n]+)/i);

    return {
      course: 'Python A–Z Masterclass',
      phone: phoneMatch ? phoneMatch[1].trim() : (whatsappMatch ? whatsappMatch[1].trim() : 'N/A'),
      whatsapp: whatsappMatch ? whatsappMatch[1].trim() : 'N/A',
      payment: paymentMatch ? paymentMatch[1].trim() : 'Pending',
      txId: txMatch ? txMatch[1].trim() : 'Pending',
      address: addressMatch ? addressMatch[1].trim() : 'N/A',
      goal: goalMatch ? goalMatch[1].trim() : 'Not specified',
    };
  };

  const contactSubmissions = submissions.filter((s) => !isCourseSubmission(s));
  const courseSubmissions = submissions.filter((s) => isCourseSubmission(s));

  const unreadContacts = contactSubmissions.filter((s) => s.status === 'unread').length;
  const unreadCourses = courseSubmissions.filter((s) => s.status === 'unread').length;

  const filteredContacts = contactSubmissions.filter((sub) => {
    if (submissionFilter !== 'all' && sub.status !== submissionFilter) return false;
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

  const filteredCourses = courseSubmissions.filter((sub) => {
    if (submissionFilter !== 'all' && sub.status !== submissionFilter) return false;
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
      .admin-sidebar {
        width: ${sidebarOpen ? '240px' : '64px'};
        background: var(--bg-panel);
        border-right: 1px solid var(--border-faint);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        transition: width 0.2s cubic-bezier(0.2, 0, 0, 1), transform 0.25s cubic-bezier(0.2, 0, 0, 1);
        overflow-y: auto;
        overflow-x: hidden;
      }
      .admin-sidebar-backdrop {
        display: none;
      }
      .admin-btn-label {
        display: inline;
      }
      .admin-header-brand-text {
        font-family: var(--font-display);
        font-size: 1.15rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--text-main);
      }
      .admin-detail-drawer {
        position: fixed;
        right: 0;
        top: 60px;
        bottom: 0;
        width: 480px;
        max-width: 100vw;
        background: var(--bg-panel);
        border-left: 2px solid var(--border-strong);
        padding: 1.75rem;
        box-shadow: var(--shadow-lg);
        z-index: 250;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      .admin-notification-popover {
        position: absolute;
        top: calc(100% + 10px);
        left: 0;
        width: 380px;
        max-width: 92vw;
        background: var(--bg-panel);
        border: 1.5px solid var(--border-strong);
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 300;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .admin-main-pane {
        flex: 1;
        overflow-y: auto;
        padding: 1.75rem 2rem;
        background: var(--bg-primary);
      }
      .admin-summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.75rem;
      }
      .admin-split-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
      }
      .admin-settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      /* Tablet and Mobile Optimization (< 1024px) */
      @media (max-width: 1023px) {
        .admin-sidebar {
          position: fixed !important;
          top: 60px !important;
          bottom: 0 !important;
          left: 0 !important;
          width: 270px !important;
          z-index: 500 !important;
          transform: translateX(${sidebarOpen ? '0' : '-100%'}) !important;
          box-shadow: ${sidebarOpen ? '4px 0 30px rgba(0,0,0,0.5)' : 'none'} !important;
        }
        .admin-sidebar-backdrop {
          display: ${sidebarOpen ? 'block' : 'none'} !important;
          position: fixed !important;
          inset: 60px 0 0 0 !important;
          background: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(2px) !important;
          z-index: 490 !important;
        }
        .admin-btn-label {
          display: none !important;
        }
        .admin-main-pane {
          padding: 1rem 0.75rem !important;
        }
        .admin-detail-drawer {
          position: fixed !important;
          inset: 60px 0 0 0 !important;
          width: 100vw !important;
          max-width: 100vw !important;
          border-left: none !important;
          padding: 1.25rem 1rem !important;
          z-index: 550 !important;
        }
        .admin-notification-popover {
          position: fixed !important;
          top: 65px !important;
          left: 10px !important;
          right: 10px !important;
          width: auto !important;
          max-width: calc(100vw - 20px) !important;
          z-index: 600 !important;
        }
        .admin-split-grid {
          grid-template-columns: 1fr !important;
        }
        .admin-settings-grid {
          grid-template-columns: 1fr !important;
        }
        .admin-header-brand-text {
          font-size: 1rem !important;
        }
      }

      @media (max-width: 600px) {
        .admin-summary-grid {
          grid-template-columns: 1fr !important;
        }
        .admin-login-card {
          margin: 0 0.5rem;
          border-radius: 8px !important;
        }
      }
      .admin-nav-item {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        height: 44px;
        padding: 0 1.25rem;
        color: var(--text-muted);
        text-decoration: none;
        border: none;
        background: transparent;
        width: 100%;
        font-size: 0.88rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        position: relative;
        text-align: left;
        white-space: nowrap;
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
        padding: 0.38rem 0.8rem;
        border-radius: 6px;
        font-size: 0.8rem;
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
        border-radius: 8px;
        box-shadow: var(--shadow-sm);
        overflow: hidden;
      }
      .admin-table-row:hover {
        background-color: var(--bg-subtle) !important;
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
      }
      .admin-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1.5px solid var(--border-faint);
        border-radius: 6px;
        background: var(--bg-primary);
        color: var(--text-main);
        font-size: 0.9rem;
        font-family: var(--font-body);
        outline: none;
        transition: all 0.15s ease;
      }
      .admin-input:focus {
        border-color: var(--accent-signal);
        box-shadow: 0 0 0 3px var(--accent-tint);
      }
      .admin-btn-primary {
        padding: 0.75rem 1.25rem;
        background: var(--accent-signal);
        color: #ffffff;
        font-family: var(--font-mono);
        font-weight: 700;
        font-size: 0.86rem;
        text-transform: uppercase;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
        border: 1.5px solid var(--border-strong);
        border-radius: 6px;
        box-shadow: var(--shadow-sm);
        transition: all 0.15s ease;
      }
      .admin-btn-primary:hover:not(:disabled) {
        background: var(--accent-signal-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }
      .admin-btn-primary:active:not(:disabled) {
        transform: translateY(1px);
      }
      .admin-btn-primary:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px var(--bg-primary) inset !important;
        -webkit-text-fill-color: var(--text-main) !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    `}} />
  );

  // 1. Initial Session Check Screen (prevents login form flash when user is already authenticated)
  if (isCheckingSession) {
    return (
      <div
        className="admin-login-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {portfolioStyles}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--accent-signal)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  // 2. Sleek Modern Login Portal Matching Website Theme (Only shown if genuinely logged out)
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

        <div className="admin-login-glow" />

        {/* Minimal Top Header */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            height: '60px',
            borderBottom: '1px solid var(--border-faint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                padding: '0.75rem 1.25rem',
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
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: 'var(--accent-tint)',
                    border: '1.5px solid var(--accent-signal)',
                    color: 'var(--accent-signal)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem',
                  }}
                >
                  <Lock size={22} strokeWidth={2.2} />
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.45rem',
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
                  Sign in to manage inquiries & visitor telemetry
                </p>
              </div>

              {authError && (
                <div
                  style={{
                    background: 'var(--accent-tint)',
                    border: '1.5px solid var(--accent-signal)',
                    color: 'var(--accent-signal)',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
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

              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label
                    className="mono"
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
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
                      className="admin-input"
                      style={{ paddingLeft: '2.75rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="mono"
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
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
                      className="admin-input"
                      style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
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
                  className="admin-btn-primary"
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      <span>Signing in...</span>
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
                padding: '0.75rem 1.25rem',
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
                <span className="mono" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM READY</span>
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

  // 2. Full Admin Dashboard (Left Sidebar Layout matching Website Theme)
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

      {/* TOP HEADER */}
      <header
        style={{
          height: '60px',
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-faint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* Left: Sidebar Toggle & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              border: '1px solid var(--border-faint)',
              background: 'var(--bg-primary)',
              cursor: 'pointer',
            }}
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>

          <div
            onClick={() => handleNavClick('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          >
            <span
              className="admin-header-brand-text"
            >
              CODE<span style={{ color: 'var(--accent-signal)' }}>WITH</span>TANIM
            </span>
            <span
              className="mono admin-btn-label"
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

          <div style={{ height: '18px', width: '1px', background: 'var(--border-faint)', margin: '0 0.15rem' }} />

          {/* TOP-LEFT NOTIFICATION BELL WITH BADGE & DROPDOWN */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stats.unreadSubmissions > 0 ? 'var(--accent-signal)' : 'var(--text-main)',
                border: stats.unreadSubmissions > 0 ? '1.5px solid var(--accent-signal)' : '1px solid var(--border-faint)',
                background: stats.unreadSubmissions > 0 ? 'var(--accent-tint)' : 'var(--bg-primary)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
              title={`Notifications (${stats.unreadSubmissions} unread)`}
            >
              <Bell size={17} />
              {stats.unreadSubmissions > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '9px',
                    background: 'var(--accent-signal)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
                  }}
                >
                  {stats.unreadSubmissions > 99 ? '99+' : stats.unreadSubmissions}
                </span>
              )}
            </button>

            {/* Floating Dropdown Drawer */}
            {showNotifications && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 290,
                  }}
                  onClick={() => setShowNotifications(false)}
                />

                <div
                  className="admin-notification-popover"
                  style={{
                    background: 'var(--bg-panel)',
                    border: '1.5px solid var(--border-strong)',
                    borderRadius: '10px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 300,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Dropdown Header */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      background: 'var(--bg-subtle)',
                      borderBottom: '1px solid var(--border-faint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Bell size={16} style={{ color: 'var(--accent-signal)' }} />
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Notifications
                      </span>
                      {stats.unreadSubmissions > 0 && (
                        <span
                          style={{
                            background: 'var(--accent-signal)',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '10px',
                          }}
                        >
                          {stats.unreadSubmissions} new
                        </span>
                      )}
                    </div>

                    {stats.unreadSubmissions > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-signal)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                        title="Mark all notifications as read"
                      >
                        <CheckCheck size={14} />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Dropdown List */}
                  <div
                    style={{
                      maxHeight: '380px',
                      overflowY: 'auto',
                    }}
                    className="admin-scroll"
                  >
                    {submissions.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Inbox size={28} style={{ opacity: 0.4, margin: '0 auto 0.5rem' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No notifications yet</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          Form submissions will appear here automatically.
                        </div>
                      </div>
                    ) : (
                      submissions.slice(0, 20).map((sub) => {
                        const isCourse = isCourseSubmission(sub);
                        const isUnread = sub.status === 'unread';
                        return (
                          <div
                            key={sub._id}
                            style={{
                              padding: '0.85rem 1rem',
                              borderBottom: '1px solid var(--border-faint)',
                              background: isUnread ? 'var(--bg-subtle)' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                              display: 'flex',
                              gap: '0.75rem',
                              alignItems: 'flex-start',
                            }}
                            className="admin-table-row"
                            onClick={() => handleOpenNotification(sub)}
                          >
                            <div style={{ paddingTop: '5px' }}>
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: isUnread ? 'var(--accent-signal)' : 'var(--border-faint)',
                                  display: 'inline-block',
                                }}
                              />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '3px' }}>
                                <span
                                  style={{
                                    fontSize: '0.82rem',
                                    fontWeight: isUnread ? 700 : 500,
                                    color: 'var(--text-main)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {sub.name}
                                </span>
                                <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                  {timeAgo(sub.createdAt)}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '4px' }}>
                                {isCourse ? (
                                  <span
                                    className="mono"
                                    style={{
                                      fontSize: '0.62rem',
                                      padding: '1px 5px',
                                      borderRadius: '3px',
                                      background: '#8b5cf618',
                                      color: '#8b5cf6',
                                      border: '1px solid #8b5cf640',
                                      fontWeight: 700,
                                    }}
                                  >
                                    COURSE ENROLLMENT
                                  </span>
                                ) : (
                                  <span
                                    className="mono"
                                    style={{
                                      fontSize: '0.62rem',
                                      padding: '1px 5px',
                                      borderRadius: '3px',
                                      background: 'var(--accent-tint)',
                                      color: 'var(--accent-signal)',
                                      border: '1px solid var(--accent-signal)',
                                      fontWeight: 700,
                                    }}
                                  >
                                    CONTACT INQUIRY
                                  </span>
                                )}
                              </div>

                              <p
                                style={{
                                  margin: 0,
                                  fontSize: '0.78rem',
                                  color: 'var(--text-muted)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {sub.message.replace(/\n+/g, ' ')}
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(sub._id, isUnread ? 'read' : 'unread');
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: isUnread ? 'var(--accent-signal)' : 'var(--text-muted)',
                                padding: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                              }}
                              title={isUnread ? 'Mark as read' : 'Mark as unread'}
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      background: 'var(--bg-subtle)',
                      borderTop: '1px solid var(--border-faint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                    }}
                  >
                    <button
                      onClick={() => {
                        setActiveTab('contact_forms');
                        setShowNotifications(false);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.74rem',
                      }}
                    >
                      View Contacts &rarr;
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('course_forms');
                        setShowNotifications(false);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-signal)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                      }}
                    >
                      View Course Enrollments &rarr;
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>


        </div>

        {/* Right: Refresh, Theme Toggle, View Site, Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <button
            onClick={fetchDashboardData}
            disabled={dataLoading}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-faint)',
              color: 'var(--text-main)',
              padding: '6px 10px',
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
            <span className="admin-btn-label">Refresh</span>
          </button>

          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-faint)',
              color: 'var(--text-main)',
              padding: '6px 10px',
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
            <span className="admin-btn-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-faint)',
              color: 'var(--text-main)',
              padding: '6px 10px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
            title="View Public Site"
          >
            <ExternalLink size={14} />
            <span className="admin-btn-label">View Site</span>
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
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            title="Sign Out"
          >
            <LogOut size={14} />
            <span className="admin-btn-label">Sign Out</span>
          </button>
        </div>
      </header>

      {/* BODY (LEFT SIDEBAR + RIGHT WORKSPACE) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Backdrop for mobile when sidebar is open */}
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />

        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="admin-sidebar admin-scroll">
          <nav style={{ flex: 1, padding: '0.75rem 0' }}>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              title="Dashboard"
            >
              <LayoutDashboard size={18} style={{ color: activeTab === 'dashboard' ? 'var(--accent-signal)' : 'var(--text-muted)', flexShrink: 0 }} />
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            {/* FORMS SECTION */}
            {sidebarOpen && (
              <div
                className="mono"
                style={{
                  padding: '1rem 1.25rem 0.35rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.75px',
                }}
              >
                Forms
              </div>
            )}

            {/* Option: Contact Inquiries */}
            <button
              onClick={() => handleNavClick('contact_forms')}
              className={`admin-nav-item ${activeTab === 'contact_forms' ? 'active' : ''}`}
              title="Contact Inquiries"
            >
              <MessageSquare size={18} style={{ color: activeTab === 'contact_forms' ? 'var(--accent-signal)' : 'var(--text-muted)', flexShrink: 0 }} />
              {sidebarOpen && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Contact Inquiries</span>
                  {unreadContacts > 0 && (
                    <span
                      style={{
                        background: 'var(--accent-signal)',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {unreadContacts}
                    </span>
                  )}
                </div>
              )}
            </button>

            {/* Option: Course Enrollments */}
            <button
              onClick={() => handleNavClick('course_forms')}
              className={`admin-nav-item ${activeTab === 'course_forms' ? 'active' : ''}`}
              title="Course Enrollments"
            >
              <GraduationCap size={18} style={{ color: activeTab === 'course_forms' ? 'var(--accent-signal)' : 'var(--text-muted)', flexShrink: 0 }} />
              {sidebarOpen && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Course Enrollments</span>
                  {unreadCourses > 0 && (
                    <span
                      style={{
                        background: 'var(--accent-signal)',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {unreadCourses}
                    </span>
                  )}
                </div>
              )}
            </button>

            {/* MONITORING SECTION */}
            {sidebarOpen && (
              <div
                className="mono"
                style={{
                  padding: '1rem 1.25rem 0.35rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.75px',
                }}
              >
                Monitoring
              </div>
            )}

            {/* Option: Analytics */}
            <button
              onClick={() => handleNavClick('analytics')}
              className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              title="Visitor Analytics"
            >
              <Globe size={18} style={{ color: activeTab === 'analytics' ? 'var(--accent-signal)' : 'var(--text-muted)', flexShrink: 0 }} />
              {sidebarOpen && <span>Analytics</span>}
            </button>

            {/* Option: Activity Logs */}
            <button
              onClick={() => handleNavClick('logs')}
              className={`admin-nav-item ${activeTab === 'logs' ? 'active' : ''}`}
              title="Activity Logs"
            >
              <Activity size={18} style={{ color: activeTab === 'logs' ? 'var(--accent-signal)' : 'var(--text-muted)', flexShrink: 0 }} />
              {sidebarOpen && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Activity Logs</span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-subtle)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {logs.length}
                  </span>
                </div>
              )}
            </button>

            {/* SYSTEM SECTION */}
            {sidebarOpen && (
              <div
                className="mono"
                style={{
                  padding: '1rem 1.25rem 0.35rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.75px',
                }}
              >
                System
              </div>
            )}

            {/* Option: Settings */}
            <button
              onClick={() => handleNavClick('settings')}
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              title="Settings"
            >
              <Settings size={18} style={{ color: activeTab === 'settings' ? 'var(--accent-signal)' : 'var(--text-muted)', flexShrink: 0 }} />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </nav>

          {/* Bottom user label */}
          {sidebarOpen && (
            <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-faint)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div className="mono" style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.user.email}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Superadmin</div>
            </div>
          )}
        </aside>

        {/* RIGHT WORKSPACE (CONTENT UPDATES BASED ON SELECTED SIDEBAR ITEM) */}
        <main className="admin-main-pane admin-scroll">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* OPTION 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    Dashboard Overview
                  </h1>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                    Welcome back. Real-time overview of portfolio inquiries, enrollments, and visitor analytics.
                  </p>
                </div>

                {/* 4 Summary Cards */}
                <div className="admin-summary-grid">
                  <div
                    className="admin-card"
                    style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--accent-signal)', cursor: 'pointer' }}
                    onClick={() => setActiveTab('contact_forms')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                      <span>Contact Messages</span>
                      <MessageSquare size={16} color="var(--accent-signal)" />
                    </div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 0.2rem' }}>
                      {contactSubmissions.length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: unreadContacts > 0 ? 'var(--accent-signal)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {unreadContacts > 0 ? `${unreadContacts} unread inquiries` : 'All caught up'}
                    </div>
                  </div>

                  <div
                    className="admin-card"
                    style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #8b5cf6', cursor: 'pointer' }}
                    onClick={() => setActiveTab('course_forms')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                      <span>Course Enrollments</span>
                      <GraduationCap size={16} color="#8b5cf6" />
                    </div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 0.2rem' }}>
                      {courseSubmissions.length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: unreadCourses > 0 ? '#8b5cf6' : 'var(--text-muted)', fontWeight: 600 }}>
                      {unreadCourses > 0 ? `${unreadCourses} pending applications` : 'All processed'}
                    </div>
                  </div>

                  <div
                    className="admin-card"
                    style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #06b6d4', cursor: 'pointer' }}
                    onClick={() => setActiveTab('analytics')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                      <span>Visitor Analytics</span>
                      <Globe size={16} color="#06b6d4" />
                    </div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0 0.2rem' }}>
                      {stats.totalVisits}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {stats.uniqueIps} unique IP addresses
                    </div>
                  </div>

                  <div
                    className="admin-card"
                    style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #10b981', cursor: 'pointer' }}
                    onClick={() => setActiveTab('settings')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                      <span>Telegram Alert Bot</span>
                      <Send size={16} color="#10b981" />
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', margin: '0.65rem 0 0.2rem' }}>
                      Active
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Instant telegram notifications
                    </div>
                  </div>
                </div>

                {/* Split Grid: Recent Contacts + Recent Course Enrollments */}
                <div className="admin-split-grid">
                  {/* Recent Contacts */}
                  <div className="admin-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.75rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent Contact Messages</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Latest general contact submissions</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('contact_forms')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-signal)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        VIEW ALL &rarr;
                      </button>
                    </div>

                    {contactSubmissions.length === 0 ? (
                      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No contact messages yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {contactSubmissions.slice(0, 4).map((sub) => (
                          <div
                            key={sub._id}
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setActiveTab('contact_forms');
                            }}
                            style={{
                              padding: '0.85rem',
                              border: '1px solid var(--border-faint)',
                              borderRadius: '6px',
                              background: 'var(--bg-subtle)',
                              cursor: 'pointer',
                              display: 'flex',
                              gap: '0.85rem',
                              alignItems: 'center',
                            }}
                            className="admin-table-row"
                          >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: sub.status === 'unread' ? 'var(--accent-signal)' : 'var(--text-muted)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                              {sub.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>{sub.name}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeAgo(sub.createdAt)}</span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {sub.message}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Course Applications */}
                  <div className="admin-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.75rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent Course Applications</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Masterclass student registrations</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('course_forms')}
                        style={{ background: 'transparent', border: 'none', color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        VIEW ALL &rarr;
                      </button>
                    </div>

                    {courseSubmissions.length === 0 ? (
                      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No course enrollments yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {courseSubmissions.slice(0, 4).map((sub) => {
                          const details = parseCourseDetails(sub.message);
                          return (
                            <div
                              key={sub._id}
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setActiveTab('course_forms');
                              }}
                              style={{
                                padding: '0.85rem',
                                border: '1px solid var(--border-faint)',
                                borderRadius: '6px',
                                background: 'var(--bg-subtle)',
                                cursor: 'pointer',
                                display: 'flex',
                                gap: '0.85rem',
                                alignItems: 'center',
                              }}
                              className="admin-table-row"
                            >
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: sub.status === 'unread' ? '#8b5cf6' : 'var(--text-muted)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                                {sub.name.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>{sub.name}</span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeAgo(sub.createdAt)}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {details.payment} • TxID: {details.txId} • Phone: {details.phone}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* OPTION 2: CONTACT INQUIRIES */}
            {activeTab === 'contact_forms' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                      Contact Inquiries ({contactSubmissions.length})
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                      Messages received directly from your portfolio contact form
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-panel)', border: '1px solid var(--border-faint)', borderRadius: '6px', padding: '0 0.75rem', height: '36px', width: '240px' }}>
                      <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '0.5rem', flexShrink: 0 }} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contact messages..."
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.82rem', width: '100%' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => setSubmissionFilter('all')} className={`admin-chip ${submissionFilter === 'all' ? 'active' : ''}`}>
                        All ({contactSubmissions.length})
                      </button>
                      <button onClick={() => setSubmissionFilter('unread')} className={`admin-chip ${submissionFilter === 'unread' ? 'active' : ''}`}>
                        Unread ({unreadContacts})
                      </button>
                      <button onClick={() => setSubmissionFilter('read')} className={`admin-chip ${submissionFilter === 'read' ? 'active' : ''}`}>
                        Read ({contactSubmissions.length - unreadContacts})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  {filteredContacts.length === 0 ? (
                    <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <MessageSquare size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No contact inquiries found</div>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="admin-scroll">
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', minWidth: '650px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-faint)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', background: 'var(--bg-subtle)' }}>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Sender</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Message</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>IP & Location</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Date</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredContacts.map((sub) => (
                            <tr
                              key={sub._id}
                              style={{ borderBottom: '1px solid var(--border-faint)', background: selectedSubmission?._id === sub._id ? 'var(--bg-subtle)' : 'transparent', cursor: 'pointer' }}
                              className="admin-table-row"
                              onClick={() => setSelectedSubmission(sub)}
                            >
                              <td style={{ padding: '0.85rem 1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: sub.status === 'unread' ? 'var(--accent-signal)' : 'var(--bg-subtle)', color: sub.status === 'unread' ? '#ffffff' : 'var(--text-main)', border: '1px solid var(--border-faint)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                                <div className="mono" style={{ fontSize: '0.8rem' }}>{sub.ip}</div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{sub.location?.city ? `${sub.location.city}, ` : ''}{sub.location?.country || 'Unknown'}</div>
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
                                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '6px', display: 'inline-flex', alignItems: 'center', marginRight: '4px' }}
                                  title="Reply via Email"
                                >
                                  <Mail size={16} />
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(sub._id, sub.status === 'unread' ? 'read' : 'unread');
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: sub.status === 'read' ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', padding: '6px', marginRight: '4px' }}
                                  title={sub.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSubmission(sub._id, sub.name);
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-signal)', cursor: 'pointer', padding: '6px' }}
                                  title="Delete Message"
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
              </div>
            )}

            {/* OPTION 3: COURSE ENROLLMENTS */}
            {activeTab === 'course_forms' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                      Course Enrollments ({courseSubmissions.length})
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                      Applications for Python A–Z Comprehensive Masterclass and courses
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-panel)', border: '1px solid var(--border-faint)', borderRadius: '6px', padding: '0 0.75rem', height: '36px', width: '240px' }}>
                      <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '0.5rem', flexShrink: 0 }} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search enrollments..."
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.82rem', width: '100%' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => setSubmissionFilter('all')} className={`admin-chip ${submissionFilter === 'all' ? 'active' : ''}`}>
                        All ({courseSubmissions.length})
                      </button>
                      <button onClick={() => setSubmissionFilter('unread')} className={`admin-chip ${submissionFilter === 'unread' ? 'active' : ''}`}>
                        Unread ({unreadCourses})
                      </button>
                      <button onClick={() => setSubmissionFilter('read')} className={`admin-chip ${submissionFilter === 'read' ? 'active' : ''}`}>
                        Read ({courseSubmissions.length - unreadCourses})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  {filteredCourses.length === 0 ? (
                    <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <GraduationCap size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No course enrollments found</div>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="admin-scroll">
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', minWidth: '650px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-faint)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', background: 'var(--bg-subtle)' }}>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Student Name</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Contact Info</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Payment & TxID</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Application Date</th>
                            <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCourses.map((sub) => {
                            const details = parseCourseDetails(sub.message);
                            return (
                              <tr
                                key={sub._id}
                                style={{ borderBottom: '1px solid var(--border-faint)', background: selectedSubmission?._id === sub._id ? 'var(--bg-subtle)' : 'transparent', cursor: 'pointer' }}
                                className="admin-table-row"
                                onClick={() => setSelectedSubmission(sub)}
                              >
                                <td style={{ padding: '0.85rem 1.25rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: sub.status === 'unread' ? '#8b5cf6' : 'var(--bg-subtle)', color: sub.status === 'unread' ? '#ffffff' : 'var(--text-main)', border: '1px solid var(--border-faint)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      {sub.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sub.name}</div>
                                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Phone: {details.phone}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IP: {sub.ip}</div>
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{details.payment}</div>
                                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-signal)' }}>
                                    TxID: {details.txId}
                                  </div>
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                  <div>{timeAgo(sub.createdAt)}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{formatDate(sub.createdAt)}</div>
                                </td>
                                <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                                  {sub.status === 'unread' ? (
                                    <span style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', border: '1px solid #8b5cf6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
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
                                    href={`mailto:${sub.email}?subject=Regarding Python A–Z Masterclass Enrollment`}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '6px', display: 'inline-flex', alignItems: 'center', marginRight: '4px' }}
                                    title="Email Student"
                                  >
                                    <Mail size={16} />
                                  </a>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(sub._id, sub.status === 'unread' ? 'read' : 'unread');
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: sub.status === 'read' ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', padding: '6px', marginRight: '4px' }}
                                    title={sub.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSubmission(sub._id, sub.name);
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-signal)', cursor: 'pointer', padding: '6px' }}
                                    title="Delete Application"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OPTION 4: ANALYTICS (VISITORS) */}
            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                      Visitor Analytics ({visitors.length})
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                      Tracked client IP addresses, geographic locations, and page hit telemetry
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-panel)', border: '1px solid var(--border-faint)', borderRadius: '6px', padding: '0 0.75rem', height: '36px', width: '240px' }}>
                      <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '0.5rem', flexShrink: 0 }} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by IP, location, path..."
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.82rem', width: '100%' }}
                      />
                    </div>

                    <button
                      onClick={handleClearVisitors}
                      style={{ padding: '0.5rem 1rem', background: 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid var(--border-faint)', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Clear History
                    </button>
                  </div>
                </div>

                <div className="admin-card">
                  {filteredVisitors.length === 0 ? (
                    <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No visitor analytics recorded.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="admin-scroll">
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '650px' }}>
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

            {/* OPTION 5: ACTIVITY LOGS */}
            {activeTab === 'logs' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                      Activity Logs ({logs.length})
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                      Audit log of administrative actions, updates, and configuration changes
                    </p>
                  </div>
                  <button
                    onClick={handleClearLogs}
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid var(--border-faint)', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
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
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="admin-scroll">
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '650px' }}>
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
                                <span className="mono" style={{ background: 'var(--bg-subtle)', color: 'var(--accent-signal)', border: '1px solid var(--border-faint)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700 }}>
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

            {/* OPTION 6: SETTINGS (REPLACING DATABASE) */}
            {activeTab === 'settings' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    Admin Settings & Security
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                    Change admin password, update username/email, and manage account security
                  </p>
                </div>

                <div className="admin-settings-grid">
                  {/* Card 1: Change Password */}
                  <div className="admin-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.75rem' }}>
                      <Key size={18} color="var(--accent-signal)" />
                      <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Change Admin Password</h2>
                    </div>

                    {passMessage && (
                      <div
                        style={{
                          background: passMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'var(--accent-tint)',
                          border: `1px solid ${passMessage.type === 'success' ? '#10b981' : 'var(--accent-signal)'}`,
                          color: passMessage.type === 'success' ? '#10b981' : 'var(--accent-signal)',
                          padding: '0.75rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          marginBottom: '1.25rem',
                        }}
                      >
                        {passMessage.text}
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Current Password *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showCurrentPass ? 'text' : 'password'}
                            required
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            placeholder="Enter current password"
                            className="admin-input"
                            style={{ paddingRight: '2.5rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          New Password * (Min 8 characters)
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            required
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            placeholder="Enter new strong password"
                            className="admin-input"
                            style={{ paddingRight: '2.5rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Confirm New Password *
                        </label>
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          required
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Re-type new password"
                          className="admin-input"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={passLoading}
                        className="admin-btn-primary"
                        style={{ marginTop: '0.5rem' }}
                      >
                        {passLoading ? <RefreshCw className="animate-spin" size={15} /> : <Lock size={15} />}
                        <span>Update Password</span>
                      </button>
                    </form>
                  </div>

                  {/* Card 2: Update Email / Username */}
                  <div className="admin-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.75rem' }}>
                      <UserCheck size={18} color="#06b6d4" />
                      <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Update Admin Profile</h2>
                    </div>

                    {profileMessage && (
                      <div
                        style={{
                          background: profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'var(--accent-tint)',
                          border: `1px solid ${profileMessage.type === 'success' ? '#10b981' : 'var(--accent-signal)'}`,
                          color: profileMessage.type === 'success' ? '#10b981' : 'var(--accent-signal)',
                          padding: '0.75rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          marginBottom: '1.25rem',
                        }}
                      >
                        {profileMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleProfileChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Current Admin Email
                        </label>
                        <input
                          type="text"
                          disabled
                          value={session.user.email}
                          className="admin-input"
                          style={{ opacity: 0.7, background: 'var(--bg-subtle)' }}
                        />
                      </div>

                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          New Admin Email
                        </label>
                        <input
                          type="email"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          placeholder="e.g. newadmin@codewithtanim.me"
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Admin Display Name
                        </label>
                        <input
                          type="text"
                          value={newAdminName}
                          onChange={(e) => setNewAdminName(e.target.value)}
                          placeholder="MD SAMIUR RAHMAN TANIM"
                          className="admin-input"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="admin-btn-primary"
                        style={{ marginTop: '0.5rem' }}
                      >
                        {profileLoading ? <RefreshCw className="animate-spin" size={15} /> : <UserCheck size={15} />}
                        <span>Save Profile Changes</span>
                      </button>
                    </form>
                  </div>

                  {/* Card 3: Telegram Bot Alerts Setup */}
                  <div className="admin-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Send size={18} color="#0088cc" />
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Telegram Bot Alerts</h2>
                      </div>
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: telegramConfigured ? 'rgba(16, 185, 129, 0.12)' : 'var(--accent-tint)',
                          color: telegramConfigured ? '#10b981' : 'var(--accent-signal)',
                          border: `1px solid ${telegramConfigured ? '#10b981' : 'var(--accent-signal)'}`,
                        }}
                      >
                        {telegramConfigured ? '● ACTIVE & READY' : '○ NOT CONFIGURED'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 0, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                      Receive instant notifications on your Telegram app whenever someone submits a contact inquiry or applies for a course.
                    </p>

                    {telegramMessage && (
                      <div
                        style={{
                          background: telegramMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'var(--accent-tint)',
                          border: `1px solid ${telegramMessage.type === 'success' ? '#10b981' : 'var(--accent-signal)'}`,
                          color: telegramMessage.type === 'success' ? '#10b981' : 'var(--accent-signal)',
                          padding: '0.75rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          marginBottom: '1.25rem',
                        }}
                      >
                        {telegramMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleSaveTelegram} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Telegram Bot Token *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showTelegramToken ? 'text' : 'password'}
                            value={telegramToken}
                            onChange={(e) => setTelegramToken(e.target.value)}
                            placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                            className="admin-input"
                            style={{ paddingRight: '2.5rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowTelegramToken(!showTelegramToken)}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            {showTelegramToken ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mono" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Telegram Chat ID *
                        </label>
                        <input
                          type="text"
                          value={telegramChatId}
                          onChange={(e) => setTelegramChatId(e.target.value)}
                          placeholder="e.g. 987654321"
                          className="admin-input"
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        <button
                          type="submit"
                          disabled={telegramLoading}
                          className="admin-btn-primary"
                          style={{ flex: 1, minWidth: '150px' }}
                        >
                          {telegramLoading ? <RefreshCw className="animate-spin" size={15} /> : <Check size={15} />}
                          <span>Save Settings</span>
                        </button>

                        <button
                          type="button"
                          disabled={telegramTestLoading}
                          onClick={handleTestTelegram}
                          style={{
                            flex: 1,
                            minWidth: '150px',
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-subtle)',
                            color: 'var(--text-main)',
                            border: '1.5px solid var(--border-faint)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          {telegramTestLoading ? <RefreshCw className="animate-spin" size={15} /> : <Send size={15} color="#0088cc" />}
                          <span>Send Test Alert</span>
                        </button>
                      </div>
                    </form>

                    {/* Quick 2-Step Setup Helper */}
                    <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: '6px', border: '1px solid var(--border-faint)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      <div className="mono" style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        💡 Quick 2-Step Setup:
                      </div>
                      <div>1. Search <b>@BotFather</b> on Telegram, send <code>/newbot</code>, and copy the <b>HTTP API Token</b>.</div>
                      <div>2. Search <b>@userinfobot</b> on Telegram, press Start to copy your personal <b>Id</b> (Chat ID).</div>
                      <div>3. Paste both above, click <b>Save</b> & test with <b>Send Test Alert</b>!</div>
                    </div>
                  </div>
                </div>


              </div>
            )}

            {/* DETAIL DRAWER FOR SELECTED SUBMISSION */}
            {selectedSubmission && (() => {
              const isCourse = isCourseSubmission(selectedSubmission);
              const courseData = isCourse ? parseCourseDetails(selectedSubmission.message) : null;
              const isUnread = selectedSubmission.status === 'unread';

              return (
                <div
                  className="admin-detail-drawer admin-scroll"
                >
                  {/* Top Bar with Type, Status & Close */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-faint)', paddingBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: isCourse ? '#8b5cf618' : 'var(--accent-tint)',
                          color: isCourse ? '#8b5cf6' : 'var(--accent-signal)',
                          border: `1px solid ${isCourse ? '#8b5cf640' : 'var(--accent-signal)'}`,
                          fontWeight: 700,
                        }}
                      >
                        {isCourse ? '🎓 COURSE ENROLLMENT' : '📬 CONTACT INQUIRY'}
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.7rem',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          background: isUnread ? 'var(--accent-tint)' : 'var(--bg-subtle)',
                          color: isUnread ? 'var(--accent-signal)' : 'var(--text-muted)',
                          fontWeight: 700,
                        }}
                      >
                        {isUnread ? 'UNREAD' : 'READ'}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedSubmission(null)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Applicant Identity Card */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isCourse ? '#8b5cf6' : 'var(--accent-signal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {selectedSubmission.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedSubmission.name}</div>
                        <a
                          href={`mailto:${selectedSubmission.email}`}
                          style={{ fontSize: '0.85rem', color: isCourse ? '#8b5cf6' : 'var(--accent-signal)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                        >
                          <Mail size={13} />
                          <span>{selectedSubmission.email}</span>
                        </a>
                      </div>
                    </div>

                    {/* If Course Enrollment: Render Structured Application Fields */}
                    {isCourse && courseData && (
                      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-faint)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Application Details
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Target Course:</span>
                          <span style={{ fontWeight: 700 }}>{courseData.course}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Phone / Contact:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <a href={`tel:${courseData.phone}`} style={{ fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}>
                              {courseData.phone}
                            </a>
                            <button
                              onClick={() => copyToClipboard(courseData.phone, `phone-${selectedSubmission._id}`)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `phone-${selectedSubmission._id}` ? '#10b981' : 'var(--text-muted)' }}
                              title="Copy Phone"
                            >
                              {copiedId === `phone-${selectedSubmission._id}` ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>

                        {courseData.whatsapp !== 'N/A' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>WhatsApp:</span>
                            <a
                              href={`https://wa.me/${courseData.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontWeight: 600, color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <MessageCircle size={13} />
                              <span>{courseData.whatsapp}</span>
                            </a>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                          <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-signal)' }}>{courseData.payment}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Transaction ID:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="mono" style={{ fontWeight: 700, background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                              {courseData.txId}
                            </span>
                            <button
                              onClick={() => copyToClipboard(courseData.txId, `tx-${selectedSubmission._id}`)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `tx-${selectedSubmission._id}` ? '#10b981' : 'var(--text-muted)' }}
                              title="Copy Transaction ID"
                            >
                              {copiedId === `tx-${selectedSubmission._id}` ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>

                        {courseData.address !== 'N/A' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                            <span>{courseData.address}</span>
                          </div>
                        )}

                        {courseData.goal !== 'Not specified' && (
                          <div style={{ fontSize: '0.85rem', borderTop: '1px solid var(--border-faint)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Goal / Motivation:</span>
                            <span style={{ fontStyle: 'italic' }}>{courseData.goal}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submission Content / Raw Message */}
                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-faint)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                      <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
                        {isCourse ? 'Full Application Text' : 'Message Content'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {selectedSubmission.message}
                      </div>
                    </div>

                    {/* Client Metadata */}
                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-faint)', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Received:</span>
                        <span style={{ fontWeight: 600 }}>{formatDate(selectedSubmission.createdAt)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Client IP:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="mono">{selectedSubmission.ip}</span>
                          <button
                            onClick={() => copyToClipboard(selectedSubmission.ip, `ip-${selectedSubmission._id}`)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `ip-${selectedSubmission._id}` ? '#10b981' : 'var(--text-muted)' }}
                            title="Copy IP"
                          >
                            {copiedId === `ip-${selectedSubmission._id}` ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
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

                  {/* Drawer Footer Actions */}
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-faint)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      {/* Toggle Mark Read / Unread */}
                      <button
                        onClick={() => handleUpdateStatus(selectedSubmission._id, isUnread ? 'read' : 'unread')}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: isUnread ? 'var(--bg-subtle)' : 'var(--bg-primary)',
                          border: '1px solid var(--border-faint)',
                          color: 'var(--text-main)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          borderRadius: '6px',
                        }}
                      >
                        <Check size={15} style={{ color: isUnread ? 'var(--text-muted)' : '#10b981' }} />
                        <span>{isUnread ? 'Mark as Read' : 'Mark as Unread'}</span>
                      </button>

                      {/* Reply via Email */}
                      <a
                        href={`mailto:${selectedSubmission.email}?subject=${encodeURIComponent(isCourse ? 'Regarding Your Python Masterclass Application - CodeWithTanim' : 'Re: Inquiry on CodeWithTanim')}`}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'var(--text-main)',
                          color: 'var(--bg-panel)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
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
                        <span>Reply Email</span>
                      </a>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSubmission(selectedSubmission._id, selectedSubmission.name)}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        background: 'var(--accent-tint)',
                        color: 'var(--accent-signal)',
                        border: '1px solid var(--accent-signal)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Delete Submission</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </main>
      </div>

      {/* React Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--bg-panel)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.15s ease-out',
          }}
          onClick={() => {
            if (!confirmLoading) setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Header Icon + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: confirmModal.isDangerous ? 'rgba(239, 68, 68, 0.12)' : 'var(--accent-tint)',
                  color: confirmModal.isDangerous ? '#ef4444' : 'var(--accent-signal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {confirmModal.isDangerous ? <Trash2 size={22} /> : <AlertCircle size={22} />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {confirmModal.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                margin: 0,
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              {confirmModal.description}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              <button
                type="button"
                disabled={confirmLoading}
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: confirmLoading ? 'not-allowed' : 'pointer',
                  opacity: confirmLoading ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmLoading}
                onClick={() => confirmModal.onConfirm()}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: confirmModal.isDangerous ? '#ef4444' : 'var(--accent-signal)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: confirmLoading ? 'not-allowed' : 'pointer',
                  opacity: confirmLoading ? 0.6 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
              >
                {confirmLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {confirmModal.isDangerous && <Trash2 size={14} />}
                    <span>{confirmModal.confirmText}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
