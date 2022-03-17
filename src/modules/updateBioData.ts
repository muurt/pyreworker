import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

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
