import { errorHandler } from "../utils/errorHandler";
import { client } from "../database/database";

export const createBioData = async (id: string, description: string) => {
  try {
    const newBioData = await client.bio.create({
      data: {
        discordId: id,
        description: description,
      },
    });

    return newBioData;
  } catch (error) {
    errorHandler("getBioData module", error);
    return false;
  }
};
