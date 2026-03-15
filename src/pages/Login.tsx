import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Lock, Loader2, Check } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [isStudent, setIsStudent] = useState(true);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudent && !agreed) {
      setError('You must agree to the hostel rules before logging in.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await login(id, password, isStudent);
    } catch (err: any) {
      console.error("Login error:", err.message);
      setError('Invalid credentials. Use warden/nfsu123 or NFSU101_1/pass123.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Hostel Leave System</h2>
          <p className="mt-2 text-sm text-slate-500">NFSU National Forensic Sciences University</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
          <button
            onClick={() => { setIsStudent(true); setAgreed(false); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              isStudent ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Student Login
          </button>
          <button
            onClick={() => setIsStudent(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              !isStudent ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin Login
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {isStudent ? 'Student ID' : 'Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all sm:text-sm"
                  placeholder={isStudent ? 'e.g. NFSU101_1' : 'e.g. warden'}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {isStudent && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2">NFSU Hostel Leave Rules & Regulations</h4>
                <div className="h-32 overflow-y-auto pr-2 text-[11px] text-slate-600 space-y-2 custom-scrollbar">
                  <p>1. All late night or long leave requests must be submitted through this portal and require approval by the hostel warden.</p>
                  <p>2. Late Night Leave must be applied before 8:00 PM on the same day.</p>
                  <p>3. Long Leave must be applied at least 24 hours before leaving the hostel.</p>
                  <p>4. Students must provide accurate reason and contact information while applying for leave.</p>
                  <p>5. Students must return to the hostel before the approved return time.</p>
                  <p>6. Students must show the approved leave pass (PDF) at the hostel gate when leaving or returning.</p>
                  <p>7. Fake leave requests or leaving hostel without approval may lead to disciplinary action.</p>
                  <p>8. Students are responsible for their conduct and safety during approved leave.</p>
                  <p>9. The hostel warden has full authority to approve, reject, or cancel leave requests.</p>
                  <p>10. All leave records are digitally stored in the NFSU hostel leave system.</p>
                  <div className="pt-2 border-t border-slate-200 font-bold text-slate-400 mt-2">
                    Hostel Administration – National Forensic Sciences University
                  </div>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:bg-slate-900 checked:border-slate-900 transition-all"
                  />
                  <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" />
                </div>
                <span className="text-xs text-slate-600 font-medium select-none group-hover:text-slate-900 transition-colors">
                  I have read and agree to the NFSU Hostel Rules & Regulations.
                </span>
              </label>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (isStudent && !agreed)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Demo Credentials:<br/>
            Admin: warden / nfsu123<br/>
            Student: NFSU101_1 / pass123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
