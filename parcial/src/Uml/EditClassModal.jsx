import React, { useState } from 'react';
import { useRealtime } from '../services/useRealtimeStore';


export default function EditClassModal({ node, projectId, onClose }) {
    const [name, setName]       = useState(node.className);
    const [attrs, setAttrs]     = useState(node.attributes);
    const [methods, setMethods] = useState(node.methods);
    const updateObject          = useRealtime((s) => s.updateObject);
  
    const listInput = (list, setList, ph) => list.map((v, i) => (
      <div key={i} className="flex gap-1">
        <input
          value={v}
          onChange={(e) =>
            setList(list.map((x, j) => (j === i ? e.target.value : x)))
          }
          className="border flex-1 p-1"
          placeholder={ph}
        />
        <button
          className="text-red-600 text-xs"
          onClick={() => setList(list.filter((_, j) => j !== i))}
        >
          ✕
        </button>
      </div>
    ));
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow w-80 space-y-3">
          <h3 className="font-bold text-lg">Editar clase</h3>
  
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-1 w-full font-bold"
            placeholder="Nombre de clase"
          />
  
          <h4 className="font-semibold mt-2">Atributos</h4>
          {listInput(attrs, setAttrs, '+ attr : tipo')}
          <button
            className="text-blue-600 text-xs"
            onClick={() => setAttrs([...attrs, ''])}
          >
            + atributo
          </button>
  
          <h4 className="font-semibold">Métodos</h4>
          {listInput(methods, setMethods, '+ metodo()')}
          <button
            className="text-blue-600 text-xs"
            onClick={() => setMethods([...methods, ''])}
          >
            + método
          </button>
  
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={onClose}>Cancelar</button>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => {
                updateObject(
                  node.id,
                  { className: name, attributes: attrs, methods },
                  projectId
                );
                onClose();
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }
  