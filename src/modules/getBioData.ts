import { errorHandler } from "../utils/errorHandler";
import { client } from "../database/database";

export const getBioData = async (id: string) => {
  try {
    const targetBioData = await client.bio.findUnique({
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
