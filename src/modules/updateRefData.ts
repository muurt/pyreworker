import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

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
