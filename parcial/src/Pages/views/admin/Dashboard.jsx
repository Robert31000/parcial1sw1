import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b  to-blue-900 text-white flex flex-col p-3 shadow-lg">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Bienvenido a tu Panel</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Proyecto */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Proyecto Demo</h2>
            <p className="text-gray-500 text-sm">Última edición: hoy</p>
          </div>

          {/* Puedes mapear más proyectos aquí después */}
        </div>

        {/* Área para subrutas */}
        <div className="mt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
