const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

function generateUpvotes() {
  if (Math.random() < 0.1) {
    return faker.number.int({ min: 70, max: 100 });
  }
  return faker.number.int({ min: 0, max: 10 });
}

function generateReview(index) {
  if ((index + 1) % 5 === 0) {
    return faker.lorem.paragraphs(faker.number.int({ min: 2, max: 3 }));
  } else {
    return faker.lorem.lines(faker.number.int({ min: 1, max: 2 }));
  }
}

async function updateTvShowRating(tvShowId) {
  const result = await prisma.tvComment.aggregate({
    where: { tvShowId },
    _avg: { rating: true },
  });

  await prisma.tvShow.update({
    where: { id: tvShowId },
    data: { rating: result._avg.rating },
  });
}

async function seedTvComments() {
  const tvShows = await prisma.tvShow.findMany();

  for (const show of tvShows) {
    const numComments = Math.floor(Math.random() * 5) + 8; // 8–12 comments

    const comments = Array.from({ length: numComments }).map((_, i) => ({
      userName: faker.person.firstName() + ' ' + faker.person.lastName(),
      rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
      review: generateReview(i),
      commentedAt: faker.date.past(),
      upvotes: generateUpvotes(),
      tvShowId: show.id,
    }));

    await prisma.tvComment.createMany({ data: comments });
    await updateTvShowRating(show.id);
    console.log(`✅ Seeded ${numComments} comments for TV show: ${show.title}`);
  }

  console.log('🎉 All TV show comments seeded!');
}

seedTvComments()
  .catch(e => console.error('❌ Error seeding TV comments:', e))
  .finally(async () => await prisma.$disconnect());
