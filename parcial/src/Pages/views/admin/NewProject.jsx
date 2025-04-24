import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../../services/api';

const NewProject = () => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre del proyecto es obligatorio.');
      return;
    }

    try {
      const nuevoProyecto = await createProject({ nombre });
      navigate(`/projects/${nuevoProyecto.id}/editor`);
    } catch (err) {
      setError('Error al crear el proyecto.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear nuevo proyecto</h2>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del proyecto"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        >
          Crear Proyecto
        </button>
      </form>
    </div>
  );
};

export default NewProject;
