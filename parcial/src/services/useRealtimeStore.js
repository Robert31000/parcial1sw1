import { create } from 'zustand';
import { connectWS } from './wsClient';

export const useRealtime = create((set, get) => ({
  client: null,
  objects: [],
  messages: [],
  selectedId: null,

  /* ---------- conexión WebSocket ---------- */
  connect: (projectId) => {
    if (get().client) return;
    const client = connectWS(() => {
      client.subscribe(`/topic/project/${projectId}`, ({ body }) => {
        const patch = JSON.parse(body);
        set({ objects: applyPatch(get().objects, patch) });
      });
      client.subscribe(`/topic/chat/${projectId}`, ({ body }) => {
        const message = JSON.parse(body);
        set((state) => ({ messages: [...state.messages, message] }));
      });
    });
    set({ client });
  },
  

  disconnect: () => {
    const client = get().client;
    if (client) {
      client.disconnect();
      set({ client: null });
    }
  },

  /* ---------- acciones canvas ---------- */
  addObject: (obj, pid) => {
    set((s) => ({ objects: [...s.objects, obj] }));
    get().client?.publish({
      destination: `/app/project/${pid}/update`,
      body: JSON.stringify({ op: 'add', node: obj }),
    });
  },
  updateObject: (id, attrs, pid) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, ...attrs } : o)),
    }));
    get().client?.publish({
      destination: `/app/project/${pid}/update`,
      body: JSON.stringify({ op: 'update', nodeId: id, attrs }),
    });
  },
  setSelected: (id) => set({ selectedId: id }),

  /* ---------- acciones chat ---------- */
  sendMsg: (pid, msg) => {
    const full = { ...msg, timestamp: Date.now() };
    set((s) => ({ messages: [...s.messages, full] }));
    get().client?.publish({
      destination: `/app/chat/${pid}`,
      body: JSON.stringify(full),
    });
  },

  /* ---------- cambio de proyecto ---------- */
  changeProject: (newProjectId) => {
    get().disconnect(); // desconecta WebSocket anterior
    set({ objects: [], messages: [] }); // limpia estado local
    get().connect(newProjectId); // conecta al nuevo proyecto
  },
}));

/* ---------- util para aplicar patch de objetos ---------- */
function applyPatch(list, patch) {
  if (patch.op === 'add') return [...list, patch.node];
  if (patch.op === 'update')
    return list.map((o) => (o.id === patch.nodeId ? { ...o, ...patch.attrs } : o));
  if (patch.op === 'delete') return list.filter((o) => o.id !== patch.nodeId);
  return list;
}
