import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "./database";
import { Prisma } from "@prisma/client";

/**
 * Gets referral data for a given referral code.
 * @param {string} code - The referral code.
 * @returns {Promise<Prisma.ReferralCodeWhereInput | undefined>} - The referral data.
 */

export const getReferralData = async (
  code: string
): Promise<Prisma.ReferralCodeWhereInput | undefined> => {
  try {
    const targetReferralData = await prismaClient.referralCode.findUnique({
      where: {
        code: code,
      },
    });

    if (targetReferralData) {
      return targetReferralData as unknown as Prisma.ReferralCodeWhereInput;
    }

    return;
  } catch (error) {
    errorHandler("getReferralData module", error);
    return;
  }
};
