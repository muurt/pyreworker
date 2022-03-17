import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

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
