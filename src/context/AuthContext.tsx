import React, { createContext, useContext, useEffect, useState } from 'react';
import { Student, Admin, UserRole } from '../types';
import { store } from '../lib/store';

interface MockUser {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: MockUser | null;
  profile: Student | Admin | null;
  role: UserRole | null;
  loading: boolean;
  login: (id: string, password: string, isStudent: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<Student | Admin | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('nfsu_auth_user');
    const storedRole = localStorage.getItem('nfsu_auth_role') as UserRole | null;
    
    if (storedUser && storedRole) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(storedRole);
      
      if (storedRole === 'admin') {
        const admin = store.getAdmins().find(a => a.username === parsedUser.uid);
        if (admin) setProfile(admin);
      } else {
        const student = store.getStudents().find(s => s.student_id === parsedUser.uid);
        if (student) setProfile(student);
      }
    }
    setLoading(false);
  }, []);

  const login = async (id: string, password: string, isStudent: boolean) => {
    if (isStudent) {
      const student = store.getStudents().find(s => s.student_id === id && s.password === password);
      if (student) {
        const mockUser = { uid: student.student_id, email: `${id}@student.nfsu.edu` };
        setUser(mockUser);
        setProfile(student);
        setRole('student');
        localStorage.setItem('nfsu_auth_user', JSON.stringify(mockUser));
        localStorage.setItem('nfsu_auth_role', 'student');
      } else {
        throw new Error('Invalid student credentials');
      }
    } else {
      const admin = store.getAdmins().find(a => a.username === id && a.password === password);
      if (admin) {
        const mockUser = { uid: admin.username, email: `${id}@admin.nfsu.edu` };
        setUser(mockUser);
        setProfile(admin);
        setRole('admin');
        localStorage.setItem('nfsu_auth_user', JSON.stringify(mockUser));
        localStorage.setItem('nfsu_auth_role', 'admin');
      } else {
        throw new Error('Invalid admin credentials');
      }
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setRole(null);
    localStorage.removeItem('nfsu_auth_user');
    localStorage.removeItem('nfsu_auth_role');
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
