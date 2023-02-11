/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";
import { logHandler } from "../utils/logHandler";
import { sendLogMessage } from "../utils/sendLogMessage";
import { colors } from "../config/colors";
import { analyzationStatus } from "../events/onMessageUpdate";

export const onMessageDelete = async (message: any): Promise<void> => {
  const messageEmbed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("Message Deleted")
    .setDescription(`A message has been deleted.`)
    .addField("Message Content", `\`\`\`${message.content}\`\`\``, false)
    .addField("Message Author", `\`\`\`${message.author}\`\`\``, false)
    .addField("Message Channel", `\`\`\`${message.channel}\`\`\``, false)
    .addField("Message ID", `\`\`\`${message.id}\`\`\``, false)
    .setThumbnail(message.author.avatarURL())
    .setTimestamp();
  if (analyzationStatus === true) {
    await sendLogMessage(message.client, messageEmbed);
    return;
  } else {
    logHandler.info(`event | A message has been deleted: ${message.content}`);
    await sendLogMessage(message.client, messageEmbed);
    return;
  }
};
