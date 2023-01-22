import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "./database";
import { Prisma } from "@prisma/client";

/**
 * Deletes referral data for a given referral code.
 * @param {string} code - The referral code.
 * @returns {Promise<Prisma.ReferralCodeDeleteArgs | undefined>} - The deleted referral data.
 */

export const deleteReferralData = async (
  code: string
): Promise<Prisma.ReferralCodeDeleteArgs | undefined> => {
  try {
    const deletedReferralData = await prismaClient.referralCode.delete({
      where: {
        code: code,
      },
    });

    if (deletedReferralData) {
      return deletedReferralData as unknown as Prisma.ReferralCodeDeleteArgs;
    }

    return;
  } catch (error) {
    errorHandler("deleteReferralData module", error);
    return;
  }
};
