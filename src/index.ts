import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { OptimizeRequest } from './types';
import { fetchPositionsForProduct } from './services/warehouseClient';
import { optimizedPicking } from './algoritmus/optimizedPicking';

const app = express();
app.use(bodyParser.json());

app.post('/optimize-picking', async (req, res) => {
  try {
    const payload = req.body as OptimizeRequest;
    const products = payload.products;
    const startingPosition = payload.startingPosition

    if (!payload || !Array.isArray(products) || !startingPosition) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    
    const productPositionEntries = await Promise.all(products.map(async product => {
      const productPosition = await fetchPositionsForProduct(product);

      return { productId: product, productPosition };
    }));

    for (const productPositionEntry of productPositionEntries) {
      if (!productPositionEntry.productPosition || productPositionEntry.productPosition.length === 0) {
        return res.status(400).json({ error: `No available positions for product ${productPositionEntry.productId}` });
      }
    }

    const positionsByProduct = new Map<string, any>();
    productPositionEntries.forEach(productPositionEntry => 
      positionsByProduct.set(productPositionEntry.productId, productPositionEntry.productPosition)
    );

    const result = optimizedPicking(positionsByProduct, startingPosition);
  
    return res.json(result);
  
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? 'Server error' });
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
