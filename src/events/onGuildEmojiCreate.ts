/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "./sendLogMessage";
import { colors } from "../config/colors";

export const onGuildEmojiCreate = async (emoji: any): Promise<void> => {
  const emojiEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Emoji Created")
    .setDescription(`A new emoji has been created.`)
    .addField("Emoji Name", `| ${emoji.name}`, false)
    .addField("Emoji ID", `| ${emoji.id}`, false)
    .setTimestamp();
  logHandler.log(
    "info",
    `${emoji.name} has been created. Emoji ID: ${emoji.id}`
  );
  await sendLogMessage(emoji.client, emojiEmbed);
};
