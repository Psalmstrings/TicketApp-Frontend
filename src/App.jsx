import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';

// Auth
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Main pages
import HomePage from './pages/home/HomePage.jsx';
import ExplorePage from './pages/explore/ExplorePage.jsx';
import EventDetailPage from './pages/events/EventDetailPage.jsx';
import CreateEventPage from './pages/events/CreateEventPage.jsx';
import MyEventsPage from './pages/events/MyEventsPage.jsx';
import MyTicketsPage from './pages/tickets/MyTicketsPage.jsx';
import TicketDetailPage from './pages/tickets/TicketDetailPage.jsx';
import TransfersPage from './pages/transfers/TransfersPage.jsx';
import ResalePage from './pages/resale/ResalePage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import NotificationsPage from './pages/notifications/NotificationsPage.jsx';
import QRScannerPage from './pages/scan/QRScannerPage.jsx';

// Admin
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminStatsPage from './pages/admin/AdminStatsPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminEventsPage from './pages/admin/AdminEventsPage.jsx';
import AdminTicketsPage from './pages/admin/AdminTicketsPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminLogsPage from './pages/admin/AdminLogsPage.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
          <div style={{
            maxWidth: '430px',
            margin: '0 auto',
            minHeight: '100vh',
            background: '#0f0f1a',
            position: 'relative',
            overflowX: 'hidden',
          }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Protected routes */}
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute requireApproved><CreateEventPage /></ProtectedRoute>} />
            <Route path="/my-events" element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
            <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
            <Route path="/transfers" element={<ProtectedRoute><TransfersPage /></ProtectedRoute>} />
            <Route path="/resale" element={<ProtectedRoute><ResalePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/scan" element={<ProtectedRoute><QRScannerPage /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminStatsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="logs" element={<AdminLogsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
