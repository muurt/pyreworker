import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

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
