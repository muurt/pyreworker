import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/*
 * ➞ GetBioData.ts
 * Exports a function that searchs for a specfic entry in the database
 */

/*
 * ➞ getBioData
 * ➞ id | The id of the user to search for
 * ➞ Return type | Prisma Bio Instace or undefined
 * Tries to find a bio entry in the database by id and returns that
 */

export const getBioData = async (
  id: string
): Promise<Prisma.BioWhereInput | undefined> => {
  try {
    const targetBioData = await prismaClient.bio.findUnique({
      where: {
        discordId: id,
      },
    });

    if (targetBioData) {
      return targetBioData;
    }

    return;
  } catch (error) {
    errorHandler("getBioData module", error);
    return;
  }
};
