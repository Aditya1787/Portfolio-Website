import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, CheckCircle2,
  XCircle, Ban, CheckCheck, Trash2, LogOut, Bell, Volume2, VolumeX,
  ShieldAlert, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Eye,
  LayoutGrid, List, Search, Sparkles, UserPlus, ArrowLeft
} from 'lucide-react';

export default function AdminDashboard({ currentUser, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Notification Toast & Audio
  const [notification, setNotification] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Assistant management modal (Owner only)
  const [showAssistantsModal, setShowAssistantsModal] = useState(false);
  const [assistantsList, setAssistantsList] = useState([]);
  const [newAssisEmail, setNewAssisEmail] = useState('');
  const [newAssisPass, setNewAssisPass] = useState('');
  const [assisError, setAssisError] = useState(null);
  const [assisSuccess, setAssisSuccess] = useState(null);

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const socketRef = useRef(null);

  // Audio chime synthesizer using Web Audio API
  const playNotificationSound = () => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.error('Audio playback error', e);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Error fetching appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    socketRef.current = io();

    socketRef.current.on('appointment:new', (newAppt) => {
      setAppointments(prev => [newAppt, ...prev.filter(a => a.id !== newAppt.id)]);
      setNotification({
        title: 'New Appointment Received',
        name: newAppt.name,
        date: newAppt.appointment_date,
        time: newAppt.start_time
      });
      playNotificationSound();
    });

    socketRef.current.on('appointment:updated', (updatedAppt) => {
      setAppointments(prev => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
    });

    socketRef.current.on('appointment:deleted', ({ id }) => {
      setAppointments(prev => prev.filter(a => a.id !== id));
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isMuted]);

  const updateStatus = async (id, actionEndpoint) => {
    try {
      const res = await fetch(`/api/appointments/${id}/${actionEndpoint}`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update appointment');
      } else {
        setAppointments(prev => prev.map(a => a.id === id ? data.appointment : a));
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment(data.appointment);
        }
      }
    } catch (err) {
      alert('Network error while updating appointment');
    }
    setConfirmDialog(null);
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to delete appointment');
      } else {
        setAppointments(prev => prev.filter(a => a.id !== id));
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment(null);
        }
      }
    } catch (err) {
      alert('Network error while deleting appointment');
    }
    setConfirmDialog(null);
  };

  const fetchAssistants = async () => {
    try {
      const res = await fetch('/api/assistants');
      const data = await res.json();
      if (res.ok) {
        setAssistantsList(data.assistants || []);
      }
    } catch (err) {
      console.error('Error fetching assistants', err);
    }
  };

  const createAssistant = async (e) => {
    e.preventDefault();
    setAssisError(null);
    setAssisSuccess(null);
    try {
      const res = await fetch('/api/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAssisEmail, password: newAssisPass })
      });
      const data = await res.json();
      if (!res.ok) {
        setAssisError(data.error || 'Failed to create assistant');
      } else {
        setAssisSuccess('Assistant account created successfully');
        setNewAssisEmail('');
        setNewAssisPass('');
        fetchAssistants();
      }
    } catch (err) {
      setAssisError('Network error');
    }
  };

  const removeAssistant = async (id) => {
    try {
      const res = await fetch(`/api/assistants/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to delete assistant');
      } else {
        fetchAssistants();
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    approved: appointments.filter(a => a.status === 'APPROVED').length,
    rejected: appointments.filter(a => a.status === 'REJECTED').length,
    today: appointments.filter(a => a.appointment_date === todayStr).length
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchesSearch = !searchTerm ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr: dayStr });
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <CalendarIcon size={20} style={{ color: 'var(--accent-primary)' }} />
            {monthNames[month]} {year}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentMonthDate(new Date(year, month - 1, 1))}
              className="btn" style={{ padding: '8px 12px', minWidth: 'auto', background: 'rgba(255,255,255,0.05)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentMonthDate(new Date())}
              className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonthDate(new Date(year, month + 1, 1))}
              className="btn" style={{ padding: '8px 12px', minWidth: 'auto', background: 'rgba(255,255,255,0.05)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {days.map((item, index) => {
            if (!item) return <div key={`empty-${index}`} style={{ height: '110px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }} />;

            const dayAppts = appointments.filter(a => a.appointment_date === item.dateStr);
            const isToday = item.dateStr === todayStr;

            return (
              <div
                key={item.dateStr}
                style={{
                  height: '110px',
                  padding: '8px',
                  borderRadius: '12px',
                  border: isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: isToday ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                  <span style={{ color: isToday ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{item.day}</span>
                  {dayAppts.length > 0 && (
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', background: 'var(--accent-primary)', color: '#fff' }}>
                      {dayAppts.length}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {dayAppts.slice(0, 2).map(app => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppointment(app)}
                      style={{
                        textAlign: 'left',
                        fontSize: '0.7rem',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        background: app.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' :
                                    app.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' :
                                    app.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: app.status === 'APPROVED' ? '#10b981' :
                               app.status === 'PENDING' ? '#f59e0b' :
                               app.status === 'REJECTED' ? '#ef4444' : '#3b82f6'
                      }}
                    >
                      {app.name} ({app.start_time})
                    </button>
                  ))}
                  {dayAppts.length > 2 && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '700' }}>
                      +{dayAppts.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      width: 'fit-content'
    };

    switch (status) {
      case 'PENDING':
        return <span style={{ ...baseStyle, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}><Clock size={14} /> Pending</span>;
      case 'APPROVED':
        return <span style={{ ...baseStyle, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}><CheckCircle2 size={14} /> Approved</span>;
      case 'REJECTED':
        return <span style={{ ...baseStyle, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}><XCircle size={14} /> Rejected</span>;
      case 'CANCELLED':
        return <span style={{ ...baseStyle, background: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: '1px solid rgba(100, 116, 139, 0.3)' }}><Ban size={14} /> Cancelled</span>;
      case 'COMPLETED':
        return <span style={{ ...baseStyle, background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}><CheckCheck size={14} /> Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '32px 20px', fontFamily: 'inherit' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 9999,
              maxWidth: '400px',
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--accent-primary)' }}>
              <Bell size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{notification.title}</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>{notification.name}</strong> booked for <strong>{notification.date}</strong> at <strong>{notification.time}</strong>.
              </p>
            </div>
            <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Appointment Control Center
              </h1>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                background: currentUser.role === 'OWNER' ? 'rgba(147, 51, 234, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                color: currentUser.role === 'OWNER' ? '#a855f7' : 'var(--accent-primary)',
                border: `1px solid ${currentUser.role === 'OWNER' ? 'rgba(147, 51, 234, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`
              }}>
                {currentUser.role === 'OWNER' ? <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                {currentUser.role}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="btn"
              style={{ padding: '10px 16px', fontSize: '0.85rem', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> Portfolio
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute Notifications" : "Mute Notifications"}
              className="btn" style={{ padding: '10px 14px', background: 'var(--bg-card)' }}
            >
              {isMuted ? <VolumeX size={18} style={{ color: '#ef4444' }} /> : <Volume2 size={18} style={{ color: 'var(--accent-primary)' }} />}
            </button>

            {currentUser.role === 'OWNER' && (
              <button
                onClick={() => { setShowAssistantsModal(true); fetchAssistants(); }}
                className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <UserPlus size={16} /> Manage Assistants
              </button>
            )}

            <button
              onClick={fetchAppointments}
              className="btn" style={{ padding: '10px 14px', background: 'var(--bg-card)' }}
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>

            <button
              onClick={onLogout}
              className="btn" style={{ padding: '10px 16px', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Received</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>{stats.total}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase' }}>Pending Review</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>{stats.pending}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>Approved</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>{stats.approved}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>Rejected</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444', marginTop: '4px' }}>{stats.rejected}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-primary)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Today's Schedule</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '4px' }}>{stats.today}</div>
          </div>
        </div>

        {/* Filter & View Switcher Bar */}
        <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: filterStatus === status ? 'var(--gradient-1)' : 'transparent',
                  color: filterStatus === status ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search & Layout Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', maxWidth: '400px', justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search visitor or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-primary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: viewMode === 'list' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <List size={14} /> List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: viewMode === 'calendar' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'calendar' ? 'var(--text-primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LayoutGrid size={14} /> Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Content View */}
        {viewMode === 'calendar' ? (
          renderCalendar()
        ) : (
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            {filteredAppointments.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FileText size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>No appointments found matching your criteria.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      <th style={{ padding: '16px 20px' }}>Visitor</th>
                      <th style={{ padding: '16px 20px' }}>Date & Time</th>
                      <th style={{ padding: '16px 20px' }}>Description</th>
                      <th style={{ padding: '16px 20px' }}>Status</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(appt => (
                      <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{appt.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{appt.email}</div>
                          {appt.phone && <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '2px' }}>{appt.phone}</div>}
                        </td>
                        <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{appt.appointment_date}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '2px' }}>{appt.start_time} - {appt.end_time}</div>
                        </td>
                        <td style={{ padding: '16px 20px', maxWidth: '300px' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {appt.description}
                          </p>
                        </td>
                        <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                          {getStatusBadge(appt.status)}
                          {appt.approved_by_email && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>By {appt.approved_by_email}</div>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedAppointment(appt)}
                              className="btn" style={{ padding: '6px 10px', background: 'var(--bg-card)' }}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>

                            {appt.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => setConfirmDialog({
                                    title: 'Approve Appointment',
                                    message: `Approve appointment for ${appt.name} on ${appt.appointment_date} at ${appt.start_time}? An automated confirmation email will be sent.`,
                                    action: () => updateStatus(appt.id, 'approve')
                                  })}
                                  className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => setConfirmDialog({
                                    title: 'Reject Appointment',
                                    message: `Reject appointment for ${appt.name}? An automated update email will be sent.`,
                                    action: () => updateStatus(appt.id, 'reject')
                                  })}
                                  className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {appt.status === 'APPROVED' && (
                              <>
                                <button
                                  onClick={() => setConfirmDialog({
                                    title: 'Cancel Appointment',
                                    message: `Cancel approved appointment for ${appt.name}? An automated cancellation email will be sent.`,
                                    action: () => updateStatus(appt.id, 'cancel')
                                  })}
                                  className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8' }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => setConfirmDialog({
                                    title: 'Mark Completed',
                                    message: `Mark appointment for ${appt.name} as completed?`,
                                    action: () => updateStatus(appt.id, 'complete')
                                  })}
                                  className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                                >
                                  Mark Completed
                                </button>
                              </>
                            )}

                            {currentUser.role === 'OWNER' && (
                              <button
                                onClick={() => setConfirmDialog({
                                  title: 'Delete Appointment',
                                  message: `Permanently delete appointment record for ${appt.name}?`,
                                  action: () => deleteAppointment(appt.id)
                                })}
                                className="btn" style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                title="Delete Record"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ maxWidth: '500px', width: '100%', padding: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{selectedAppointment.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{selectedAppointment.email}</p>
                </div>
                {getStatusBadge(selectedAppointment.status)}
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div>🗓️ Date: <strong style={{ color: 'var(--text-primary)' }}>{selectedAppointment.appointment_date}</strong></div>
                <div>⏰ Time: <strong style={{ color: 'var(--text-primary)' }}>{selectedAppointment.start_time} - {selectedAppointment.end_time}</strong></div>
                {selectedAppointment.phone && <div>📞 Phone: <strong style={{ color: 'var(--text-primary)' }}>{selectedAppointment.phone}</strong></div>}
                {selectedAppointment.approved_by_email && <div>👤 Approved by: <strong style={{ color: 'var(--text-primary)' }}>{selectedAppointment.approved_by_email}</strong></div>}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Description</label>
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedAppointment.description}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedAppointment(null)} className="btn" style={{ padding: '8px 20px', background: 'var(--bg-card)' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog Modal */}
      <AnimatePresence>
        {confirmDialog && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ maxWidth: '420px', width: '100%', padding: '24px' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{confirmDialog.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 20px 0' }}>{confirmDialog.message}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setConfirmDialog(null)} className="btn" style={{ padding: '8px 16px', background: 'var(--bg-card)' }}>
                  Cancel
                </button>
                <button onClick={confirmDialog.action} className="btn btn-primary" style={{ padding: '8px 20px' }}>
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Owner Assistants Modal */}
      <AnimatePresence>
        {showAssistantsModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ maxWidth: '520px', width: '100%', padding: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={18} style={{ color: '#a855f7' }} /> Manage Assistant Accounts
                </h3>
                <button onClick={() => setShowAssistantsModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>

              <form onSubmit={createAssistant} style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Add New Assistant</h4>
                
                {assisError && <div style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '8px' }}>{assisError}</div>}
                {assisSuccess && <div style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '8px' }}>{assisSuccess}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="email"
                    required
                    placeholder="assistant@gmail.com"
                    value={newAssisEmail}
                    onChange={e => setNewAssisEmail(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={newAssisPass}
                    onChange={e => setNewAssisPass(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#a855f7' }}>
                  Create Assistant Account
                </button>
              </form>

              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Existing Assistants</h4>
                {assistantsList.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No assistant accounts found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {assistantsList.map(a => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{a.email}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Created: {a.created_at}</div>
                        </div>
                        <button onClick={() => removeAssistant(a.id)} className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
