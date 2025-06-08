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
    // Every 5th comment: longer review (~4 lines)
    return faker.lorem.paragraphs(faker.number.int({ min: 2, max: 3 }));
  } else {
    // Short reviews (~2 lines)
    return faker.lorem.lines(faker.number.int({ min: 1, max: 2 }));
  }
}

async function seedComments() {
  const movies = await prisma.movie.findMany();

  for (const movie of movies) {
    const numComments = Math.floor(Math.random() * 5) + 8; // 8-12 comments

    const comments = Array.from({ length: numComments }).map((_, i) => ({
      userName: faker.person.firstName() + ' ' + faker.person.lastName(),
      rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
      review: generateReview(i),
      commentedAt: faker.date.past(),
      upvotes: generateUpvotes(),
      movieId: movie.id,
    }));

    await prisma.comment.createMany({ data: comments });

    console.log(`Seeded ${numComments} comments for movie: ${movie.title}`);
  }

  console.log('✅ Done seeding comments!');
}

seedComments()
  .catch(e => console.error('❌ Error seeding comments:', e))
  .finally(async () => await prisma.$disconnect());
