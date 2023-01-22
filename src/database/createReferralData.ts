import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "./database";
import { Prisma } from "@prisma/client";

/**
 * Creates new referral data for a given referral code.
 * @param {string} code - The referral code.
 * @param {string} description - The description for the referral code.
 * @param {string} partner - The partner for the referral code.
 * @param {string} discount - The discount for the referral code.
 * @param {string} services - The services for the referral code.
 * @returns {Promise<Prisma.ReferralCodeCreateInput | undefined>} - The new referral data.
 */

export const createReferralData = async (
  code: string,
  description: string,
  partner: string,
  discount: number,
  services: string
): Promise<Prisma.ReferralCodeCreateInput | undefined> => {
  try {
    const newReferralData = await prismaClient.referralCode.create({
      data: {
        code: code,
        description: description,
        partner: partner,
        discount: discount,
        services: services,
      },
    });

    if (newReferralData) {
      return newReferralData;
    }

    return;
  } catch (error) {
    errorHandler("createReferralData module", error);
    return;
  }
};
