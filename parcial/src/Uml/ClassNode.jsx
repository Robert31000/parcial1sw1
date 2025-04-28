import React from 'react';
import { Rect, Text, Group, Line } from 'react-konva';
import { useRealtime } from '../services/useRealtimeStore';

/**
 * Dibuja una clase UML con tres secciones.
 * Se agrupa en <Group> para moverla toda a la vez.
 */


const ClassNode = ({
  node,
  isSelected,
  projectId,
  onSelect,
  onDrag,
  onDblClick,
}) => {
  const { handlePickClass, setSelected } = useRealtime(); 
  const { x, y, width, height, className, attributes, methods } = node;
  const headerH = 28;
  const attrH   = 20 * attributes.length || 20;
  const methodY = y + headerH + attrH;



  return (
    <Group
  id={`c-${node.id}`}
  x={node.x}
  y={node.y}
  draggable
  onClick={() => handlePickClass(node.id, projectId)}


    >
      {/* contenedor */}
      <Rect
        width={width}
        height={height}
        stroke={isSelected ? '#14b8a6' : '#111827'}
        strokeWidth={isSelected ? 2 : 1}
        fill="#fff"
        cornerRadius={4}
      />
      {/* separadores */}
      <Line
        points={[0, headerH, width, headerH]}
        stroke="#111827"
        strokeWidth={1}
      />
      <Line
        points={[0, headerH + attrH, width, headerH + attrH]}
        stroke="#111827"
        strokeWidth={1}
      />

      {/* encabezado */}
      <Text
        text={className}
        x={4}
        y={4}
        width={width - 8}
        fontStyle="bold"
        align="center"
      />

      {/* atributos */}
      <Text
        text={attributes.join('\n')}
        x={4}
        y={headerH + 4}
        width={width - 8}
        fontSize={12}
      />

      {/* métodos */}
      <Text
        text={methods.join('\n')}
        x={4}
        y={methodY + 4}
        width={width - 8}
        fontSize={12}
      />
    </Group>
  );
};

export default ClassNode;
