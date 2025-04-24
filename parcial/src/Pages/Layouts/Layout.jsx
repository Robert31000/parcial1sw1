import { Outlet } from 'react-router-dom';
import React from 'react';


const Layout = () => {
  return (
    <div className="min-h-screen  text-gray-800 bg-green-500">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Generador de Interfaces</h1>
      </header>
      <main className="p-4 ">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;