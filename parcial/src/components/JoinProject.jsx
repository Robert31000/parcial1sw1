import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtime } from '../services/useRealtimeStore';
import { getProjectById } from '../services/api';

const JoinProject = () => {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();
  const changeProject = useRealtime((state) => state.changeProject);

  const handleJoin = async (e) => {
    e.preventDefault();
  
    if (!codigo.trim()) {
      alert('Por favor ingrese un código válido.');
      return;
    }
  
    try {
      // Primero validamos consultando al backend si existe
      await getProjectById(codigo);
  
      // Si existe, cambiamos de proyecto
      await changeProject(codigo);
  
      // Redirigimos
      navigate(`/dashboard/projects/${codigo}/editor`);
    } catch (error) {
      console.error('Error al validar o unirse:', error);
      alert('El código de reunión no existe o es inválido.');
    }
  };
  

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-2">
      <h2 className="text-gray-700 font-semibold text-lg">Unirse a una Reunión</h2>
      <form onSubmit={handleJoin} className="flex flex-col gap-2">
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ingrese ID o código de reunión"
          className="p-2 border border-gray-300 rounded outline-none focus:border-blue-500 text-black bg-gray-100"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Unirse
        </button>
      </form>
    </div>
  );
};

export default JoinProject;
