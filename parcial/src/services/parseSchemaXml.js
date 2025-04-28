import { parseStringPromise } from "xml2js";
/**
 * Convierte un XML de esquema de tablas a un array de objetos:
 * [
 *   { name: 'User', columns: [ { name: 'id', type: 'number' }, … ] },
 *   …
 * ]
 */
export async function parseSchemaXml(xmlString) {
    const result = await parseStringPromise(xmlString, {
      explicitArray: false,
      mergeAttrs:    true,    // mete los atributos (p.ej. name, type) en el objeto
      trim:          true
    });
  
    // 1) Descubrimos el nodo raíz (puede llamar <database>, <schema>, etc)
    const rootKey = Object.keys(result)[0];
    const root    = result[rootKey];
    if (!root) throw new Error(`No pude encontrar el nodo raíz en tu XML`);
  
    // 2) Buscamos dónde están las tablas
    //    Puede venir como root.table o root.tables.table
    let tables = root.table ?? root.tables?.table;
    if (!tables) throw new Error(`No encontré <table> dentro de <${rootKey}>`);
  
    // 3) Asegurarnos de que sea array
    if (!Array.isArray(tables)) tables = [tables];
  
    // 4) Para cada tabla, extraemos columnas
    return tables.map((t) => {
      // si usaste <columns><column …/></columns>
      let cols = t.column ?? t.columns?.column;
      if (!cols) throw new Error(`La tabla ${t.name} no tiene columnas`);
      if (!Array.isArray(cols)) cols = [cols];
      return {
        name:    t.name,
        columns: cols.map((c) => ({
          name: c.name,
          type: c.type || 'string'
        }))
      };
    });
  }