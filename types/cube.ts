export type Face = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';
export type Color = 'W' | 'R' | 'B' | 'O' | 'G' | 'Y';

export interface ScannedFace {
  face: Face;
  stickers: Color[];     // length 9, row-major
  confidence: number;    // 0..1
}

export interface CubeState {
  faces: Record<Face, Color[]>; // each length 9
}

