import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, AlertCircle, ShieldCheck, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
      } else {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        } else {
          window.location.pathname = '/admin/dashboard';
        }
      }
    } catch (err) {
      setError('Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (accEmail, accPass) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '20px', fontFamily: 'inherit', position: 'relative' }}>
      <button
        onClick={() => { window.location.href = '/'; }}
        className="btn"
        style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.85rem', background: 'var(--bg-card)', zIndex: 10 }}
      >
        <ArrowLeft size={16} /> Back to Portfolio
      </button>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ maxWidth: '440px', width: '100%', padding: '40px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            color: 'var(--accent-primary)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={36} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Control Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            Secure login for Owner & Authorized Assistants
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px'
              }}
            >
              <AlertCircle size={18} style={{ shrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Mail size={14} style={{ color: 'var(--accent-primary)' }} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Lock size={14} style={{ color: 'var(--accent-primary)' }} /> Access Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
