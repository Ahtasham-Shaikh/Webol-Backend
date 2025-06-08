const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TMDB_API_KEY = "8f8256fc76b8b4b4dc45a1614dd646be";
const BASE_URL = 'https://api.themoviedb.org/3/tv/popular';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const TOTAL_PAGES = 10;

async function fetchTvShowsPage(page) {
  const url = `${BASE_URL}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
  console.log('fetchTvShowsPage', url)
  const res = await fetch(url);
  console.log(res, 'res value')

  if (!res.ok) {
    throw new Error(`Failed to fetch page ${page}: ${res.statusText}`);
  }

  const data = await res.json();

  return data.results.map(show => ({
    title: show.name,
    firstAirDate: new Date(show.first_air_date),
    lastAirDate: show.last_air_date ? new Date(show.last_air_date) : null,
    thumbnail: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
    backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : null,
  }));
}

async function seedTvShows() {
  try {
    for (let page = 1; page <= TOTAL_PAGES; page++) {
      console.log(`Fetching TV shows page ${page}...`);
      const tvShows = await fetchTvShowsPage(page);
      console.log('outside')

      for (const show of tvShows) {
        try {
          const exists = await prisma.tvShow.findFirst({ where: { title: show.title } });
          if (exists) {
            console.log(`Skipped duplicate: ${show.title}`);
            continue;
          }

          await prisma.tvShow.create({ data: show });
          console.log(`Inserted: ${show.title}`);
        } catch (err) {
          console.error(`Error inserting ${show.title}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedTvShows();
