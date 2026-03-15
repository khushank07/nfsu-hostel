import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { profile, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">NFSU Hostel Leave System</h1>
            <p className="text-xs text-slate-400">National Forensic Sciences University</p>
          </div>

          {profile && (
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end text-sm">
                <span className="font-medium text-slate-200">{profile.name}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  {role === 'admin' ? 'Warden / Admin' : `Room: ${(profile as any).room_number}`}
                </span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-800 py-2 px-4 text-center text-[10px] text-slate-500 uppercase tracking-[0.2em]">
        Warden: Tushar Tyagi | System Developed By: Khushank
      </div>
    </header>
  );
};

export default Header;
