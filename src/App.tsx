import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyLeave from './pages/ApplyLeave';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'student' | 'admin' }> = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to={role === 'admin' ? '/admin' : '/student'} />;

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {user && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={user ? <Navigate to={role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
          
          <Route path="/student" element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/apply-leave" element={
            <ProtectedRoute allowedRole="student">
              <ApplyLeave />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 text-center">
        <p className="text-xs text-slate-400">
          &copy; 2026 NFSU Hostel Management. Developed by Khushank.
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
