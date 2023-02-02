import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

/**
 * @function
 * @description Updates referral data in the database.
 * @param {string} code - The referral code.
 * @param {number} tab - The tab number.
 * @returns {Promise<Prisma.ReferralUpdateInput | undefined>} - The updated referral data.
 * @throws {Error} - If there is an issue with updating the referral data.
 */

export const updateRefData = async (
  code: string,
  tab: number
): Promise<Prisma.ReferralUpdateInput | undefined> => {
  try {
    const updatedRefData = await prismaClient.referral.update({
      where: { code: code },
      data: {
        sales: { increment: 1 },
        tab: tab,
      },
    });
    if (updatedRefData) {
      return updatedRefData;
    }
    return;
  } catch (err) {
    errorHandler("updateRefData module", err);
    return;
  }
};
