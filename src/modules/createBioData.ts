/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandler } from "../utils/errorHandler";
import { prismaClient } from "../database/database";
import { Prisma } from "@prisma/client";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { MessageEmbed } from "discord.js";

/**
 * @function createBioData
 * @description Creates bio data in the database.
 * @param {string} id - The Discord ID of the user.
 * @param {string} description - The description of the user's bio.
 * @returns {Promise<Prisma.BioCreateInput | undefined>} - The newly created bio data.
 * @throws {Error} - If there is an issue with creating the bio data.
 */

export const createBioData = async (
  id: string | any,
  description: string
): Promise<Prisma.BioCreateInput | undefined> => {
  try {
    const newBioData = await prismaClient.bio.create({
      data: {
        discordId: id,
        description: description,
      },
    });

    const logEmbed = new MessageEmbed()
      .setTitle("Bio Created")
      .setDescription(`A new bio has been created.`)
      .addField("User ID", `\`\`\`${id}\`\`\``, false)
      .addField("Description", `\`\`\`${description}\`\`\``, false)
      .setTimestamp();
    sendLogMessage(id.client, logEmbed);
    logHandler.info(`bio | ${id} has been created.`);
    return newBioData;
  } catch (error) {
    errorHandler("createBioData module", error);
    return;
  }
};
