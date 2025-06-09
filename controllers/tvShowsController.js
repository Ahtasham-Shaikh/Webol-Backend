const prisma = require('../prisma/client')

exports.getTvShows = async (req, res) => {
  try {
    const { sortBy = 'firstAirDate', order = 'desc', page = 1 } = req.query

    const validSortFields = ['firstAirDate', 'title']
    const validOrder = ['asc', 'desc']

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: `Invalid sortBy field: ${sortBy}` })
    }

    if (!validOrder.includes(order.toLowerCase())) {
      return res.status(400).json({ error: `Invalid order value: ${order}` })
    }

    const pageSize = 20
    const skip = (Number(page) - 1) * pageSize

    const tvShows = await prisma.tvShow.findMany({
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

    res.json(tvShows)
  } catch (error) {
    console.error('Error fetching TV shows:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
