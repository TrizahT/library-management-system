import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fiction = await prisma.genre.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: { name: 'Fiction' },
  });

  const romance = await prisma.genre.upsert({
    where: { name: 'Romance' },
    update: {},
    create: { name: 'Romance' },
  });

  const technology = await prisma.genre.upsert({
    where: { name: 'Technology' },
    update: {},
    create: { name: 'Technology' },
  });

  const mystery = await prisma.genre.upsert({
    where: { name: 'Mystery' },
    update: {},
    create: { name: 'Mystery' },
  });

  const books = [
    { title: 'Things Fall Apart', author: 'Chinua Achebe', genreId: fiction.id },
    { title: 'The River Between', author: 'Ngugi wa Thiong’o', genreId: fiction.id },
    { title: 'Purple Hibiscus', author: 'Chimamanda Ngozi Adichie', genreId: fiction.id },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', genreId: fiction.id },

    { title: 'Pride and Prejudice', author: 'Jane Austen', genreId: romance.id },
    { title: 'The Notebook', author: 'Nicholas Sparks', genreId: romance.id },
    { title: 'Me Before You', author: 'Jojo Moyes', genreId: romance.id },
    { title: 'The Fault in Our Stars', author: 'John Green', genreId: romance.id },

    { title: 'Clean Code', author: 'Robert C. Martin', genreId: technology.id },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt and David Thomas', genreId: technology.id },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen et al.', genreId: technology.id },
    { title: 'Code Complete', author: 'Steve McConnell', genreId: technology.id },

    { title: 'Gone Girl', author: 'Gillian Flynn', genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genreId: mystery.id },
    { title: 'Murder on the Orient Express', author: 'Agatha Christie', genreId: mystery.id },
    { title: 'The Da Vinci Code', author: 'Dan Brown', genreId: mystery.id },
  ];

  for (const book of books) {
  
  }await prisma.book.createMany({
  data: books,
  skipDuplicates: true,
});


  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });