import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * @function createBioData
 * @description Creates bio data in the database.
 * @param {string} id - The Discord ID of the user.
 * @param {string} description - The description of the user's bio.
 * @returns {Promise<Prisma.BioCreateInput | undefined>} - The newly created bio data.
 * @throws {Error} - If there is an issue with creating the bio data.
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
