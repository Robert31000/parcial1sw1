// src/services/useRealtimeStore.js
import { create } from 'zustand';
import { connectWS } from './wsClient';

export const useRealtime = create((set, get) => ({
  client: null,
  objects: [],
  messages: [],
  selectedId: null,

  // ── estado para “modo conectar clases” ──
  isConnecting: false,
  pendingClassId: null,

  // alternar modo conectar
  toggleConnect() {
    set((s) => ({
      isConnecting: !s.isConnecting,
      pendingClassId: null,
    }));
  },

  /**
   * Crea una flecha UML entre dos clases:
   * - Calcula centros de cada nodo
   * - Asigna points, relation, multA, multB
   * - Actualiza estado local y publica por WS
   */
  addArrow: (fromId, toId, relation, multA, multB, projectId) => {
    const { objects, client } = get();
    const from = objects.find((o) => o.id === fromId);
    const to   = objects.find((o) => o.id === toId);
    if (!from || !to) return;

    // Centros de cada nodo
    const x1 = from.x + (from.width  || 0) / 2;
    const y1 = from.y + (from.height || 0) / 2;
    const x2 = to.x   + (to.width    || 0) / 2;
    const y2 = to.y   + (to.height   || 0) / 2;

    const arrow = {
      id: crypto.randomUUID(),
      type: 'arrow',
      points: [x1, y1, x2, y2],
      relation,
      multA,
      multB,
    };

    // Actualizar estado local
    set((s) => ({ objects: [...s.objects, arrow] }));

    // Enviar parche via WebSocket
    client?.publish({
      destination: `/app/project/${projectId}/update`,
      body: JSON.stringify({ op: 'add', node: arrow }),
    });
  },

  /**
   * Se invoca desde ClassNode al hacer click:
   * - Primer click marca origen
   * - Segundo click pide relación y multip. y crea flecha
   */
  handlePickClass(classId, projectId) {
    const { isConnecting, pendingClassId } = get();
    if (!isConnecting) return;

    if (!pendingClassId) {
      // Primer extremo
      requestAnimationFrame(() => set({ pendingClassId: classId }));
      return;
    }
    if (pendingClassId !== classId) {
      // Segundo extremo
      const relation = prompt('Tipo de relación', 'asocia')     || '';
      const multA    = prompt('Multiplicidad origen', '1')      || '';
      const multB    = prompt('Multiplicidad destino', '0..*')  || '';
      get().addArrow(pendingClassId, classId, relation, multA, multB, projectId);
      requestAnimationFrame(() =>
        set({ pendingClassId: null, isConnecting: false })
      );
    }
  },

  // ── Conexión WebSocket ──
  connect(projectId) {
    if (get().client) return;
    const client = connectWS(() => {
      client.subscribe(`/topic/project/${projectId}`, ({ body }) => {
        const patch = JSON.parse(body);
        set({ objects: applyPatch(get().objects, patch) });
      });
      client.subscribe(`/topic/chat/${projectId}`, ({ body }) => {
        const msg = JSON.parse(body);
        set((s) => ({ messages: [...s.messages, msg] }));
      });
    });
    set({ client });
  },
  disconnect() {
    get().client?.deactivate();
    set({ client: null });
  },

  // ── CRUD Canvas ──
  addObject(obj, projectId) {
    set((s) => ({ objects: [...s.objects, obj] }));
    get().client?.publish({
      destination: `/app/project/${projectId}/update`,
      body: JSON.stringify({ op: 'add', node: obj }),
    });
  },
  updateObject(id, attrs, projectId) {
    set((s) => ({
      objects: s.objects.map((o) =>
        o.id === id ? { ...o, ...attrs } : o
      ),
    }));
    get().client?.publish({
      destination: `/app/project/${projectId}/update`,
      body: JSON.stringify({ op: 'update', nodeId: id, attrs }),
    });
  },

  // Selección de nodos
  setSelected(id) {
    set({ selectedId: id });
  },

  // ── Chat ──
  sendMsg(projectId, msg) {
    const full = { ...msg, id: crypto.randomUUID(), timestamp: Date.now() };
    set((s) => ({ messages: [...s.messages, full] }));
    get().client?.publish({
      destination: `/app/chat/${projectId}`,
      body: JSON.stringify(full),
    });
  },

  // Cambiar de proyecto (desconecta y limpia estado)
  changeProject(newId) {
    get().disconnect();
    set({ objects: [], messages: [], selectedId: null });
    get().connect(newId);
  },
}));

// Util para parchear el estado según WS
function applyPatch(list, patch) {
  if (patch.op === 'add')    return [...list, patch.node];
  if (patch.op === 'update') return list.map(o => o.id === patch.nodeId ? { ...o, ...patch.attrs } : o);
  if (patch.op === 'delete') return list.filter(o => o.id !== patch.nodeId);
  return list;
}
