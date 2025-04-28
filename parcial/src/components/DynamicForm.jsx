// src/components/DynamicForm.jsx
import React, { useState } from 'react';

/**
 * @param {{
 *   schema: {
 *     name: string,
 *     columns: Array<{ name: string, type: string }>
 *   }
 * }} props
 */
export default function DynamicForm({ schema }) {
  // inicializo estado con keys de columnas vacías
  const [form, setForm] = useState(
    Object.fromEntries(schema.columns.map((c) => [c.name, '']))
  );

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Enviando datos de ${schema.name}: ` + JSON.stringify(form));
    // aquí podrías llamar a tu API…
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">{schema.name}</h2>
      {schema.columns.map((col) => (
        <div key={col.name}>
          <label className="block text-sm font-medium text-gray-700">
            {col.name}
          </label>
          <input
            name={col.name}
            type={col.type === 'number' ? 'number' : 'text'}
            value={form[col.name]}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
      ))}
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar {schema.name}
      </button>
    </form>
  );
}
