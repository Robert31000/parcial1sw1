// src/store/useCanvasStore.js

import { create } from "zustand";

export const useCanvasStore = create((set) => ({
  objects: [],
  selectedId: null,

  /** acciones */
  addObject: (obj) =>
    set((s) => ({ objects: [...s.objects, obj] })),

  updateObject: (id, attrs) =>
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, ...attrs } : o)),
    })),

  setSelected: (id) => set({ selectedId: id }),
}));
