// src/Uml/ArrowNode.jsx
import React from 'react';
import { Group, Line, Text } from 'react-konva';

export default function ArrowNode({ node, isSelected }) {
  const [x1, y1, x2, y2] = node.points;

  return (
    <Group>
      {/* la línea con punta en x2,y2 */}
      <Line
        points={[x1, y1, x2, y2]}
        stroke={isSelected ? '#14b8a6' : '#000'}
        strokeWidth={2}
        tension={0}
        pointerLength={10}
        pointerWidth={10}
        pointerAtEnding
      />
      {/* etiqueta de la relación en el punto medio */}
      <Text
        text={node.label}
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2 - 14}
        fontSize={14}
        fill="#000"
      />
    </Group>
  );
}
