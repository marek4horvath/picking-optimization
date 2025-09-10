import { ProductPosition, PickingItem, Point3D, OptimizeResponse } from '../types';
import { dist } from '../utils/geometry';

/**
 * Optimizes the product picking route using a greedy approach
 * @param positionsByProduct Map of productId → available positions
 * @param startingCoordinates Starting coordinates of the worker
 * @returns Total distance and ordered list of products to pick
 */
export function greedyPicking(positionsByProduct: Map<string, ProductPosition[]>, startingCoordinates: Point3D): OptimizeResponse {

  const remaining = new Map(positionsByProduct);

  let currentPosition: Point3D = { ...startingCoordinates };
  const pickingOrder: PickingItem[] = [];
  let totalDistance = 0;

  while (remaining.size > 0) {
    let closestProduct: string | null = null;
    let closestPosition: ProductPosition | null = null;
    let minDistance = Infinity;

    for (const [productId, positions] of remaining.entries()) {
      if (!positions || positions.length === 0) {
        continue;
      }

      for (const pos of positions) {
        const distanceToPos = dist(currentPosition, pos);

        if (distanceToPos < minDistance) {
          minDistance = distanceToPos;
          closestProduct = productId;
          closestPosition = pos;
        }

      }
    }

    if (!closestProduct || !closestPosition) {
      throw new Error('No available position for some product');
    }

    pickingOrder.push({ productId: closestProduct, positionId: closestPosition.positionId });
    totalDistance += minDistance;

    currentPosition = { x: closestPosition.x, y: closestPosition.y, z: closestPosition.z };
    remaining.delete(closestProduct);
  }

  return { distance: Math.round(totalDistance), pickingOrder };

}
