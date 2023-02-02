import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * @function
 * @description Updates the bio data in the database.
 * @param {string} id - The discord id of the user.
 * @param {string} newDescription - The new description for the user.
 * @returns {Promise<Prisma.BioUpdateInput | undefined>} - The updated bio data.
 * @throws {Error} - If there is an issue with updating the bio data.
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
