import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectEditor = () => {
  const { projectId } = useParams();

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Editor de Proyecto #{projectId}</h1>
      
      <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
        {/* Aquí vendrá el canvas, drag-and-drop, etc */}
        <p className="text-gray-600">Aquí irá el editor visual del mockup.</p>
      </div>
    </div>
  );
};

export default ProjectEditor;
