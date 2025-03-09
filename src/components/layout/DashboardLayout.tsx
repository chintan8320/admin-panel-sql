
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-bank-background">
      <Sidebar />
      <main className="flex-1">
        <Topbar />
        <div className="pb-12 px-8 pt-[31px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
