import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LeaveRequest, Notification } from '../types';
import { Check, X, Search, Download, Loader2, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { store } from '../lib/store';

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  const loadData = () => {
    const reqs = store.getLeaveRequests();
    setRequests(reqs);
    
    const s = { pending: 0, approved: 0, rejected: 0 };
    reqs.forEach(r => {
      if (r.status === 'Pending') s.pending++;
      else if (r.status === 'Approved') s.approved++;
      else if (r.status === 'Rejected') s.rejected++;
    });
    setStats(s);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Optional: Poll for changes every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (requestId: string, studentId: string, status: 'Approved' | 'Rejected') => {
    try {
      store.updateLeaveRequest(requestId, {
        status,
        approved_by: profile?.name,
        approved_at: new Date().toISOString()
      });

      // Notify Student
      store.addNotification({
        user_id: studentId,
        message: `Your leave request has been ${status}`,
        type: 'status_update',
        read: false,
        created_at: new Date().toISOString()
      });

      loadData();
      alert(`Request ${status} successfully!`);
    } catch (err) {
      console.error(err);
      alert('Action failed. Please try again.');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'All' || req.status === filter;
    const matchesSearch = req.student_id.toLowerCase().includes(search.toLowerCase()) || 
                         req.student_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student ID,Name,Type,Reason,From,To,Status\n"
      + requests.map(r => `${r.student_id},${r.student_name},${r.leave_type},${r.reason},${r.from_datetime},${r.to_datetime},${r.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NFSU_Leave_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending</p>
            <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Check size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved</p>
            <p className="text-2xl font-black text-slate-900">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <X size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rejected</p>
            <p className="text-2xl font-black text-slate-900">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <h3 className="text-xl font-bold text-slate-900">All Leave Requests</h3>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search ID or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
              />
            </div>
            
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button 
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-slate-900" size={32} />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No requests found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{req.student_name}</p>
                      <p className="text-xs text-slate-500">{req.student_id} • Room {req.room_number}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-700">{req.leave_type}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {format(new Date(req.from_datetime), 'MMM d, p')} - 
                        {format(new Date(req.to_datetime), 'MMM d, p')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-[150px]">{req.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === 'Approved' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                        req.status === 'Rejected' ? 'text-rose-600 bg-rose-50 border-rose-100' :
                        'text-amber-600 bg-amber-50 border-amber-100'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleAction(req.id, req.student_id, 'Approved')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, req.student_id, 'Rejected')}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          Handled by {req.approved_by}
                        </span>
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
  );
};

export default AdminDashboard;
