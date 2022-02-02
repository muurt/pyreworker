import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/*
 * ➞ CreateBioData.ts
 * Exports a function that creates a bio entry in the database
 */

/*
 * ➞ createBioData
 * ➞ id | The id of the user
 * ➞ description | The description/bio to add to the entry
 * ➞ Return type | Prisma Bio Instace or undefined
 * Tries to create a bio entry in the database and returns that
 */

export const createBioData = async (
  id: string,
  description: string
): Promise<Prisma.BioCreateInput | undefined> => {
  try {
    const newBioData = await prismaClient.bio.create({
      data: {
        discordId: id,
        description: description,
      },
    });

    return newBioData;
  } catch (error) {
    errorHandler("createBioData module", error);
    return;
  }
};
