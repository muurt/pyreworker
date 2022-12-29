import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * Creates new bio data for a given Discord user.
 * @param {string} id - The Discord user's ID.
 * @param {string} description - The description for the user's bio.
 * @returns {Promise<Prisma.BioCreateInput | undefined>} - The new bio data.
 */
export const createBioData = async (
  id: string,
  description: string // ,
  // strDepartment: string,
  // strStaff: string
): Promise<Prisma.BioCreateInput | undefined> => {
  try {
    const newBioData = await prismaClient.bio.create({
      data: {
        discordId: id,
        description: description,
        // department: strDepartment,
        // staff: strStaff,
      },
    });

    return newBioData;
  } catch (error) {
    errorHandler("createBioData module", error);
    return;
  }
};
