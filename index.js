const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/movies', async (req, res) => {
  try {
    const { sortBy = 'releaseDate', order = 'desc', page = 1 } = req.query;

    // Validate sorting and order fields (basic)
    const validSortFields = ['releaseDate', 'title'];
    const validOrder = ['asc', 'desc'];

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: `Invalid sortBy field: ${sortBy}` });
    }
    if (!validOrder.includes(order.toLowerCase())) {
      return res.status(400).json({ error: `Invalid order value: ${order}` });
    }

    const pageSize = 20;
    const skip = (Number(page) - 1) * pageSize;

    const movies = await prisma.movie.findMany({
      take: pageSize,
      skip,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        comments: {
          take: 5,
          orderBy: {
            commentedAt: 'desc',
          },
        }, // if you want to include comments in the response
      },
    });

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});