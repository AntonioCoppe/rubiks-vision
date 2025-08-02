declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const Pressable: any;
  export const StyleSheet: any;
  export const Alert: any;
}

declare module 'react' {
  export const useEffect: any;
  export const useState: any;
  export const useCallback: any;
  export const useRef: any;
  export const useMemo: any;
  const React: any;
  export default React;
}

declare module 'react-native-pixel-color' {
  export interface PixelColorResult {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsv: { h: number; s: number; v: number };
  }

  export interface Coordinates {
    x: number;
    y: number;
    width?: number;
    height?: number;
  }

  export default {
    getHex: (uri: string, coordinates: Coordinates) => Promise<string>,
    getRGB: (uri: string, coordinates: Coordinates) => Promise<{ r: number; g: number; b: number }>,
    getHSV: (uri: string, coordinates: Coordinates) => Promise<{ h: number; s: number; v: number }>
  };
}

declare module 'react-native-svg' {
  export const Svg: any;
  export const Rect: any;
  export default Svg;
}

declare module 'react-native-vision-camera' {
  export const Camera: any;
  export const useCameraDevice: any;
  export const useCameraPermission: any;
}

declare module 'zustand' {
  export function create<T>(fn: (set: any, get: any) => T): () => T;
}

declare module 'kociemba' {
  export function solve(state: string): string;
}