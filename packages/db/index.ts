import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type PrismaClient as PrismaClientType } from "./generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma: PrismaClientType = new PrismaClient({ adapter });

export { prisma };
export type DB = PrismaClientType;
