import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AmbientCanvas } from '../common/AmbientCanvas';
import { useAuthStore } from '../../store/useAuthStore';
import { socketService } from '../../services/socketService';

export const AppLayout: React.FC = () => {
  const { workspace } = useAuthStore();

  useEffect(() => {
    if (workspace?.id) {
      socketService.joinWorkspace(workspace.id);
    }
  }, [workspace?.id]);

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 flex flex-col font-['Cairo',sans-serif] relative overflow-hidden">
      {/* Background Ambient Mesh */}
      <AmbientCanvas />

      <Sidebar />
      <Header />
      <main className="mr-64 p-8 flex-1 overflow-x-hidden relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

