'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Send, Terminal, Shield, Award, Sparkles, BookOpen } from 'lucide-react';

export default function PythonCoursePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'bKash',
    transactionId: '',
    whyJoin: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const messagePayload = `
[COURSE ENROLLMENT - Python A-Z]
Phone: ${formData.phone}
Address: ${formData.address || 'N/A'}
Payment Method: ${formData.paymentMethod}
Transaction ID: ${formData.transactionId || 'Pending'}
Goal / Reason: ${formData.whyJoin || 'Not specified'}
    `.trim();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: messagePayload,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to submit enrollment. Please try again or message via WhatsApp.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/"
          className="mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-main)',
            border: '2px solid var(--border-strong)',
            padding: '8px 16px',
            background: 'var(--bg-panel)',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Side: Course Overview */}
        <div>
          <span
            className="mono"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--accent-signal)',
              background: 'var(--accent-tint)',
              padding: '4px 10px',
              border: '1px solid var(--accent-signal)',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            Masterclass Enrollment
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            Python A–Z Comprehensive Course
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Zero-to-hero Python masterclass covering computer science fundamentals, object-oriented programming, data structures, automation scripts, and real-world project development under direct mentorship.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Terminal size={20} color="var(--accent-signal)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>100% Practical & Project-Based</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>Build 10+ real-world projects from scraping bots to encryption tools and GUI apps.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={20} color="var(--accent-signal)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>Cybersecurity & Scripting</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>Learn Python for ethical hacking, password hashing, socket networking, and Linux automation.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={20} color="var(--accent-signal)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>Certificate & Code Review</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>Verified course completion certificate and line-by-line GitHub pull request code reviews.</p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              background: 'var(--bg-panel)',
              border: '2px solid var(--border-strong)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h4 className="mono" style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Payment Methods Accepted
            </h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontWeight: 700, fontSize: '0.9rem' }}>
              <span>• bKash (Personal/Merchant)</span>
              <span>• Nagad</span>
              <span>• Rocket</span>
              <span>• Bank Wire / Transfer</span>
            </div>
          </div>
        </div>

        {/* Right Side: Enrollment Form Card */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '2px solid var(--border-strong)',
            padding: '2.25rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Enrollment Application Received!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Thank you for applying for the Python A-Z Masterclass. We have dispatched your application to the admissions portal and our team will contact you via WhatsApp/Email with your batch credentials.
              </p>
              <Link
                href="/"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'var(--text-main)',
                  color: 'var(--bg-panel)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                Return to Portfolio &rarr;
              </Link>
            </div>
          ) : (
            <>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Enrollment Form
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Fill out the application below to reserve your seat in the upcoming batch.
              </p>

              {errorMsg && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '2px solid var(--border-strong)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-main)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid var(--border-strong)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+8801..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid var(--border-strong)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['bKash', 'Nagad', 'Rocket', 'Bank'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method })}
                        style={{
                          padding: '8px 14px',
                          border: '2px solid var(--border-strong)',
                          background: formData.paymentMethod === method ? 'var(--accent-signal)' : 'var(--bg-subtle)',
                          color: formData.paymentMethod === method ? '#fff' : 'var(--text-main)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Transaction ID / Reference
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="Enter TrxID after sending fee"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '2px solid var(--border-strong)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-main)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Why do you want to learn Python?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.whyJoin}
                    onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                    placeholder="Tell us about your learning goals or background..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '2px solid var(--border-strong)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-main)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '14px',
                    border: '2px solid var(--border-strong)',
                    background: 'var(--accent-signal)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Enrollment'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
