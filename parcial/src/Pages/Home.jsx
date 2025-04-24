// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Bienvenido a tu Generador de Código Angular
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
        Crea interfaces visualmente, colabora en tiempo real, y genera código profesional en Angular de forma automática.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/projects"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Ver Proyectos
        </Link>
        <Link
          to="/projects/new"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Crear Nuevo Proyecto
        </Link>
        <Link
          to="/tools/upload"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Generar desde Imagen
        </Link>
        <Link
          to="/auth/login"
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
};

export default Home;
