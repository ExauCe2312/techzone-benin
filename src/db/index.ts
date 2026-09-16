import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __techzoneBeninPool?: Pool;
};

// Supabase (et la plupart des Postgres managés) exigent TLS.
// En environnement serverless (Netlify), on limite le pool à quelques
// connexions et on passe par le "connection pooler" de Supabase
// (port 6543) côté DATABASE_URL — voir README.md.
export const pool =
  globalForDb.__techzoneBeninPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 10_000,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? undefined
      : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__techzoneBeninPool = pool;
}

export const db = drizzle(pool);
