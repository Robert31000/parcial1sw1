// src/Pages/views/admin/ToolBox.jsx
import React from 'react';
import html2canvas from 'html2canvas';
import { useRealtime } from '../../../services/useRealtimeStore';

export default function ToolBox({ projectId, stageRef }) {
  const addObject     = useRealtime((s) => s.addObject);
  const isConnecting  = useRealtime((s) => s.isConnecting);
  const toggleConnect = useRealtime((s) => s.toggleConnect);
  const objects       = useRealtime((s) => s.objects);

  return (
    <div className="flex flex-col gap-2 w-48 bg-gray-100 p-4 rounded shadow">
      {/* 1) Botón +Clase */}
      <button
        onClick={() =>
          addObject(
            {
              id: crypto.randomUUID(),
              type: 'class',
              x: 50, y: 50,
              width: 180, height: 120,
              className: 'Clase',
              attributes: ['+ atributo : tipo'],
              methods:    ['+ metodo() : void'],
            },
            projectId
          )
        }
        className="p-2 bg-indigo-400 text-white rounded text-sm"
      >
        + Clase
      </button>

      {/* 2) Modo “Conectar clases” */}
      {isConnecting ? (
        <button
          onClick={toggleConnect}
          className="p-2 bg-red-500 text-white rounded text-sm"
        >
          Cancelar conexión
        </button>
      ) : (
        <button
          onClick={() => {
            toggleConnect();
            alert('Haz clic en dos clases para conectar');
          }}
          className="p-2 bg-blue-500 text-white rounded text-sm"
        >
          Conectar clases
        </button>
      )}

      {/* 3) Guardar JSON */}
      <button
        onClick={() => {
          const json  = JSON.stringify(objects, null, 2);
          const blob  = new Blob([json], { type: 'application/json' });
          const url   = URL.createObjectURL(blob);
          const link  = document.createElement('a');
          link.href   = url;
          link.download = `diagram_${projectId}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
        className="p-2 bg-emerald-600 text-black rounded text-sm"
      >
        Guardar JSON
      </button>

      {/* 4) Exportar PNG */}
      <button
        onClick={async () => {
          if (!stageRef?.current) {
            alert('Stage no está listo');
            return;
          }
          // tomamos el DOM node del canvas de Konva
          const container = stageRef.current.container();
          const dataUrl   = await html2canvas(container).then((c) =>
            c.toDataURL('image/png')
          );
          const link = document.createElement('a');
          link.href        = dataUrl;
          link.download    = `diagram_${projectId}.png`;
          link.click();
        }}
        className="p-2 bg-indigo-600 text-white rounded text-sm"
      >
        Exportar PNG
      </button>
    </div>
  );
}
