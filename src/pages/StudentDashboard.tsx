import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LeaveRequest, Notification } from '../types';
import { Plus, FileText, Download, Clock, CheckCircle, XCircle, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { generateLeavePass } from '../pdfUtils';
import { store } from '../lib/store';

const StudentDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Simulate loading
    const loadData = () => {
      const allRequests = store.getLeaveRequests();
      const studentRequests = allRequests.filter(r => r.student_id === user.uid);
      setRequests(studentRequests);

      const allNotifications = store.getNotifications();
      const studentNotifications = allNotifications.filter(n => n.user_id === user.uid);
      setNotifications(studentNotifications);
      
      setLoading(false);
    };

    loadData();
    
    // Optional: Poll for changes every 5 seconds since we don't have real-time listeners
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Rejected': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Student Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Student Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Name</p>
                  <p className="text-sm font-medium text-slate-900">{profile?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Student ID</p>
                  <p className="text-sm font-medium text-slate-900">{(profile as any)?.student_id}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Room / Block</p>
                  <p className="text-sm font-medium text-slate-900">{(profile as any)?.room_number} / {(profile as any)?.block}</p>
                </div>
              </div>
            </div>
            
            <Link 
              to="/apply-leave"
              className="mt-6 w-full flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md"
            >
              <Plus size={20} />
              <span>Apply for Leave</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
              <Bell size={18} className="text-slate-400" />
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No new notifications</p>
              ) : (
                notifications.map(note => (
                  <div key={note.id} className={`p-3 rounded-xl border ${note.read ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-sm text-slate-700">{note.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{format(new Date(note.created_at), 'PPp')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Leave History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Leave History</h3>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{requests.length} Requests</span>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                </div>
              ) : requests.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500">No leave requests found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type / Dates</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{req.leave_type}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {format(new Date(req.from_datetime), 'MMM d')} - {format(new Date(req.to_datetime), 'MMM d, yyyy')}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 line-clamp-1 max-w-[200px]">{req.reason}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                            {getStatusIcon(req.status)}
                            <span>{req.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {req.status === 'Approved' ? (
                            <button 
                              onClick={() => generateLeavePass(req)}
                              className="inline-flex items-center space-x-2 text-slate-900 hover:text-slate-700 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-all"
                            >
                              <Download size={14} />
                              <span>Download Pass</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Pass unavailable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
