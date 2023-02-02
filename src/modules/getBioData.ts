import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * @function
 * @description Retrieves bio data from the database.
 * @param {string} id - The discord id to retrieve data for.
 * @returns {Promise<Prisma.BioWhereInput | undefined>} - The bio data.
 * @throws {Error} - If there is an issue with retrieving the bio data.
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
