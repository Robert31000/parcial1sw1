import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JoinProject from '../../../components/JoinProject';
import SchemaEditor from '../../../components/SchemaEditor';

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  return (
    <aside className="w-64 bg-orange-500 shadow h-full p-6">
      <h2 className="text-xl font-bold text-green-800 mb-6">Menú</h2>
      <nav className="flex flex-col h-full gap-3">
        <Link to="/projects" className="text-black font-semibold hover:underline">Proyectos</Link>
        <Link to="/dashboard/newproject" className="text-black font-semibold hover:underline">Nuevo Proyecto</Link>
        <Link to="/tools/upload" className="text-black font-semibold hover:underline">Mockup desde Imagen</Link>
        <button onClick={logout} className="mt-6 text-white font-semibold hover:underline">Cerrar Sesión</button>
        <JoinProject/>
       
      </nav>
    </aside>
  );
};

export default Sidebar;
