const prisma = require('../prisma/client')

exports.getMovies = async (req, res) => {
  try {
    const { sortBy = 'releaseDate', order = 'desc', page = 1 } = req.query

    const validSortFields = ['releaseDate', 'title']
    const validOrder = ['asc', 'desc']

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: `Invalid sortBy field: ${sortBy}` })
    }

    if (!validOrder.includes(order.toLowerCase())) {
      return res.status(400).json({ error: `Invalid order value: ${order}` })
    }

    const pageSize = 20
    const skip = (Number(page) - 1) * pageSize

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
        },
      },
    })

    res.json(movies)
  } catch (error) {
    console.error('Error fetching movies:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
