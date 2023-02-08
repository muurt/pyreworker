/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onGuildEmojiUpdate = async (
  oldEmoji: any,
  newEmoji: any
): Promise<void> => {
  const emojiEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Emoji Updated")
    .setDescription(`An emoji has been updated.`)
    .addField("Old Emoji Name", `| ${oldEmoji.name}`, false)
    .addField("Old Emoji ID", `| ${oldEmoji.id}`, false)
    .addField("New Emoji Name", `| ${newEmoji.name}`, false)
    .addField("New Emoji ID", `| ${newEmoji.id}`, false)
    .setFooter(`Emoji ID: ${oldEmoji.id}`, oldEmoji.url)
    .setTimestamp();
  logHandler.log(
    "info",
    `${newEmoji.name} has been updated. Emoji ID: ${newEmoji.id}`
  );
  await sendLogMessage(newEmoji.client, emojiEmbed);
};
