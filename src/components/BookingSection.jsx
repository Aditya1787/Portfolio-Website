import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, AlertCircle, Sparkles, Send, Ban } from 'lucide-react';

export default function BookingSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointment_date: '',
    start_time: '10:00',
    description: ''
  });

  const [busySlots, setBusySlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Available standard time slots options (09:00 to 17:00 in 30-min steps)
  const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Minimum date = today's YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch busy slots whenever selected appointment date changes
  useEffect(() => {
    if (!formData.appointment_date) {
      setBusySlots([]);
      return;
    }

    fetch(`/api/appointments/busy-slots?date=${formData.appointment_date}`)
      .then(res => res.json())
      .then(data => {
        setBusySlots(data.busySlots || []);
      })
      .catch(err => console.error('Error fetching busy slots', err));
  }, [formData.appointment_date]);

  const isSlotBusy = (slotTime) => {
    return busySlots.some(b => {
      // Slot overlaps if slotTime >= b.start_time AND slotTime < b.end_time
      return slotTime >= b.start_time && slotTime < b.end_time;
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSlotBusy(formData.start_time)) {
      setStatusMessage({
        type: 'error',
        text: 'This appointment slot is already booked and accepted by someone else. Please choose another time.'
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit appointment request.' });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Your appointment request has been submitted successfully! It is currently pending review by our assistant.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          appointment_date: '',
          start_time: '10:00',
          description: ''
        });
        // Refresh busy slots
        if (formData.appointment_date) {
          fetch(`/api/appointments/busy-slots?date=${formData.appointment_date}`)
            .then(res => res.json())
            .then(d => setBusySlots(d.busySlots || []));
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error. Please make sure the backend server is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="appointment" className="section" style={{ padding: '80px 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <div className="section-badge"><Sparkles size={16} /> Direct Consultation</div>
          <h2 className="section-title">Book an Appointment</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            Schedule a session for project inquiry, technical collaboration, or consultation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card"
          style={{ maxWidth: '850px', margin: '0 auto', padding: '40px' }}
        >
          <AnimatePresence mode="wait">
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  fontSize: '0.9rem',
                  background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
                  border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}
              >
                {statusMessage.type === 'success' ? <CheckCircle size={20} style={{ shrink: 0, marginTop: '2px' }} /> : <AlertCircle size={20} style={{ shrink: 0, marginTop: '2px' }} />}
                <div>{statusMessage.text}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <User size={14} style={{ color: 'var(--accent-primary)' }} /> Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
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

              {/* Email */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Mail size={14} style={{ color: 'var(--accent-primary)' }} /> Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {/* Phone */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Phone size={14} style={{ color: 'var(--accent-primary)' }} /> Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
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

              {/* Date */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Calendar size={14} style={{ color: 'var(--accent-primary)' }} /> Appointment Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  required
                  min={todayStr}
                  value={formData.appointment_date}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
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

              {/* Preferred Time */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Clock size={14} style={{ color: 'var(--accent-primary)' }} /> Preferred Time <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="start_time"
                  required
                  value={formData.start_time}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {TIME_SLOTS.map(slot => {
                    const occupied = isSlotBusy(slot);
                    return (
                      <option key={slot} value={slot} disabled={occupied} style={{ background: 'var(--bg-card)', color: occupied ? '#ef4444' : 'var(--text-primary)' }}>
                        {slot} {occupied ? '(Booked - Unavailable)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <FileText size={14} style={{ color: 'var(--accent-primary)' }} /> Description / Topic <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Please describe the purpose of the meeting..."
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              ></textarea>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', marginTop: '10px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Submitting Request...' : 'Submit Appointment Request'} <Send size={16} />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
