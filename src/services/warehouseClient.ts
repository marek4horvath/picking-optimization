import axios from 'axios';
import { ProductPosition } from '../types';

const API_KEY = process.env.GYMBEAM_API_KEY;
const GYMBEAM_API_URL = process.env.GYMBEAM_API_URL;

if (!API_KEY) {
  throw new Error('API_KEY error in .env');
}

if (!GYMBEAM_API_URL) {
  throw new Error('GYMBEAM_API_URL error in .env');
}

export async function fetchPositionsForProduct(productId: string): Promise<ProductPosition[]> {
  try {
    const url = `${GYMBEAM_API_URL}/products/${encodeURIComponent(productId)}/positions`;
    const res = await axios.get<ProductPosition[]>(url, {
      headers: { 'x-api-key': API_KEY },
      timeout: 5000
    });

    return res.data.filter(p => p.quantity > 0);

  } catch (err: any) {
    console.error(`Error fetching product ${productId}:`, err.message);
    return [];
  }
}
