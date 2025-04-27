import React, { useEffect, useState } from 'react';
import { getProjects } from '../services/api';
import { useRealtime } from '../services/useRealtimeStore';

const ProjectSwitcher = () => {
  const [projects, setProjects] = useState([]);
  const changeProject = useRealtime((s) => s.changeProject);

  useEffect(() => {
    const fetchProjects = async () => {
      const allProjects = await getProjects();
      setProjects(allProjects);
    };
    fetchProjects();
  }, []);

  const handleSelect = (id) => {
    changeProject(id);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow w-60">
      <h2 className="text-lg font-bold mb-2 text-gray-800">Cambiar Proyecto</h2>
      {projects.map((proj) => (
        <button
          key={proj.id}
          onClick={() => handleSelect(proj.id)}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          {proj.nombre}
        </button>
      ))}
    </div>
  );
};

export default ProjectSwitcher;
