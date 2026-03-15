import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, Calendar, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { store } from '../lib/store';
import { LeaveRequest, Notification } from '../types';

const ApplyLeave: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    leave_type: 'Late Night Leave',
    reason: '',
    from_datetime: '',
    to_datetime: '',
    contact_number: profile?.phone_number || '',
    parent_contact_number: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      const studentProfile = profile as any;
      
      // 1. Create Leave Request
      store.addLeaveRequest({
        student_id: user.uid,
        student_name: profile.name,
        room_number: studentProfile.room_number,
        block: studentProfile.block,
        leave_type: formData.leave_type as any,
        reason: formData.reason,
        from_datetime: formData.from_datetime,
        to_datetime: formData.to_datetime,
        contact_number: formData.contact_number,
        parent_contact_number: formData.parent_contact_number,
        status: 'Pending',
        created_at: new Date().toISOString(),
      });

      // 2. Create Notification for Admin
      store.addNotification({
        user_id: 'admin_broadcast', // Admins will listen for this or specific admin IDs
        message: `New Leave Request Submitted by ${profile.name}`,
        type: 'new_request',
        read: false,
        created_at: new Date().toISOString(),
      });

      alert('Leave application submitted successfully!');
      navigate('/student');
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/student')}
        className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white">
          <h2 className="text-2xl font-bold">Apply for Leave</h2>
          <p className="text-slate-400 text-sm mt-1">Fill in the details below to submit your request.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Auto-filled Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Name</p>
              <p className="text-sm font-semibold text-slate-700">{profile?.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID</p>
              <p className="text-sm font-semibold text-slate-700">{(profile as any)?.student_id}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room / Block</p>
              <p className="text-sm font-semibold text-slate-700">{(profile as any)?.room_number} / {(profile as any)?.block}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Leave Type</label>
              <select 
                required
                value={formData.leave_type}
                onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
              >
                <option value="Late Night Leave">Late Night Leave</option>
                <option value="Long Leave">Long Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Leaving Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="datetime-local"
                    required
                    value={formData.from_datetime}
                    onChange={(e) => setFormData({...formData, from_datetime: e.target.value})}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Return Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="datetime-local"
                    required
                    value={formData.to_datetime}
                    onChange={(e) => setFormData({...formData, to_datetime: e.target.value})}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Leave</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <textarea 
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                  placeholder="Explain why you need leave..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="tel"
                    required
                    value={formData.contact_number}
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Parent Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="tel"
                    required
                    value={formData.parent_contact_number}
                    onChange={(e) => setFormData({...formData, parent_contact_number: e.target.value})}
                    className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                    placeholder="Parent's phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <Send size={20} />
                <span>Submit Leave Application</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
