export type Point3D = { 
  x: number;
  y: number;
  z: number;
};

export type ProductPosition = {
  positionId: string;
  x: number;
  y: number;
  z: number;
  productId: string;
  quantity: number;
};

export type OptimizeRequest = {
  products: string[];
  startingPosition: Point3D;
};

export type PickingItem = { 
  productId: string;
  positionId: string;
};

export type OptimizeResponse = {
  distance: number;
  pickingOrder: PickingItem[];
};
