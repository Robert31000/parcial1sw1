import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  return (
    <aside className="w-64 bg-gray-900 shadow h-screen p-6">
      <h2 className="text-xl font-bold text-green-800 mb-6">Menú</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/projects" className="text-blue-600 font-semibold hover:underline">Proyectos</Link>
        <Link to="/dashboard/newproject" className="text-blue-600 font-semibold hover:underline">Nuevo Proyecto</Link>
        <Link to="/tools/upload" className="text-blue-600 font-semibold hover:underline">Mockup desde Imagen</Link>
        <button onClick={logout} className="mt-6 text-red-500 font-semibold hover:underline">Cerrar Sesión</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
