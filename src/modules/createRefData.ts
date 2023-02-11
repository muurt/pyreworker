/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";
import { logHandler } from "../utils/logHandler";
import { MessageEmbed } from "discord.js";
import { sendLogMessage } from "../utils/sendLogMessage";

/**
 * @function createRefData
 * @description Creates referral data in the database.
 * @param {string} id - The Discord ID of the referral partner.
 * @param {number} discount - The discount percentage for the referral code.
 * @param {string} code - The referral code.
 * @returns {Promise<Prisma.ReferralCreateInput | undefined>} - The newly created referral data.
 * @throws {Error} - If there is an issue with creating the referral data.
 */

export const createRefData = async (
  id: string | any,
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

    logHandler.info(
      `referral | ${id} has been added to the referral database. Code: ${code}`
    );
    const logEmbed = new MessageEmbed()
      .setTitle("Referral Code Created")
      .setDescription(`A new referral code has been created.`)
      .addField("Partner ID", `\`\`\`${id}\`\`\``, false)
      .addField("Referral Code", `\`\`\`${code}\`\`\``, false)
      .addField("Discount Percentage", `\`\`\`${discount}\`\`\``, false)
      .setTimestamp();

    await sendLogMessage(id.client, logEmbed);
    return newRefData;
  } catch (error) {
    errorHandler("createRefData module", error);
    return;
  }
};
