// types.ts
export interface Hotspot {
  x: number;
  y: number;
}

export interface FractureResult {
  class: string;
  hotspot: Hotspot;
  originalWidth?: number;
  originalHeight?: number;
}

export interface PredictionResponse {
  fracture_result: FractureResult;
  bone_type: string;
}