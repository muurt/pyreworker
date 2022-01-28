import { errorHandler } from "../utils/errorHandler";
import { client } from "../database/database";

export const updateBioData = async (
  id: string,
  description: string
): Promise<boolean> => {
  try {
    await client.bio.update({
      where: { discordId: id },
      data: {
        description: description,
      },
    });
    return true;
  } catch (err) {
    errorHandler("updateBioData module", err);
    return false;
  }
};
