'use client';

import React, { useState, useEffect } from 'react';
import { PROFILE } from '@/data/portfolioData';
import { Mail, Phone, MapPin, Send, Copy, Check, MessageCircle, Loader2 } from 'lucide-react';

const COOLDOWN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ALLOWED_SUBMISSIONS = 2; // 2 times max in 5 minutes
const STORAGE_KEY = 'cwt_contact_submissions_v2';
const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORM_ENDPOINT ||
  'https://form-farm-azure.vercel.app/f/b27015215386ab43';

export default function ContactForm() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    _gotcha: '', // Invisible honeypot field for spam bots
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'ratelimited'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 3000);
  };

  // Helper to get valid local submission timestamps within the 5-min window
  const getRecentSubmissions = (): number[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: number[] = JSON.parse(raw);
      const now = Date.now();
      return parsed.filter((ts) => now - ts < COOLDOWN_WINDOW_MS);
    } catch {
      return [];
    }
  };

  // Countdown effect when rate-limited
  useEffect(() => {
    if (retryCountdown === null || retryCountdown <= 0) return;

    const interval = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setSubmitStatus('idle');
          setStatusMessage(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryCountdown]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Client-Side Pre-Check (Max 2 submissions per 5 minutes)
    const now = Date.now();
    const recentSubmissions = getRecentSubmissions();

    if (recentSubmissions.length >= MAX_ALLOWED_SUBMISSIONS) {
      const oldest = recentSubmissions[0];
      const remainingSec = Math.max(1, Math.ceil((oldest + COOLDOWN_WINDOW_MS - now) / 1000));
      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      const waitStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

      setSubmitStatus('ratelimited');
      setStatusMessage(`Rate Limit: Maximum 2 messages every 5 minutes allowed. Please wait ${waitStr} before submitting again.`);
      setRetryCountdown(remainingSec);
      return;
    }

    // 2. Dispatch to form endpoint
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage(null);

    // Honeypot check (Antispam bot trap)
    if (formData._gotcha) {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setStatusMessage('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', message: '', _gotcha: '' });
      return;
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        // Success: Record submission locally and reset form
        recentSubmissions.push(now);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSubmissions));

        setSubmitStatus('success');
        setStatusMessage('Thank you! Your message has been sent successfully. I will get back to you shortly.');
        setFormData({ name: '', email: '', message: '', _gotcha: '' });
      } else {
        setSubmitStatus('error');
        setStatusMessage('Unable to deliver message right now. Please reach out to codewithtanim@gmail.com.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitStatus('error');
      setStatusMessage('Network connection error. Please email codewithtanim@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'discord':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="contact" className="section-block">
      <div className="section-grid">
        <div className="section-index-badge">
          <span className="number">07</span>
          <span className="label">Contact</span>
        </div>

        <div>
          <h2 className="section-heading-title">Contact & Collaboration</h2>

          <div className="contact-grid">
            {/* Contact Details Card */}
            <div className="contact-info-card">
              <div className="contact-item-row">
                <span className="icon-wrapper"><Mail size={20} /></span>
                <div style={{ flex: 1 }}>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</div>
                  <a href={`mailto:${PROFILE.email}`} style={{ fontWeight: 600, wordBreak: 'break-all' }}>
                    {PROFILE.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(PROFILE.email, 'Email copied')}
                  title="Copy email"
                  style={{ color: 'var(--text-muted)', padding: '4px' }}
                >
                  {copiedText === 'Email copied' ? <Check size={16} color="var(--accent-signal)" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="contact-item-row">
                <span className="icon-wrapper"><Phone size={20} /></span>
                <div style={{ flex: 1 }}>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Numbers</div>
                  <div style={{ fontWeight: 500, lineHeight: 1.5 }}>
                    {PROFILE.phones.map((p, i) => (
                      <div key={i}>
                        <span className="mono" style={{ color: 'var(--accent-signal)', fontWeight: 700 }}>{p.label}: </span>
                        <span>{p.number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="contact-item-row">
                <span className="icon-wrapper" style={{ color: '#25D366' }}>
                  <MessageCircle size={20} />
                </span>
                <div style={{ flex: 1 }}>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>WhatsApp Direct</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <a
                      href={PROFILE.whatsappUrl || "https://wa.me/8801326157012"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}
                    >
                      {PROFILE.whatsapp}
                    </a>
                    <a
                      href={PROFILE.whatsappUrl || "https://wa.me/8801326157012"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono"
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        background: 'rgba(37, 211, 102, 0.12)',
                        color: '#25D366',
                        border: '1px solid #25D366',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      Chat on WhatsApp &rarr;
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(PROFILE.whatsapp, 'WhatsApp copied')}
                  title="Copy WhatsApp"
                  style={{ color: 'var(--text-muted)', padding: '4px' }}
                >
                  {copiedText === 'WhatsApp copied' ? <Check size={16} color="var(--accent-signal)" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="contact-item-row">
                <span className="icon-wrapper"><MapPin size={20} /></span>
                <div>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</div>
                  <div style={{ fontWeight: 500 }}>{PROFILE.locations}</div>
                </div>
              </div>

              <div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Connect Online
                </div>
                <div className="contact-social-row">
                  {PROFILE.socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-button social-btn-${s.icon}`}
                      title={s.name}
                      aria-label={s.name}
                    >
                      {renderSocialIcon(s.icon)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Form Card */}
            <div className="contact-form-card">
              <form onSubmit={handleFormSubmit} noValidate>
                {/* Honeypot field (hidden from real users, traps automated bots) */}
                <div
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                  }}
                  aria-hidden="true"
                >
                  <label htmlFor="_gotcha">Do not fill this field</label>
                  <input
                    type="text"
                    id="_gotcha"
                    name="_gotcha"
                    value={formData._gotcha}
                    onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. John Doe"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="e.g. john@example.com"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Project / Inquiry Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                    placeholder="Describe your project, role, or collaboration idea..."
                    disabled={isSubmitting}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'ratelimited'}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    opacity: (isSubmitting || submitStatus === 'ratelimited') ? 0.7 : 1,
                    cursor: (isSubmitting || submitStatus === 'ratelimited') ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Dynamic Status & Feedback Banners */}
                {submitStatus === 'success' && statusMessage && (
                  <div className="form-success-banner mono">
                    {statusMessage}
                  </div>
                )}

                {submitStatus === 'ratelimited' && statusMessage && (
                  <div className="rate-limit-warning mono">
                    {statusMessage}
                  </div>
                )}

                {submitStatus === 'error' && statusMessage && (
                  <div className="form-error-banner mono">
                    {statusMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {copiedText && (
        <div className="toast-notice">
          {copiedText} to clipboard!
        </div>
      )}
    </section>
  );
}
