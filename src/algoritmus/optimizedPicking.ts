import { ProductPosition, Point3D, PickingItem, OptimizeResponse } from '../types';
import { greedyPicking } from './greedy';
import { dist } from '../utils/geometry';

/**
 * Function to optimize product picking.
 * @param positionsByProduct Map of productId → available positions
 * @param startingCoordinates Starting coordinates of the worker
 * @returns Total distance and ordered list of products to pick
 */
export function optimizedPicking(positionsByProduct: Map<string, ProductPosition[]>, startingCoordinates: Point3D): OptimizeResponse {
  const { pickingOrder: greedyOrder } = greedyPicking(positionsByProduct, startingCoordinates);

  const improvedOrder = twoOpt(greedyOrder, positionsByProduct, startingCoordinates);
  const improvedDistance = computeTotalDistance(improvedOrder, positionsByProduct, startingCoordinates);

  return { distance: Math.round(improvedDistance), pickingOrder: improvedOrder };
}

/**
 * Total route distance
 */
const computeTotalDistance = (pickingOrder: PickingItem[], positionsByProduct: Map<string, ProductPosition[]>, startingCoordinates: Point3D): number => {
  let total = 0;
  let currentPosition = { ...startingCoordinates };

  for (const item of pickingOrder) {
    const positions = positionsByProduct.get(item.productId)!;
    const pos = positions.find(p => p.positionId === item.positionId)!;
    total += dist(currentPosition, pos);
    currentPosition = pos;
  }

  return total;
};

/**
 * 2-Opt - heuristic picking order optimization.
 */
const twoOpt = (pickingOrder: PickingItem[], positionsByProduct: Map<string, ProductPosition[]>, startingCoordinates: Point3D): PickingItem[] => {
  let improved = true;
  let bestOrder = [...pickingOrder];

  while (improved) {
    improved = false;

    for (let i = 0; i < bestOrder.length - 1; i++) {
      for (let k = i + 1; k < bestOrder.length; k++) {
        const newOrder = [...bestOrder];
        newOrder.splice(i, k - i + 1, ...bestOrder.slice(i, k + 1).reverse());

        const newDist = computeTotalDistance(newOrder, positionsByProduct, startingCoordinates);
        const oldDist = computeTotalDistance(bestOrder, positionsByProduct, startingCoordinates);

        if (newDist < oldDist) {
          bestOrder = newOrder;
          improved = true;
        }
      }
    }
  }

  return bestOrder;
};
