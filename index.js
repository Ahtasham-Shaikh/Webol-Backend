const express = require('express')
const cors = require('cors')
const corsOptions = require('./middleware/corsOptions')

const moviesRoutes = require('./routes/movies')
const tvShowsRoutes = require('./routes/tvshows')

const app = express()

app.use(express.json())
app.use(cors(corsOptions))

app.use('/movies', moviesRoutes)
app.use('/tvshows', tvShowsRoutes)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})