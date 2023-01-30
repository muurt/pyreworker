import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

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
