import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-green-600">Bienvenido a tu Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cards de proyectos */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Proyecto Demo</h2>
            <p className="text-sm text-red-700">Última edición: hoy</p>
          </div>
          {/* Aquí puedes mapear tus proyectos */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
