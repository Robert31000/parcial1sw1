import { Outlet } from 'react-router-dom';
import React from 'react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-800 bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Generador de Interfaces</h1>
      </header>

      {/* Contenedor principal */}
      <main className="flex-1 p-4 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
