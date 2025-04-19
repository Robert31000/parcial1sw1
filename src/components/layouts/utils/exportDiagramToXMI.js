// src/utils/exportDiagramToXMI.js
export function exportDiagramToXMI(diagram) {
    const nodes = diagram.model.nodeDataArray;
    const links = diagram.model.linkDataArray;
  
    let xmiContent = `<?xml version="1.0" encoding="windows-1252"?>\n`;
    xmiContent += `
  <XMI xmi.version="1.1" xmlns:UML="omg.org/UML1.3">
    <XMI.header>
      <XMI.documentation>
        <XMI.exporter>GoJS Diagram Exporter</XMI.exporter>
        <XMI.exporterVersion>1.0</XMI.exporterVersion>
      </XMI.documentation>
    </XMI.header>
    <XMI.content>
      <UML:Model name="GoJS Diagram" xmi.id="EA_Model">
        <UML:Namespace.ownedElement>\n`;
  
    // NODOS
    nodes.forEach(node => {
      const loc = node.loc.split(" ");
      xmiContent += `
      <UML:Class name="${node.key}" xmi.id="EAID_${node.key.replace(/\s/g, '_')}" visibility="public">
        <UML:Classifier.feature>
          ${node.attributes.split("\n").map(attr => {
            const [name, type = ''] = attr.split(":");
            return `
            <UML:Attribute name="${name}" visibility="private" changeable="none">
              <UML:Attribute.initialValue>
                <UML:Expression body="${type}" />
              </UML:Attribute.initialValue>
            </UML:Attribute>`;
          }).join('')}
        </UML:Classifier.feature>
      </UML:Class>\n`;
  
      xmiContent += `<UML:DiagramElement geometry="Left=${loc[0]};Top=${loc[1]};Right=${+loc[0] + 100};Bottom=${+loc[1] + 80};" subject="EAID_${node.key.replace(/\s/g, '_')}" />\n`;
    });
  
    // RELACIONES
    links.forEach(link => {
      const source = nodes.find(n => n.key === link.from);
      const target = nodes.find(n => n.key === link.to);
      if (!source || !target) return;
  
      const srcId = `EAID_${source.key.replace(/\s/g, '_')}`;
      const tgtId = `EAID_${target.key.replace(/\s/g, '_')}`;
      const relationId = `EAID_${link.category}_${source.key}_to_${target.key}`;
  
      let aggregation = '';
      if (link.category === "Aggregation") aggregation = ` aggregation="shared"`;
      if (link.category === "Composition") aggregation = ` aggregation="composite"`;
  
      xmiContent += `
      <UML:Association xmi.id="${relationId}" visibility="public">
        <UML:Association.connection>
          <UML:AssociationEnd type="${srcId}" visibility="public"/>
          <UML:AssociationEnd type="${tgtId}" visibility="public"${aggregation}/>
        </UML:Association.connection>
      </UML:Association>\n`;
  
      const [x1, y1] = source.loc.split(" ");
      const [x2, y2] = target.loc.split(" ");
      xmiContent += `<UML:DiagramElement geometry="SX=${x1};SY=${y1};EX=${x2};EY=${y2};" subject="${relationId}" style="Hidden=0;" />\n`;
    });
  
    // CIERRE DEL DOCUMENTO
    xmiContent += `
        </UML:Namespace.ownedElement>
      </UML:Model>
    </XMI.content>
    <UML:Diagram name="GoJS Diagram" xmi.id="EA_Diagram" diagramType="ClassDiagram">
      <UML:Diagram.element>
        ${nodes.map(node => {
          const [x, y] = node.loc.split(" ");
          return `<UML:DiagramElement geometry="Left=${x};Top=${y};Right=190;Bottom=160;" subject="EAID_${node.key.replace(/\s/g, '_')}" />`;
        }).join('\n')}
      </UML:Diagram.element>
    </UML:Diagram>
  </XMI>`;
  
    // DESCARGAR ARCHIVO
    const blob = new Blob([xmiContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'diagram.xmi';
    link.click();
  }
  