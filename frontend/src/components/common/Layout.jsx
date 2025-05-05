// components/layout/Layout.jsx
import React from 'react';
import GlobalSidebar from '../common/GlobalSidebar';
import GlobalHeader from '../common/GlobalHeader';

const Layout = ({ children, title = 'Tableau de Bord', userRole = 'professor' }) => {
  return (
    <div className="layout-with-sidebar flex h-screen">
      <GlobalSidebar userRole={userRole} />
      <div className="flex-1 overflow-y-auto">
        <GlobalHeader title={title} />
        <main className="w-full h-full">{children}</main>
      </div>
    </div>
  );
};

export default Layout;