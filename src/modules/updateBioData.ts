import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/*
 * ➞ UpdateBioData.ts
 * Exports a function that updates a bio entry in the database
 */

/*
 * ➞ createBioData
 * ➞ id | The id of the user to update
 * ➞ newDescription | The description/bio to add to the entry
 * ➞ Return type | Prisma Bio Instace or undefined
 * Tries to update a bio entry in the database
 */

export const updateBioData = async (
  id: string,
  newDescription: string
): Promise<Prisma.BioUpdateInput | undefined> => {
  try {
    const updatedBioData = await prismaClient.bio.update({
      where: { discordId: id },
      data: {
        description: newDescription,
      },
    });
    if (updatedBioData) {
      return updatedBioData;
    }
    return;
  } catch (err) {
    errorHandler("updateBioData module", err);
    return;
  }
};
