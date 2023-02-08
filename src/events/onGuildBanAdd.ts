/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onGuildBanAdd = async (guild: any, user: any): Promise<void> => {
  const banEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Member Banned")
    .setDescription(`A member has been banned from the server.`)
    .addField("User Tag", `| ${user.tag}`, false)
    .addField("User ID", `| ${user.id}`, false)
    .addField("User Avatar", `| ${user.avatar}`, false)
    .addField("User Discriminator", `| ${user.discriminator}`, false)
    .addField("User Created At", `| ${user.createdAt}`, false)
    .setThumbnail(user.avatarURL())
    .setTimestamp();
  logHandler.log("info", `${user.tag} has been banned from the server.`);
  await sendLogMessage(guild.client, banEmbed);
};
