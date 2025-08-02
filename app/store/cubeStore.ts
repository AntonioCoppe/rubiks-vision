import { create } from 'zustand';
import { Face, Color } from '../../types/cube';

type HSVVector = { h: number; s: number; v: number };

type Centers = Partial<Record<Face, HSVVector & { color: Color }>>;

type CubeStore = {
  centers: Centers;                  // HSV + label from 6 center stickers
  faces: Partial<Record<Face, Color[]>>;
  setCenter: (f: Face, hsv: HSVVector, color: Color) => void;
  setFace: (f: Face, stickers: Color[], confidence: number) => void;
  reset: () => void;
  solution: string[];
  setSolution: (moves: string[]) => void;
};

export const useCubeStore = create<CubeStore>((set) => ({
  centers: {},
  faces: {},
  solution: [],
  setCenter: (face, hsv, color) =>
    set((state) => ({
      centers: { ...state.centers, [face]: { ...hsv, color } },
    })),
  setFace: (face, stickers /*, confidence*/) =>
    set((state) => ({
      faces: { ...state.faces, [face]: stickers },
    })),
  reset: () => set({ centers: {}, faces: {}, solution: [] }),
  setSolution: (moves) => set({ solution: moves }),
}));

