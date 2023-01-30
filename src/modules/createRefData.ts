import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";

export const createRefData = async (
  id: string,
  discount: number,
  code: string
): Promise<Prisma.ReferralCreateInput | undefined> => {
  try {
    const newRefData = await prismaClient.referral.create({
      data: {
        partnerDiscordId: id,
        code: code,
        discount: discount,
        sales: 0,
        tab: 0.0,
      },
    });

    return newRefData;
  } catch (error) {
    errorHandler("createRefData module", error);
    return;
  }
};
