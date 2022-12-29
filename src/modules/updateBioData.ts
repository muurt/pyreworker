import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * Updates the bio data for a given Discord user.
 * @param {string} id - The Discord user's ID.
 * @param {string} newDescription - The new description for the user's bio.
 * @returns {Promise<Prisma.BioUpdateInput | undefined>} - The updated bio data.
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
