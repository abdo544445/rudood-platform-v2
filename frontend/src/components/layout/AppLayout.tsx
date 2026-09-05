import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      <Sidebar />
      <Header />
      <main className="mr-64 p-8 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
