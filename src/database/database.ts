import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

/*
 * ➞ Database.ts
 * Exoirts a function that tries to connect with the MongoDB Atlas
 * Exports the connected client as "prismaClient"
 */

const $prismaClient = new PrismaClient();

/*
 * ➞ connectDatabase
 * ➞ Return type | Promises void
 * Tries to connect to the database and logs the info
 */

export const connectDatabase = async (): Promise<void> => {
  try {
    await $prismaClient.$connect();
    logHandler.log("info", "Connection with the database established!");
  } catch (error) {
    errorHandler("database connection", error);
  }
};

export const prismaClient = $prismaClient;
