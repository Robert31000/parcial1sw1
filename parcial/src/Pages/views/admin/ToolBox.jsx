// Toolbox.jsx
import React from 'react';

export const ToolBox = () => {
  return (
    <div className="flex flex-col gap-2 w-40 bg-gray-100 p-3 border">
      <div draggable onDragStart={(e) => e.dataTransfer.setData('type', 'rect')} className="p-2 bg-blue-200 text-center rounded cursor-pointer">
        Rectángulo
      </div>
      <div draggable onDragStart={(e) => e.dataTransfer.setData('type', 'text')} className="p-2 bg-green-200 text-center rounded cursor-pointer">
        Texto
      </div>
      
    </div>
  );
};
