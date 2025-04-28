import React, { useEffect, useState } from 'react';
import DynamicForm     from '../components/DynamicForm';
import { parseSchemaXml } from '../services/parseSchemaXml';

export default function SchemaEditor() {
  const [schemas, setSchemas] = useState([]);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const xml = await fetch('/mi-diagrama.xml').then((r) => r.text());
        console.log('XML crudo:', xml);
        const tables = await parseSchemaXml(xml);
        console.log('Esquemas parseados:', tables);
        setSchemas(tables);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    }
    load();
  }, []);

  if (error) return <pre className="p-4 text-red-600">{error}</pre>;
  if (!schemas.length) return <p className="p-4">Cargando…</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {schemas.map((s) => (
        <DynamicForm key={s.name} schema={s} />
      ))}
    </div>
  );
}
