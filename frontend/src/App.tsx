import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { socketService } from './services/socketService';

// Public Marketing Pages
import { HomePage } from './pages/public/HomePage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { PricingPage } from './pages/public/PricingPage';
import { DemoPage } from './pages/public/DemoPage';
import { BlogPage } from './pages/public/BlogPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Layout & Route Guards
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Authenticated Application Modules
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { LiveChatPage } from './pages/chat/LiveChatPage';
import { PlaygroundPage } from './pages/playground/PlaygroundPage';
import { KnowledgeBasePage } from './pages/knowledge/KnowledgeBasePage';
import { BotSettingsPage } from './pages/settings/BotSettingsPage';
import { ChannelsPage } from './pages/channels/ChannelsPage';
import { AdminPage } from './pages/admin/AdminPage';

export const App: React.FC = () => {
  useEffect(() => {
    socketService.init();
  }, []);

  return (
    <BrowserRouter>
      {/* Luxury Dark Toaster Provider */}
      <Toaster 
        position="top-left" 
        richColors 
        theme="dark" 
        dir="rtl" 
        toastOptions={{
          style: {
            backgroundColor: '#0f172a',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: '#f8fafc',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '12px',
          },
        }}
      />

      <Routes>
        {/* ── Public Website Routes ────────────────────────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* ── Authentication Routes ────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Protected Merchant & Admin Application Routes ────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/live-chat" element={<LiveChatPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/bot-settings" element={<BotSettingsPage />} />
            <Route path="/channels" element={<ChannelsPage />} />

            {/* Super Admin Protected Route */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
        </Route>

        {/* ── Legacy Route Aliases & Redirects ─────────────────────────────── */}
        <Route path="/ai-manage" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/settings" element={<Navigate to="/bot-settings" replace />} />
        <Route path="/try" element={<Navigate to="/contact" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/chat" element={<Navigate to="/live-chat" replace />} />
        <Route path="/ai" element={<Navigate to="/playground" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
