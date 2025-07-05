// This file initializes and exports a Prisma Client instance for database operations.
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();
module.exports = prisma;
