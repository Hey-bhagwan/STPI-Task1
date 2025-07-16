require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { z } = require('zod');
const prisma = require('../db/client');
const NodeCache = require('node-cache');
const axios = require('axios');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hr TTL

app.use(cors());
app.use(express.json());

// Medicine validation schema
const medicineSchema = z.object({
  name: z.string(),
  quantity: z.number().int().nonnegative(),
  location: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number()
  })
});

const inputArraySchema = z.array(medicineSchema);

// 📌 Warehouse coordinates
const warehouse = {
  address: 'Warehouse, Bengaluru',
  lat: 12.9716,
  lng: 77.5946
};

app.put('/api/v1/submit', async (req, res) => {
  const parseResult = inputArraySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input format', details: parseResult.error.errors });
  }

  const medicines = parseResult.data;

  const flatData = medicines.map(m => ({
    name: m.name,
    quantity: m.quantity,
    address: m.location.address,
    lat: m.location.lat,
    lng: m.location.lng,
  }));

  try {
    await prisma.medTrack.deleteMany();
    await prisma.medTrack.createMany({ data: flatData });


    const allPoints = [warehouse, ...flatData.map(m => ({
      lat: m.lat,
      lng: m.lng
    }))];

    const cacheKey = allPoints.map(p => `${p.lat},${p.lng}`).join('|');

    const origins = allPoints.map(p => `${p.lat},${p.lng}`).join('|');
    const destinations = origins;

    const matrixRes = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins,
        destinations,
        key: process.env.GOOGLE_MAPS_API_KEY,
      }
    });

    if (matrixRes.data.status !== 'OK') {
      console.error('Matrix API error:', matrixRes.data);
      return res.status(500).json({ error: 'Failed to fetch distance matrix' });
    }

    const matrix = matrixRes.data.rows.map(row =>
      row.elements.map(el => (el.status === 'OK' ? el.distance.value : Infinity))
    );

    cache.set(cacheKey, matrix);
    cache.set(`${cacheKey}-meds`, flatData);

    return res.status(201).json({ message: 'Data inserted and distance matrix cached successfully' });

  } catch (err) {
    console.error('DB/API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/v1/tsp', async (req, res) => {
  try {
    
    

    const medicines = await prisma.medTrack.findMany();
    if (medicines.length === 0) {
      return res.status(404).json({ error: 'No medicines found' });
    }

    const allPoints = [ 
      warehouse, 
      ...medicines.map(m => ({ lat: m.lat, lng: m.lng, address: m.address }))
    ];    
    const cacheKey = allPoints.map(p => `${p.lat},${p.lng}`).join('|');

    const matrix = cache.get(cacheKey);
    const flatData = cache.get(`${cacheKey}-meds`);

    if (!matrix || !flatData) {
      return res.status(500).json({ error: 'Distance matrix missing in cache. Please resubmit.' });
    }

    const n = matrix.length;
    let minCost = Infinity;
    let bestPath = [];

    const tsp = (currIndex, visited, path, count, cost) => {
      path[count - 1] = currIndex;
      if (count === n) {
        const totalCost = cost + matrix[currIndex][0];
        if (totalCost < minCost) {
          minCost = totalCost;
          bestPath = [...path.slice(0, n), 0];
        }
        return;
      }

      for (let i = 1; i < n; i++) {
        if (!visited[i] && matrix[currIndex][i] < Infinity) {
          visited[i] = true;
          tsp(i, visited, path, count + 1, cost + matrix[currIndex][i]);
          visited[i] = false;
        }
      }
    };

    const visited = Array(n).fill(false);
    visited[0] = true;
    tsp(0, visited, Array(n), 1, 0);

    const deliveryDetails = [];

    for (let i = 1; i < bestPath.length - 1; i++) {
      const locIndex = bestPath[i];
      const point = allPoints[locIndex];

      const meds = flatData.filter(m => m.lat === point.lat && m.lng === point.lng);
      const address = meds.length > 0 ? meds[0].address : `${point.lat},${point.lng}`;

      deliveryDetails.push({
        location: address,
        deliveries: meds.map(m => ({ name: m.name, quantity: m.quantity }))
      });
    }

    const readableRoute = bestPath.map(i => {
      const point = allPoints[i];
      if (point.lat === warehouse.lat && point.lng === warehouse.lng) {
        return warehouse.address;
      }
      const match = flatData.find(m => m.lat === point.lat && m.lng === point.lng);
      return match ? match.address : `${point.lat},${point.lng}`;
    });
    

    return res.status(200).json({
      cost: minCost,
      route: readableRoute,
      deliveryDetails
    });

  } catch (error) {
    console.error('Error computing TSP:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/api/v1/delete-all', async (req, res) => {
  try {
    const result = await prisma.medTrack.deleteMany({});
    return res.status(200).json({
      message: 'All entries deleted successfully',
      deletedCount: result.count
    });
  } catch (error) {
    console.error('Error deleting entries:', error);
    return res.status(500).json({ error: 'Failed to delete entries' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
