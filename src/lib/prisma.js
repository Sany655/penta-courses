import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

const globalForPrisma = global;

let prismaInstance;

// Only initialize fully if we have the env variables
if (process.env.DATABASE_URL) {
  const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'penta_course',
    port: 3306,
    connectionLimit: 5
  });
  const adapter = new PrismaMariaDb(pool);
  prismaInstance = new PrismaClient({ adapter });
} else {
  prismaInstance = new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'then') return undefined; 
      return () => { throw new Error("DATABASE_URL is not set."); };
    }
  });
}

export const prisma = globalForPrisma.prisma || prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
