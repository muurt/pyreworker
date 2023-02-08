/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onGuildEmojiDelete = async (emoji: any): Promise<void> => {
  const emojiEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Emoji Deleted")
    .setDescription(`An emoji has been deleted.`)
    .addField("Emoji Name", `| ${emoji.name}`, false)
    .setTimestamp();
  logHandler.log(
    "info",
    `${emoji.name} has been deleted. Emoji ID: ${emoji.id}`
  );
  await sendLogMessage(emoji.client, emojiEmbed);
};
