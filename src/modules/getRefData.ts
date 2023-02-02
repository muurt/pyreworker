import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * @function
 * @description Retrieves referral data from the database.
 * @param {string} code - The referral code to retrieve data for.
 * @returns {Promise<Prisma.ReferralWhereInput | undefined>} - The referral data.
 * @throws {Error} - If there is an issue with retrieving the referral data.
 */

export const getRefData = async (
  code: string
): Promise<Prisma.ReferralWhereInput | undefined> => {
  try {
    const targetRefData = await prismaClient.referral.findUnique({
      where: {
        code: code,
      },
    });

    if (targetRefData) {
      return targetRefData;
    }

    return;
  } catch (error) {
    errorHandler("getRefData module", error);
    return;
  }
};
