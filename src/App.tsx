import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';
import DashboardPage from './pages/DashboardPage';
import HeatsListPage from './pages/HeatsListPage';
import HeatDetailPage from './pages/HeatDetailPage';
import HeatDetailsPage from './pages/HeatDetailsPage';
import AllEAFHeatsPage from './pages/AllEAFHeatsPage';
import AllLFHeatsPage from './pages/AllLFHeatsPage';
import AllCCMHeatsPage from './pages/AllCCMHeatsPage';
import EAFPage from './pages/EAFPage';
import LFPage from './pages/LFPage';
import CCMPage from './pages/CCMPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import AuditLogPage from './pages/AuditLogPage';
import BackupPage from './pages/BackupPage';
import ProfilePage from './pages/ProfilePage';
import SendMessagePage from './pages/SendMessagePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/heats" element={<ProtectedRoute><HeatsListPage /></ProtectedRoute>} />
      <Route path="/heats/:id" element={<ProtectedRoute><HeatDetailPage /></ProtectedRoute>} />
      <Route path="/heat-details" element={<ProtectedRoute><HeatDetailsPage /></ProtectedRoute>} />
      <Route path="/send-message" element={<ProtectedRoute><SendMessagePage /></ProtectedRoute>} />
      <Route path="/all-eaf-heats" element={<ProtectedRoute><AllEAFHeatsPage /></ProtectedRoute>} />
      <Route path="/all-lf-heats" element={<ProtectedRoute><AllLFHeatsPage /></ProtectedRoute>} />
      <Route path="/all-ccm-heats" element={<ProtectedRoute><AllCCMHeatsPage /></ProtectedRoute>} />
      <Route path="/eaf" element={<ProtectedRoute><EAFPage /></ProtectedRoute>} />
      <Route path="/lf" element={<ProtectedRoute><LFPage /></ProtectedRoute>} />
      <Route path="/ccm" element={<ProtectedRoute><CCMPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute><AuditLogPage /></ProtectedRoute>} />
      <Route path="/backup" element={<ProtectedRoute><BackupPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
