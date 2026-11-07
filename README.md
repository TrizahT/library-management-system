# Library Management System

A backend application for managing a library's books, genres and users. The project is built using NestJS, TypeScript, Prisma ORM and PostgreSQL.

## Description

The Library Management System provides a structured way to manage library data. It uses a relational database to organise books, genres and users.

### Technologies Used

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Neon (hosted PostgreSQL database)

## Project Setup

Navigate to the API directory:

```bash
cd api
```

Install the project dependencies:

```bash
npm install
```

## Database Configuration

Create a `.env` file inside the `api` directory and configure your PostgreSQL connection:

```env
DATABASE_URL="your_postgresql_connection_string"
```

An example configuration is provided in `.env.example`.

## Database Migration

To apply the database schema and create the tables, run:

```bash
npx prisma migrate dev
```

## Database Seeding

To populate the database with sample genres and books, run:

```bash
npx prisma db seed
```

The seed script creates four genres and sixteen sample books.

## Compile and Run the Project

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## Database Models

The database consists of three main models:

- **User:** Stores user information, including name, email and role.
- **Genre:** Stores book categories.
- **Book:** Stores book details and references its genre through a foreign key.

The Role enum defines two user roles: `PATRON` and `LIBRARIAN`.

## Schema Decisions

The database uses a relational structure to organise users, books and genres.

The Book model references the Genre model using a foreign key (`genreId`) instead of storing the genre name directly in each book record.

This approach avoids repeating genre information for multiple books