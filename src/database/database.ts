import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

const $prismaClient = new PrismaClient();

// * Creates the database connection using PRISMA.

export const connectDatabase = async (): Promise<void> => {
  try {
    await $prismaClient.$connect();
    logHandler.log("info", "Connection with the database established!");
  } catch (error) {
    errorHandler("database connection", error);
  }
};

export const prismaClient = $prismaClient;
