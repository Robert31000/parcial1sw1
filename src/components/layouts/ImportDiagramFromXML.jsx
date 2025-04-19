import * as go from 'gojs';

/**
 * Importa un diagrama UML desde contenido XML en formato XMI y lo carga en un diagrama GoJS.
 * 
 * @param {string} xmlContent - El contenido XML en texto.
 * @param {go.Diagram} diagram - Instancia del diagrama GoJS donde se cargarán los nodos y enlaces.
 */
export function importDiagramFromXML(xmlContent, diagram) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

  console.log("📥 XML leído correctamente:", xmlDoc);

  // ============ Procesar Clases (Nodos) ============
  const classElements = xmlDoc.getElementsByTagName("UML:Class");
  const nodes = [];

  for (let i = 0; i < classElements.length; i++) {
    const classElement = classElements[i];
    const className = classElement.getAttribute("name");
    const classId = classElement.getAttribute("xmi.id");

    const attributes = Array.from(classElement.getElementsByTagName("UML:Attribute"))
      .map(attr => {
        const expression = attr.getElementsByTagName("UML:Expression")[0];
        return expression
          ? `${attr.getAttribute("name")}:${expression.getAttribute("body")}`
          : `${attr.getAttribute("name")}`;
      })
      .join("\n");

    // Buscar geometría para obtener posición (loc)
    const diagramElement = xmlDoc.querySelector(`[subject="${classId}"]`);
    const geometry = diagramElement?.getAttribute("geometry");
    const loc = geometry
      ? geometry.split(';').map(s => s.split('=')[1]).slice(0, 2).join(' ')
      : "0 0";

    nodes.push({
      key: className,
      attributes: attributes,
      loc: loc
    });

    console.log(`📦 Nodo: ${className} | Atributos: ${attributes} | Loc: ${loc}`);
  }

  // ============ Procesar Relaciones (Enlaces) ============
  const associations = xmlDoc.getElementsByTagName('UML:Association');
  const links = [];

  for (let i = 0; i < associations.length; i++) {
    const association = associations[i];
    const ends = association.getElementsByTagName("UML:AssociationEnd");

    if (ends.length >= 2) {
      const sourceId = ends[0].getAttribute("type");
      const targetId = ends[1].getAttribute("type");

      const sourceNode = nodes.find(node => `EAID_${node.key}` === sourceId);
      const targetNode = nodes.find(node => `EAID_${node.key}` === targetId);

      if (sourceNode && targetNode) {
        links.push({
          from: sourceNode.key,
          to: targetNode.key,
          category: association.getAttribute("xmi.id")?.includes("Aggregation")
            ? "Aggregation"
            : "Association"
        });

        console.log(`🔗 Relación: ${sourceNode.key} --> ${targetNode.key}`);
      }
    } else {
      console.warn('⚠️ Asociación inválida: menos de dos extremos.');
    }
  }

  // ============ Cargar en el diagrama ============
  diagram.model = new go.GraphLinksModel(nodes, links);

  console.log("✅ Nodos cargados:", nodes);
  console.log("✅ Enlaces cargados:", links);
}
