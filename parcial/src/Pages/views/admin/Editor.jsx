import React from 'react';
import { useParams } from 'react-router-dom';
import CanvasStage from './CanvasStage';


const ProjectEditor = () => {
  const { projectId } = useParams();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Editor de Proyecto #{projectId}</h1>

      <div className="flex gap-6 w-full overflow-hidden">
        <CanvasStage projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectEditor;
