import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Main entry for your schema
  schema: "prisma/schema.prisma",

  // Where migrations should be generated and seed script
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // Database connection URL for Prisma CLI (migrations, etc.)
  datasource: {
    url: env("DATABASE_URL"),
  },
});
