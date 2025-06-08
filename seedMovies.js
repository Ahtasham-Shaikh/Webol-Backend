const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TMDB_API_KEY = env(TMDB_API_KEY);
const BASE_URL = 'https://api.themoviedb.org/3/movie/popular';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const TOTAL_PAGES = 10;

async function fetchMoviesPage(page) {
  const url = `${BASE_URL}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch page ${page}: ${res.statusText}`);
  }

  const data = await res.json();

  return data.results.map(movie => ({
    title: movie.title,
    releaseDate: new Date(movie.release_date),
    thumbnail: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null
  }));
}

async function seedMovies() {
  try {
    for (let page = 1; page <= TOTAL_PAGES; page++) {
      console.log(`Fetching page ${page}...`);
      const movies = await fetchMoviesPage(page);

      for (const movie of movies) {
        try {
          const exists = await prisma.movie.findFirst({ where: { title: movie.title } });
          if (exists) {
            console.log(`Skipped duplicate: ${movie.title}`);
            continue;
          }

          await prisma.movie.create({ data: movie });
          console.log(`Inserted: ${movie.title}`);
        } catch (err) {
          console.error(`Error inserting ${movie.title}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedMovies();
