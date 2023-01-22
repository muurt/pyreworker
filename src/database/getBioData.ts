import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "./database";
import { Prisma } from "@prisma/client";

/**
 * Gets the bio data for a given Discord user.
 * @param {string} id - The Discord user's ID.
 * @returns {Promise<Prisma.BioWhereInput | undefined>} - The bio data.
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
