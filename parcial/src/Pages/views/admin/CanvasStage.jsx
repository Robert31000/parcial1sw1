// src/Pages/views/admin/CanvasStage.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useRealtime } from '../../../services/useRealtimeStore';
import ChatBox from '../../../components/ChatBox';
import ToolBox from './ToolBox';
import ClassNode from '../../../Uml/ClassNode';
import ArrowNode from '../../../Uml/ArrowNode';
import EditClassModal from '../../../Uml/EditClassModal';

export default function CanvasStage({ projectId, width = 1200, height = 700 }) {
  const stageRef = useRef();
  const [editing, setEditing] = useState(null);

  // 🔥 Selector por separado para cada campo/función
  const objects      = useRealtime((s) => s.objects);
  const selectedId   = useRealtime((s) => s.selectedId);
  const connect      = useRealtime((s) => s.connect);
  const setSelected  = useRealtime((s) => s.setSelected);
  const updateObject = useRealtime((s) => s.updateObject);

  // sólo cuando cambie el projectId
  useEffect(() => {
    connect(projectId);
  }, [projectId, connect]);

  const renderNode = (o) =>
    o.type === 'class' ? (
      <ClassNode
        key={o.id}
        node={o}
        isSelected={o.id === selectedId}
        onSelect={() => setSelected(o.id)}
        onDragEnd={(e) =>
          updateObject(o.id, { x: e.target.x(), y: e.target.y() }, projectId)
        }
        onDblClick={() => setEditing(o)}
      />
    ) : (
      <ArrowNode key={o.id} node={o} />
    );

  const handleDelete = (e) => {
    if (e.key === 'Delete' && selectedId) {
      updateObject(selectedId, null, projectId);
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleDelete);
    return () => window.removeEventListener('keydown', handleDelete);
  }, [selectedId, projectId, updateObject]);

  return (
    <div className="flex gap-4 h-[700px]">
      <ChatBox projectId={projectId} />
      <ToolBox projectId={projectId} stageRef={stageRef} />

      <Stage
        ref={stageRef}
        width={width}
        height={height}
        className="flex-1 bg-gray-50 border rounded"
      >
        <Layer>{objects.map(renderNode)}</Layer>
      </Stage>

      {editing && (
        <EditClassModal
          node={editing}
          projectId={projectId}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
