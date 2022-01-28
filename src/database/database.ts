import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

const prisma = new PrismaClient();

export const connect = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logHandler.log("info", "Database connection successful.");
  } catch (error) {
    errorHandler("database connection", error);
  }
};

export const client = prisma;
