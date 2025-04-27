import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useRealtime } from '../../../services/useRealtimeStore';
import ChatBox from '../../../components/ChatBox';

const CanvasStage = ({ projectId, width = 1200, height = 700 }) => {
  const stageRef = useRef();

  const objects     = useRealtime((s) => s.objects);
  const selectedId  = useRealtime((s) => s.selectedId);
  const addObject   = useRealtime((s) => s.addObject);
  const updateObj   = useRealtime((s) => s.updateObject);
  const setSelected = useRealtime((s) => s.setSelected);
  const connect     = useRealtime((s) => s.connect);

  useEffect(() => { connect(projectId); }, [projectId, connect]);

  const renderObject = (obj) =>
    obj.type === 'rect' ? (
      <Rect
        key={obj.id}
        {...obj}
        draggable
        stroke={obj.id === selectedId ? '#14b8a6' : null}
        onClick={() => setSelected(obj.id)}
        onDragEnd={(e) => updateObj(obj.id, { x: e.target.x(), y: e.target.y() }, projectId)}
      />
    ) : (
      <Text
        key={obj.id}
        {...obj}
        draggable
        onClick={() => setSelected(obj.id)}
        onDragEnd={(e) => updateObj(obj.id, { x: e.target.x(), y: e.target.y() }, projectId)}
      />
    );

  return (
    <div className="flex gap-4">
      <ChatBox/>
      {/* Toolbox */}
      <div className="flex flex-col gap-2 w-full h-full bg-gray-500 p-4 rounded border">
        <button
          onClick={() =>
            addObject(
              { id: crypto.randomUUID(), type: 'rect', x: 50, y: 50, width: 120, height: 60, fill: '#4f46e5' },
              projectId,
            )
          }
          className="p-2 bg-blue-600 text-white rounded text-sm"
        >
          + Rect
        </button>
        {/* Drag nativo */}
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData('type', 'rect')}
          className="p-2 bg-blue-200 rounded text-center cursor-grab text-sm"
        >
          Rect (drag)
        </div>
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData('type', 'text')}
          className="p-2 bg-green-400 rounded text-center cursor-grab text-sm"
        >
          Texto (drag)
        </div>

      </div>

      {/* Canvas */}
   <Stage
  ref={stageRef}
  width={width}
  height={height}
  className="border border-gray-300 bg-gray-50 rounded flex-1 max-w-full h-full"
  onDrop={(e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const p = stageRef.current.getPointerPosition();
    const id = crypto.randomUUID();

    if (type === 'rect') {
      addObject({ id, type: 'rect', x: p.x, y: p.y, width: 100, height: 60, fill: '#f59e0b' }, projectId);
    }
    if (type === 'text') {
      addObject({ id, type: 'text', x: p.x, y: p.y, text: 'Nuevo texto', fontSize: 18, fill: '#111827' }, projectId);
    }
  }}
  onDragOver={(e) => e.preventDefault()}
>
  <Layer>{objects.map(renderObject)}</Layer>
</Stage>

    </div>
  );
};

export default CanvasStage;
