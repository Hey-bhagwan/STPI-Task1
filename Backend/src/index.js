const express = require('express');
const cors = require('cors');
const { z } = require('zod');
const prisma = require('../db/client');

const app = express();

app.use(cors());
app.use(express.json());

// Schema for a single medicine entry
const medicineSchema = z.object({
    name: z.string(),
    destination: z.number().int().nonnegative(),
    quantity: z.number().int().nonnegative()
});

// Schema for array of medicine entries
const inputArraySchema = z.array(medicineSchema);

app.put('/api/v1/submit', async (req, res) => {
    const parseResult = inputArraySchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid input format', details: parseResult.error.errors });
    }

    const medicines = parseResult.data;

    try {
        await prisma.medTrack.createMany({
            data: medicines,
            skipDuplicates: true
        });

        return res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('DB Error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/v1/tsp', async (req, res) => {
    try {
        const medicines = await prisma.medTrack.findMany();
        if (medicines.length === 0) {
            return res.status(404).json({ error: 'No medicines found' });
        }

        const dist = [
            [0, 10, 20, 30, 40, 50],
            [10, 0, 25, 35, 45, 55],
            [20, 25, 0, 15, 25, 35],
            [30, 35, 15, 0, 20, 30],
            [40, 45, 25, 20, 0, 10],
            [50, 55, 35, 30, 10, 0]
        ];

        const activeLocationsSet = new Set();
        for (const med of medicines) {
            if (med.destination !== 0) {
                activeLocationsSet.add(med.destination);
            }
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        const activeLocations = shuffle(Array.from(activeLocationsSet));
        
        const tspLocations = [0, ...activeLocations];

        const n = tspLocations.length;
        const subDist = Array.from({ length: n }, (_, i) =>
            Array.from({ length: n }, (_, j) => dist[tspLocations[i]][tspLocations[j]])
        );

        let minCost = Infinity;
        let bestPath = [];

        function tsp(currIndex, visited, path, count, cost, subDist, n) {
            path[count - 1] = currIndex;

            if (count === n) {
                const totalCost = cost + subDist[currIndex][0];
                if (totalCost < minCost) {
                    minCost = totalCost;
                    bestPath = [...path.slice(0, n), 0]; // Return to base
                }
                return;
            }

            for (let i = 0; i < n; i++) {
                if (!visited[i] && subDist[currIndex][i] > 0) {
                    visited[i] = true;
                    tsp(i, visited, path, count + 1, cost + subDist[currIndex][i], subDist, n);
                    visited[i] = false;
                }
            }
        }

        const visited = Array(n).fill(false);
        visited[0] = true;
        const path = Array(n);
        tsp(0, visited, path, 1, 0, subDist, n);

        const deliveryDetails = [];

        for (let i = 1; i < bestPath.length; i++) {
            const location = tspLocations[bestPath[i]];
            const medsHere = medicines.filter(m => m.destination === location);
            deliveryDetails.push({
                location,
                deliveries: medsHere.map(med => ({
                    name: med.name,
                    quantity: med.quantity
                }))
            });
        }

        return res.status(200).json({
            cost: minCost,
            route: bestPath.map(i => tspLocations[i]),
            deliveryDetails
        });

    } catch (error) {
        console.error('Error fetching TSP data:', error);
        res.status(500).json({ error: 'Internal server error' });
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


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
